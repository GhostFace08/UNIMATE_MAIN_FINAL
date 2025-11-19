import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

interface CareerAssessmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CareerAssessmentForm = ({ open, onOpenChange }: CareerAssessmentFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    hasGoal: '',
    interest: '',
    motivation: '',
    confidence: '',
    experience: '',
    challenge: '',
    workFrequency: '',
    futureVision: '',
    workPreference: '',
    wantGuidance: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Assessment Complete!",
      description: "We're analyzing your responses to provide personalized career recommendations."
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>🎯 College Student Career Goals – Short Quiz</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-semibold">1. Do you have a clear career goal?</Label>
            <RadioGroup value={formData.hasGoal} onValueChange={(v) => setFormData({...formData, hasGoal: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="goal-yes" />
                <Label htmlFor="goal-yes" className="font-normal">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="somewhat" id="goal-somewhat" />
                <Label htmlFor="goal-somewhat" className="font-normal">Somewhat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-yet" id="goal-not" />
                <Label htmlFor="goal-not" className="font-normal">Not yet</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">2. Which area interests you most?</Label>
            <RadioGroup value={formData.interest} onValueChange={(v) => setFormData({...formData, interest: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tech" id="int-tech" />
                <Label htmlFor="int-tech" className="font-normal">Tech</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="business" id="int-business" />
                <Label htmlFor="int-business" className="font-normal">Business</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="design" id="int-design" />
                <Label htmlFor="int-design" className="font-normal">Design</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="education" id="int-education" />
                <Label htmlFor="int-education" className="font-normal">Education</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="research" id="int-research" />
                <Label htmlFor="int-research" className="font-normal">Research</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="others" id="int-others" />
                <Label htmlFor="int-others" className="font-normal">Others</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">3. What motivates your career choice?</Label>
            <RadioGroup value={formData.motivation} onValueChange={(v) => setFormData({...formData, motivation: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="salary" id="mot-salary" />
                <Label htmlFor="mot-salary" className="font-normal">Salary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="passion" id="mot-passion" />
                <Label htmlFor="mot-passion" className="font-normal">Passion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="growth" id="mot-growth" />
                <Label htmlFor="mot-growth" className="font-normal">Growth</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stability" id="mot-stability" />
                <Label htmlFor="mot-stability" className="font-normal">Stability</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="impact" id="mot-impact" />
                <Label htmlFor="mot-impact" className="font-normal">Impact</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">4. How confident are you about your skills for your chosen field?</Label>
            <RadioGroup value={formData.confidence} onValueChange={(v) => setFormData({...formData, confidence: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very" id="conf-very" />
                <Label htmlFor="conf-very" className="font-normal">Very</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="somewhat" id="conf-somewhat" />
                <Label htmlFor="conf-somewhat" className="font-normal">Somewhat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not" id="conf-not" />
                <Label htmlFor="conf-not" className="font-normal">Not confident</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">5. Have you done internships, projects, or certifications yet?</Label>
            <RadioGroup value={formData.experience} onValueChange={(v) => setFormData({...formData, experience: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="exp-yes" />
                <Label htmlFor="exp-yes" className="font-normal">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="exp-no" />
                <Label htmlFor="exp-no" className="font-normal">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">6. What's your biggest career challenge right now?</Label>
            <RadioGroup value={formData.challenge} onValueChange={(v) => setFormData({...formData, challenge: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="clarity" id="chal-clarity" />
                <Label htmlFor="chal-clarity" className="font-normal">Lack of clarity</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="guidance" id="chal-guidance" />
                <Label htmlFor="chal-guidance" className="font-normal">No guidance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="skill-gap" id="chal-skill" />
                <Label htmlFor="chal-skill" className="font-normal">Skill gap</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="confidence" id="chal-confidence" />
                <Label htmlFor="chal-confidence" className="font-normal">Low confidence</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">7. How often do you work on your career goals (skills, networking, etc.)?</Label>
            <RadioGroup value={formData.workFrequency} onValueChange={(v) => setFormData({...formData, workFrequency: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regularly" id="freq-regularly" />
                <Label htmlFor="freq-regularly" className="font-normal">Regularly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occasionally" id="freq-occasionally" />
                <Label htmlFor="freq-occasionally" className="font-normal">Occasionally</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rarely" id="freq-rarely" />
                <Label htmlFor="freq-rarely" className="font-normal">Rarely</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">8. Where do you see yourself in 3–5 years?</Label>
            <RadioGroup value={formData.futureVision} onValueChange={(v) => setFormData({...formData, futureVision: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="job" id="fut-job" />
                <Label htmlFor="fut-job" className="font-normal">Job</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="studies" id="fut-studies" />
                <Label htmlFor="fut-studies" className="font-normal">Higher studies</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="startup" id="fut-startup" />
                <Label htmlFor="fut-startup" className="font-normal">Startup</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exploring" id="fut-exploring" />
                <Label htmlFor="fut-exploring" className="font-normal">Exploring options</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">9. What type of work do you prefer?</Label>
            <RadioGroup value={formData.workPreference} onValueChange={(v) => setFormData({...formData, workPreference: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="technical" id="pref-technical" />
                <Label htmlFor="pref-technical" className="font-normal">Technical</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="creative" id="pref-creative" />
                <Label htmlFor="pref-creative" className="font-normal">Creative</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="people" id="pref-people" />
                <Label htmlFor="pref-people" className="font-normal">People-oriented</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="managerial" id="pref-managerial" />
                <Label htmlFor="pref-managerial" className="font-normal">Managerial</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="research" id="pref-research" />
                <Label htmlFor="pref-research" className="font-normal">Research</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">10. Would you like a tool or mentor to guide your career planning?</Label>
            <RadioGroup value={formData.wantGuidance} onValueChange={(v) => setFormData({...formData, wantGuidance: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="guid-yes" />
                <Label htmlFor="guid-yes" className="font-normal">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maybe" id="guid-maybe" />
                <Label htmlFor="guid-maybe" className="font-normal">Maybe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="guid-no" />
                <Label htmlFor="guid-no" className="font-normal">No</Label>
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

export default CareerAssessmentForm
