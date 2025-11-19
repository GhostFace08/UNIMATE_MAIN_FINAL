import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileText, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"


interface ResumeAnalysisProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const ResumeAnalysis = ({ open, onOpenChange }: ResumeAnalysisProps) => {
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  

  const { data: resumes = [] } = useQuery({
    queryKey: ['career-resumes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      
      const { data, error } = await supabase
        .from('career_resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    }
  })

  const { data: documents = [] } = useQuery({
    queryKey: ['resume-documents', conversationId],
    queryFn: async () => {
      if (!conversationId) return []
      const { data, error } = await supabase
        .from('chat_documents')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('chat_type', 'resume')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!conversationId
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const reader = new FileReader()
      const fileData = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })

      const { data, error } = await supabase
        .from('career_resumes')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_data: fileData
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['career-resumes'] })
      setSelectedResume(data.id)
      toast({
        title: "Resume uploaded successfully",
        description: `${data.file_name} has been uploaded for analysis.`
      })
    }
  })

  const uploadDocMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!conversationId) throw new Error('No active conversation')
      
      const reader = new FileReader()
      const fileData = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('chat_documents').insert({
        conversation_id: conversationId,
        user_id: user.id,
        file_name: file.name,
        file_data: fileData,
        chat_type: 'resume'
      })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-documents', conversationId] })
      toast({ title: "Document uploaded successfully" })
    },
    onError: () => {
      toast({ title: "Failed to upload document", variant: "destructive" })
    }
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      uploadMutation.mutate(files[0])
    }
  }

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadDocMutation.mutate(file)
    }
  }

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming) return

    let convId = conversationId
    const userMessage: Message = { role: 'user', content: input }
    
    try {
      // Create conversation if none exists
      if (!convId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data: newConv, error: convError } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: user.id,
            title: `Resume Analysis - ${input.slice(0, 40)}`,
            chat_type: 'resume'
          })
          .select()
          .single()

        if (convError) throw convError
        convId = newConv.id
        setConversationId(convId)
      }

      // Save user message
      const { error: msgError } = await supabase.from('chat_messages').insert({
        conversation_id: convId,
        role: 'user',
        content: input
      })

      if (msgError) throw msgError

      setMessages(prev => [...prev, userMessage])
      setInput('')
      setIsStreaming(true)

      // Stream AI response
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId: convId,
          chatType: 'resume'
        }),
      })

      if (response.status === 429 || response.status === 402) {
        const errorData = await response.json()
        toast({ 
          title: "Service unavailable", 
          description: errorData.error || "AI service is temporarily unavailable",
          variant: "destructive" 
        })
        setIsStreaming(false)
        return
      }

      if (!response.ok || !response.body) throw new Error('Failed to start stream')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''
      let textBuffer = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        textBuffer += decoder.decode(value, { stream: true })
        
        let newlineIndex: number
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex)
          textBuffer = textBuffer.slice(newlineIndex + 1)
          
          if (line.endsWith('\r')) line = line.slice(0, -1)
          if (line.startsWith(':') || line.trim() === '') continue
          if (!line.startsWith('data: ')) continue
          
          const jsonStr = line.slice(6).trim()
          if (jsonStr === '[DONE]') break
          
          try {
            const parsed = JSON.parse(jsonStr)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              assistantMessage += content
              setMessages(prev => {
                const newMessages = [...prev]
                newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantMessage }
                return newMessages
              })
            }
          } catch {
            textBuffer = line + '\n' + textBuffer
            break
          }
        }
      }

      // Save assistant message
      await supabase.from('chat_messages').insert({
        conversation_id: convId,
        role: 'assistant',
        content: assistantMessage
      })

      setIsStreaming(false)

    } catch (error) {
      console.error('Chat error:', error)
      toast({ title: "Failed to send message", variant: "destructive" })
      setIsStreaming(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Resume Analysis</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-12 gap-4 h-[75vh] overflow-hidden">
          {/* Left Sidebar - Resume List */}
          <div className="col-span-3 border-r pr-4 flex flex-col min-h-0">
            <div className="space-y-2 mb-4">
              <label htmlFor="resume-upload">
                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload Resume</p>
                </div>
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto">
              <h3 className="font-semibold text-sm mb-2">Uploaded Resumes</h3>
              {resumes.length === 0 ? (
                <p className="text-xs text-muted-foreground">No resumes uploaded yet</p>
              ) : (
                resumes.map((resume: any) => (
                  <button
                    key={resume.id}
                    onClick={() => {
                      setSelectedResume(resume.id)
                      setMessages([])
                      setConversationId(null)
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedResume === resume.id 
                        ? 'bg-primary/10 border border-primary' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{resume.file_name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(resume.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Middle - Document Viewer */}
          <div className="col-span-5 flex flex-col min-h-0">
            {/* Document Preview Section */}
            {selectedResume ? (
              <div className="bg-muted rounded-lg p-4 flex flex-col min-h-0 h-full overflow-hidden">
                <div className="bg-white rounded shadow-sm p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b">
                    <h3 className="font-semibold">Document Preview</h3>
                    <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                      {resumes.find((r: any) => r.id === selectedResume)?.file_name}
                    </p>
                  </div>
                  {resumes.find((r: any) => r.id === selectedResume)?.file_data && (
                    <div className="flex-1 overflow-hidden border rounded">
                      <embed 
                        src={resumes.find((r: any) => r.id === selectedResume)?.file_data} 
                        type="application/pdf"
                        className="w-full h-full"
                      />
                    </div>
                  )}
                  
                  {documents.length > 0 && (
                    <div className="mt-3 pt-2 border-t">
                      <p className="text-xs font-medium mb-2">Additional Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {documents.map((doc: any) => (
                          <div key={doc.id} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                            <FileText className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{doc.file_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-muted rounded-lg p-4 h-full flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload a resume to view it here</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Chat Interface */}
          <div className="col-span-4 flex flex-col min-h-0 h-full">
            <div className="flex-1 overflow-y-auto p-4 bg-muted/20 rounded-lg mb-4 scroll-smooth min-h-0">
              {selectedResume ? (
                messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    <p className="mb-2">Hello! I'm ready to help you analyze resumes.</p>
                    <p className="text-xs">Ask me anything about your resume - I can check for clarity, impact, and AI-generated content.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-card border'
                          }`}
                        >
                          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )
              ) : (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <p>Upload a resume to start the AI analysis</p>
                </div>
              )}
            </div>
            
            {selectedResume && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="doc-upload"
                    className="hidden"
                    onChange={handleDocUpload}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <Button
                    onClick={() => document.getElementById('doc-upload')?.click()}
                    size="icon"
                    variant="outline"
                    disabled={!conversationId}
                    title="Upload additional document"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Ask about your resume..."
                    className="flex-1"
                    disabled={isStreaming}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    size="icon"
                    disabled={isStreaming || !input.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ResumeAnalysis