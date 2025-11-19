import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

interface StudyPlanFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const StudyPlanForm = ({ open, onOpenChange }: StudyPlanFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    consistency: '',
    bestTime: '',
    dailyHours: '',
    challenge: '',
    planMethod: '',
    learnMethod: '',
    breakTime: '',
    studyPlace: '',
    organization: '',
    wantPlanner: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Study Plan Created!",
      description: "Your personalized study plan has been generated."
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>📚 College Student Study Planner – Short Quiz</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-semibold">1. How would you describe your study consistency?</Label>
            <RadioGroup value={formData.consistency} onValueChange={(v) => setFormData({...formData, consistency: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="cons-regular" />
                <Label htmlFor="cons-regular" className="font-normal">Regular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sometimes" id="cons-sometimes" />
                <Label htmlFor="cons-sometimes" className="font-normal">Sometimes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rarely" id="cons-rarely" />
                <Label htmlFor="cons-rarely" className="font-normal">Rarely</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">2. When do you study best?</Label>
            <RadioGroup value={formData.bestTime} onValueChange={(v) => setFormData({...formData, bestTime: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="morning" id="time-morning" />
                <Label htmlFor="time-morning" className="font-normal">Morning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="afternoon" id="time-afternoon" />
                <Label htmlFor="time-afternoon" className="font-normal">Afternoon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="evening" id="time-evening" />
                <Label htmlFor="time-evening" className="font-normal">Evening</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="night" id="time-night" />
                <Label htmlFor="time-night" className="font-normal">Late night</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">3. How many hours per day do you study outside class?</Label>
            <RadioGroup value={formData.dailyHours} onValueChange={(v) => setFormData({...formData, dailyHours: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="less-1" id="hours-less" />
                <Label htmlFor="hours-less" className="font-normal">&lt;1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-2" id="hours-1-2" />
                <Label htmlFor="hours-1-2" className="font-normal">1–2</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2-4" id="hours-2-4" />
                <Label htmlFor="hours-2-4" className="font-normal">2–4</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4-plus" id="hours-4plus" />
                <Label htmlFor="hours-4plus" className="font-normal">4+</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">4. What's your biggest challenge in studying?</Label>
            <RadioGroup value={formData.challenge} onValueChange={(v) => setFormData({...formData, challenge: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="procrastination" id="chal-procrastination" />
                <Label htmlFor="chal-procrastination" className="font-normal">Procrastination</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="distractions" id="chal-distractions" />
                <Label htmlFor="chal-distractions" className="font-normal">Distractions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-plan" id="chal-plan" />
                <Label htmlFor="chal-plan" className="font-normal">No plan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="motivation" id="chal-motivation" />
                <Label htmlFor="chal-motivation" className="font-normal">Motivation</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">5. How do you usually plan your study time?</Label>
            <RadioGroup value={formData.planMethod} onValueChange={(v) => setFormData({...formData, planMethod: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="plan-fixed" />
                <Label htmlFor="plan-fixed" className="font-normal">Fixed schedule</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deadline" id="plan-deadline" />
                <Label htmlFor="plan-deadline" className="font-normal">Deadline-based</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="random" id="plan-random" />
                <Label htmlFor="plan-random" className="font-normal">Random</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="plan-none" />
                <Label htmlFor="plan-none" className="font-normal">I don't plan</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">6. Which method helps you learn best?</Label>
            <RadioGroup value={formData.learnMethod} onValueChange={(v) => setFormData({...formData, learnMethod: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reading" id="learn-reading" />
                <Label htmlFor="learn-reading" className="font-normal">Reading</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="videos" id="learn-videos" />
                <Label htmlFor="learn-videos" className="font-normal">Videos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="practice" id="learn-practice" />
                <Label htmlFor="learn-practice" className="font-normal">Practice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="discussion" id="learn-discussion" />
                <Label htmlFor="learn-discussion" className="font-normal">Discussion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flashcards" id="learn-flashcards" />
                <Label htmlFor="learn-flashcards" className="font-normal">Flashcards</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">7. How long can you study before needing a break?</Label>
            <RadioGroup value={formData.breakTime} onValueChange={(v) => setFormData({...formData, breakTime: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30min" id="break-30" />
                <Label htmlFor="break-30" className="font-normal">30 min</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1hr" id="break-1hr" />
                <Label htmlFor="break-1hr" className="font-normal">1 hr</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2hrs" id="break-2hrs" />
                <Label htmlFor="break-2hrs" className="font-normal">2 hrs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="more" id="break-more" />
                <Label htmlFor="break-more" className="font-normal">More</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">8. Where do you study most effectively?</Label>
            <RadioGroup value={formData.studyPlace} onValueChange={(v) => setFormData({...formData, studyPlace: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="place-home" />
                <Label htmlFor="place-home" className="font-normal">Home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="library" id="place-library" />
                <Label htmlFor="place-library" className="font-normal">Library</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group" id="place-group" />
                <Label htmlFor="place-group" className="font-normal">Group study</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cafe" id="place-cafe" />
                <Label htmlFor="place-cafe" className="font-normal">Café</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">9. How organized is your study space and schedule?</Label>
            <RadioGroup value={formData.organization} onValueChange={(v) => setFormData({...formData, organization: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very" id="org-very" />
                <Label htmlFor="org-very" className="font-normal">Very</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="somewhat" id="org-somewhat" />
                <Label htmlFor="org-somewhat" className="font-normal">Somewhat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not" id="org-not" />
                <Label htmlFor="org-not" className="font-normal">Not at all</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">10. Would you like an AI-based planner that builds your study schedule automatically?</Label>
            <RadioGroup value={formData.wantPlanner} onValueChange={(v) => setFormData({...formData, wantPlanner: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="planner-yes" />
                <Label htmlFor="planner-yes" className="font-normal">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maybe" id="planner-maybe" />
                <Label htmlFor="planner-maybe" className="font-normal">Maybe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="planner-no" />
                <Label htmlFor="planner-no" className="font-normal">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Quiz</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default StudyPlanForm
