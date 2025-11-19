import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

interface FinancialGoalsFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const FinancialGoalsForm = ({ open, onOpenChange }: FinancialGoalsFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    trackExpenses: '',
    manageMethod: '',
    saveIncome: '',
    spendingCategories: [] as string[],
    shortTermGoals: [] as string[],
    longTermGoals: [] as string[],
    confidence: '',
    savingsLocation: '',
    challenge: '',
    wantHelp: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Goal Created!",
      description: "Your financial goal has been saved successfully."
    })
    onOpenChange(false)
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>💰 College Student Finance Goals – Short Quiz</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-semibold">1. Do you track your income and expenses regularly?</Label>
            <RadioGroup value={formData.trackExpenses} onValueChange={(v) => setFormData({...formData, trackExpenses: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="track-yes" />
                <Label htmlFor="track-yes" className="font-normal">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sometimes" id="track-sometimes" />
                <Label htmlFor="track-sometimes" className="font-normal">Sometimes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="track-no" />
                <Label htmlFor="track-no" className="font-normal">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">2. How do you mainly manage your money?</Label>
            <RadioGroup value={formData.manageMethod} onValueChange={(v) => setFormData({...formData, manageMethod: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="budget" id="manage-budget" />
                <Label htmlFor="manage-budget" className="font-normal">Budget/app</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mental" id="manage-mental" />
                <Label htmlFor="manage-mental" className="font-normal">Mental tracking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="manage-none" />
                <Label htmlFor="manage-none" className="font-normal">Don't track</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">3. Do you save part of your monthly income?</Label>
            <RadioGroup value={formData.saveIncome} onValueChange={(v) => setFormData({...formData, saveIncome: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="save-yes" />
                <Label htmlFor="save-yes" className="font-normal">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occasionally" id="save-occasionally" />
                <Label htmlFor="save-occasionally" className="font-normal">Occasionally</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="save-no" />
                <Label htmlFor="save-no" className="font-normal">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">4. What are your top spending categories? (Select all that apply)</Label>
            <div className="mt-3 space-y-2">
              {['Food', 'Entertainment', 'Gadgets', 'Travel', 'Others'].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`spending-${item}`}
                    checked={formData.spendingCategories.includes(item)}
                    onCheckedChange={() => setFormData({
                      ...formData, 
                      spendingCategories: toggleArrayItem(formData.spendingCategories, item)
                    })}
                  />
                  <Label htmlFor={`spending-${item}`} className="font-normal">{item}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">5. What are your main short-term money goals? (Select all that apply)</Label>
            <div className="mt-3 space-y-2">
              {['Buy something', 'Build savings', 'Pay fees', 'Travel'].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`short-${item}`}
                    checked={formData.shortTermGoals.includes(item)}
                    onCheckedChange={() => setFormData({
                      ...formData, 
                      shortTermGoals: toggleArrayItem(formData.shortTermGoals, item)
                    })}
                  />
                  <Label htmlFor={`short-${item}`} className="font-normal">{item}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">6. What are your main long-term financial goals? (Select all that apply)</Label>
            <div className="mt-3 space-y-2">
              {['Financial independence', 'Higher studies', 'Business', 'Wealth creation'].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`long-${item}`}
                    checked={formData.longTermGoals.includes(item)}
                    onCheckedChange={() => setFormData({
                      ...formData, 
                      longTermGoals: toggleArrayItem(formData.longTermGoals, item)
                    })}
                  />
                  <Label htmlFor={`long-${item}`} className="font-normal">{item}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">7. How confident are you in managing money?</Label>
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
            <Label className="text-base font-semibold">8. Where do you keep your savings?</Label>
            <RadioGroup value={formData.savingsLocation} onValueChange={(v) => setFormData({...formData, savingsLocation: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="loc-bank" />
                <Label htmlFor="loc-bank" className="font-normal">Bank</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="loc-cash" />
                <Label htmlFor="loc-cash" className="font-normal">Cash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="investments" id="loc-investments" />
                <Label htmlFor="loc-investments" className="font-normal">Investments</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="loc-none" />
                <Label htmlFor="loc-none" className="font-normal">Don't save</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">9. What's your biggest financial challenge?</Label>
            <RadioGroup value={formData.challenge} onValueChange={(v) => setFormData({...formData, challenge: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="overspending" id="chal-overspending" />
                <Label htmlFor="chal-overspending" className="font-normal">Overspending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="irregular" id="chal-irregular" />
                <Label htmlFor="chal-irregular" className="font-normal">Irregular income</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-habit" id="chal-habit" />
                <Label htmlFor="chal-habit" className="font-normal">No savings habit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="knowledge" id="chal-knowledge" />
                <Label htmlFor="chal-knowledge" className="font-normal">Lack of knowledge</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">10. Would you like help creating a budget or saving plan?</Label>
            <RadioGroup value={formData.wantHelp} onValueChange={(v) => setFormData({...formData, wantHelp: v})} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="help-yes" />
                <Label htmlFor="help-yes" className="font-normal">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maybe" id="help-maybe" />
                <Label htmlFor="help-maybe" className="font-normal">Maybe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="help-no" />
                <Label htmlFor="help-no" className="font-normal">No</Label>
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

export default FinancialGoalsForm
