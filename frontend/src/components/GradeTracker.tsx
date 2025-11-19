import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

interface GradeTrackerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const GradeTracker = ({ open, onOpenChange }: GradeTrackerProps) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [newGrade, setNewGrade] = useState({
    course_code: '',
    course_name: '',
    semester: '',
    grade: '',
    credits: ''
  })

  const { data: courses = [] } = useQuery({
    queryKey: ['academic-courses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      
      const { data, error } = await supabase
        .from('academic_courses')
        .select('*')
        .eq('user_id', user.id)
        .order('semester', { ascending: false })
      
      if (error) throw error
      return data || []
    }
  })

  const addMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('academic_courses')
        .insert({
          user_id: user.id,
          course_code: newGrade.course_code,
          course_name: newGrade.course_name,
          semester: newGrade.semester,
          grade: newGrade.grade,
          credits: parseInt(newGrade.credits),
          status: 'completed'
        })
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-courses'] })
      setNewGrade({ course_code: '', course_name: '', semester: '', grade: '', credits: '' })
      toast({ title: "Grade added successfully" })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('academic_courses')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-courses'] })
      toast({ title: "Grade deleted" })
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Grade Tracker</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-2 p-4 bg-muted rounded-lg">
            <Input
              placeholder="Course Code"
              value={newGrade.course_code}
              onChange={(e) => setNewGrade({...newGrade, course_code: e.target.value})}
            />
            <Input
              placeholder="Course Name"
              value={newGrade.course_name}
              onChange={(e) => setNewGrade({...newGrade, course_name: e.target.value})}
            />
            <Input
              placeholder="Semester"
              value={newGrade.semester}
              onChange={(e) => setNewGrade({...newGrade, semester: e.target.value})}
            />
            <Select value={newGrade.grade} onValueChange={(v) => setNewGrade({...newGrade, grade: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="C+">C+</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="C-">C-</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="F">F</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Credits"
              value={newGrade.credits}
              onChange={(e) => setNewGrade({...newGrade, credits: e.target.value})}
            />
            <Button 
              onClick={() => addMutation.mutate()} 
              size="icon" 
              disabled={!newGrade.course_name || !newGrade.grade || !newGrade.credits}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Course Code</th>
                  <th className="p-2 text-left">Course Name</th>
                  <th className="p-2 text-left">Semester</th>
                  <th className="p-2 text-left">Grade</th>
                  <th className="p-2 text-left">Credits</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c: any) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-2">{c.course_code || '-'}</td>
                    <td className="p-2">{c.course_name}</td>
                    <td className="p-2">{c.semester}</td>
                    <td className="p-2 font-semibold">{c.grade || '-'}</td>
                    <td className="p-2">{c.credits}</td>
                    <td className="p-2">
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(c.id)}>
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

export default GradeTracker
