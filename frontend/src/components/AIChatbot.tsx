import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Plus, MessageSquare, Upload, FileText, Edit2, Check, Pencil } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface AIChatbotProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  chatType: 'finance' | 'career' | 'academic' | 'resume'
  initialMessage?: string
  conversationId?: string | null
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  created_at: string
}

interface ChatDocument {
  id: string
  file_name: string
  created_at: string
}

const AIChatbot = ({ open, onOpenChange, title, chatType, initialMessage, conversationId }: AIChatbotProps) => {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId || null)
  const [input, setInput] = useState(initialMessage || '')
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [editingConvId, setEditingConvId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [nextChatNumber, setNextChatNumber] = useState(1)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversations
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations', chatType],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*, chat_messages(role, content, created_at)')
        .eq('user_id', user.id)
        .eq('chat_type', chatType)
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      
      // Calculate next chat number based on existing chats
      const chatNumbers = data
        ?.map(conv => {
          const match = conv.title.match(/^Chat (\d+)$/)
          return match ? parseInt(match[1]) : 0
        })
        .filter(n => n > 0) || []
      
      const maxNumber = chatNumbers.length > 0 ? Math.max(...chatNumbers) : 0
      setNextChatNumber(maxNumber + 1)
      
      return data.map(conv => ({
        id: conv.id,
        title: conv.title,
        created_at: conv.created_at,
        messages: (conv.chat_messages || [])
          .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((msg: any) => ({ role: msg.role, content: msg.content }))
      }))
    },
    enabled: open
  })

  // Fetch documents for current conversation
  const { data: documents = [] } = useQuery({
    queryKey: ['documents', currentConversationId, chatType],
    queryFn: async () => {
      if (!currentConversationId) return []
      const { data, error } = await supabase
        .from('chat_documents')
        .select('*')
        .eq('conversation_id', currentConversationId)
        .eq('chat_type', chatType)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: open && !!currentConversationId
  })

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!currentConversationId) throw new Error('No active conversation')
      
      const reader = new FileReader()
      const fileData = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('chat_documents').insert({
        conversation_id: currentConversationId,
        user_id: user.id,
        file_name: file.name,
        file_data: fileData,
        chat_type: chatType
      })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', currentConversationId, chatType] })
      toast({ title: "Document uploaded successfully" })
    },
    onError: () => {
      toast({ title: "Failed to upload document", variant: "destructive" })
    }
  })

  // Set initial conversation
  useEffect(() => {
    if (conversationId) {
      setCurrentConversationId(conversationId)
      const conv = conversations.find(c => c.id === conversationId)
      if (conv) {
        setMessages(conv.messages)
      }
    } else if (conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0].id)
      setMessages(conversations[0].messages)
    }
  }, [conversationId, conversations, currentConversationId])

  useEffect(() => {
    if (initialMessage && open) {
      setInput(initialMessage)
    }
  }, [initialMessage, open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return

    let convId = currentConversationId
    const userMessage: Message = { role: 'user', content: input }
    
    try {
      // Create new conversation if none exists
      if (!convId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data: newConv, error: convError } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: user.id,
            title: input.slice(0, 50),
            chat_type: chatType
          })
          .select()
          .single()

        if (convError) throw convError
        convId = newConv.id
        setCurrentConversationId(convId)
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
          chatType
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

      await queryClient.invalidateQueries({ queryKey: ['conversations', chatType] })
      setIsStreaming(false)

    } catch (error) {
      console.error('Chat error:', error)
      toast({ title: "Failed to send message", variant: "destructive" })
      setIsStreaming(false)
    }
  }

  const handleNewChat = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { data: newConv, error } = await supabase
      .from('chat_conversations')
      .insert({
        user_id: user.id,
        title: `Chat ${nextChatNumber}`,
        chat_type: chatType
      })
      .select()
      .single()
    
    if (error) {
      toast({ title: "Failed to create chat", variant: "destructive" })
      return
    }
    
    setCurrentConversationId(newConv.id)
    setMessages([])
    setInput('')
    setNextChatNumber(nextChatNumber + 1)
    await queryClient.invalidateQueries({ queryKey: ['conversations', chatType] })
  }

  const handleRenameConversation = async (convId: string) => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({ title: editingTitle })
        .eq('id', convId)

      if (error) throw error

      await queryClient.invalidateQueries({ queryKey: ['conversations', chatType] })
      setEditingConvId(null)
      toast({ title: "Chat renamed successfully" })
    } catch (error) {
      console.error('Error renaming conversation:', error)
      toast({ title: "Failed to rename chat", variant: "destructive" })
    }
  }

  const handleSelectConversation = (convId: string) => {
    setCurrentConversationId(convId)
    const conv = conversations.find(c => c.id === convId)
    if (conv) {
      setMessages(conv.messages)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadDocumentMutation.mutate(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] p-0 flex gap-0">
        {/* Sidebar */}
        <div className="w-64 bg-muted/30 border-r flex flex-col">
          <div className="p-3 border-b">
            <Button onClick={handleNewChat} className="w-full justify-start" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New chat
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3">
              <div className="flex justify-between items-center mb-3">
                <button 
                  onClick={handleNewChat}
                  className="font-semibold text-sm hover:text-primary cursor-pointer transition-colors"
                >
                  Recent Searches
                </button>
              </div>
              <div className="space-y-1">
                {conversations.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No conversations yet</p>
                ) : (
                  conversations.slice(0, 4).map((conv) => (
                    <div
                      key={conv.id}
                      className="group"
                    >
                      {editingConvId === conv.id ? (
                        <div className="flex gap-1">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="h-8 text-xs"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleRenameConversation(conv.id)
                              } else if (e.key === 'Escape') {
                                setEditingConvId(null)
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleRenameConversation(conv.id)}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                            conv.id === currentConversationId ? 'bg-muted' : 'hover:bg-muted/50'
                          }`}
                        >
                          <button
                            onClick={() => handleSelectConversation(conv.id)}
                            className="flex-1 truncate text-left text-sm"
                          >
                            {conv.title}
                          </button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingConvId(conv.id)
                              setEditingTitle(conv.title)
                            }}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="border-b p-4">
            <h2 className="font-semibold">{title}</h2>
          </div>
          
          {/* Documents Section */}
          {documents.length > 0 && (
            <div className="border-b p-4 bg-muted/20">
              <p className="text-sm font-medium mb-2">Uploaded Documents</p>
              <div className="flex flex-wrap gap-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 bg-background px-3 py-1 rounded-lg text-sm">
                    <FileText className="w-4 h-4" />
                    <span className="truncate max-w-[150px]">{doc.file_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
                      AI
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-4 max-w-[80%] overflow-hidden ${
                      msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                      {msg.content}
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xs">
                      You
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="max-w-3xl mx-auto flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="icon"
                variant="outline"
                className="rounded-full"
                disabled={!currentConversationId}
              >
                <Upload className="w-4 h-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Message AI..."
                className="flex-1 rounded-full"
                disabled={isStreaming}
              />
              <Button 
                onClick={handleSend} 
                size="icon" 
                className="rounded-full"
                disabled={isStreaming || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AIChatbot