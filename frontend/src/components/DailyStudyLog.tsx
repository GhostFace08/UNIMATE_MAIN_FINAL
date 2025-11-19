import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

interface DailyStudyLogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DailyStudyLog = ({ open, onOpenChange }: DailyStudyLogProps) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: '',
    duration_minutes: '',
    notes: ''
  })

  const { data: sessions = [] } = useQuery({
    queryKey: ['study-sessions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      
      const { data, error } = await supabase
        .from('academic_study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
      
      if (error) throw error
      return data || []
    }
  })

  const addMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('academic_study_sessions')
        .insert({
          user_id: user.id,
          date: newLog.date,
          subject: newLog.subject,
          duration_minutes: parseInt(newLog.duration_minutes),
          notes: newLog.notes || null
        })
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] })
      setNewLog({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        duration_minutes: '',
        notes: ''
      })
      toast({ title: "Study log added successfully" })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('academic_study_sessions')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] })
      toast({ title: "Study log deleted" })
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Daily Study Log</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2 p-4 bg-muted rounded-lg">
            <Input
              type="date"
              value={newLog.date}
              onChange={(e) => setNewLog({...newLog, date: e.target.value})}
            />
            <Input
              placeholder="Subject"
              value={newLog.subject}
              onChange={(e) => setNewLog({...newLog, subject: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Duration (min)"
              value={newLog.duration_minutes}
              onChange={(e) => setNewLog({...newLog, duration_minutes: e.target.value})}
            />
            <Textarea
              placeholder="Notes (optional)"
              value={newLog.notes}
              onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
              className="resize-none"
            />
            <Button onClick={() => addMutation.mutate()} size="icon" disabled={!newLog.subject || !newLog.duration_minutes}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Subject</th>
                  <th className="p-2 text-left">Duration</th>
                  <th className="p-2 text-left">Notes</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s: any) => (
                  <tr key={s.id} className="border-t">
                    <td className="p-2">{new Date(s.date).toLocaleDateString()}</td>
                    <td className="p-2 capitalize">{s.subject}</td>
                    <td className="p-2">{s.duration_minutes} min</td>
                    <td className="p-2">{s.notes || '-'}</td>
                    <td className="p-2">
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(s.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DailyStudyLog
