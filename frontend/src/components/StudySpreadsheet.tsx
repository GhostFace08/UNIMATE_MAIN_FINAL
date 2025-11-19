import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

interface StudySpreadsheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const StudySpreadsheet = ({ open, onOpenChange }: StudySpreadsheetProps) => {
  const { data: sessions = [] } = useQuery({
    queryKey: ['study-sessions-spreadsheet'],
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Study Statistics</DialogTitle>
        </DialogHeader>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s: any) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="p-3 capitalize">{s.subject}</td>
                  <td className="p-3">{s.duration_minutes} minutes</td>
                  <td className="p-3">{s.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StudySpreadsheet
