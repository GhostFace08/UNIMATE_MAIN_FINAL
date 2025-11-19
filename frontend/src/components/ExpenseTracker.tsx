import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { formatIndianNumber } from "@/lib/formatters"

interface ExpenseTrackerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ExpenseTracker = ({ open, onOpenChange }: ExpenseTrackerProps) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'income' | 'expense',
    category: '',
    title: '',
    notes: '',
    amount: ''
  })

  const { data: transactions = [] } = useQuery({
    queryKey: ['finance-transactions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      
      const { data, error } = await supabase
        .from('finance_transactions')
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
        .from('finance_transactions')
        .insert({
          user_id: user.id,
          date: newTransaction.date,
          type: newTransaction.type,
          category: newTransaction.category,
          title: newTransaction.title,
          notes: newTransaction.notes || null,
          amount: parseFloat(newTransaction.amount)
        })
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-transactions'] })
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category: '',
        title: '',
        notes: '',
        amount: ''
      })
      toast({ title: "Transaction added successfully" })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('finance_transactions')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-transactions'] })
      toast({ title: "Transaction deleted" })
    }
  })

  const total = transactions.reduce((sum: number, t: any) => 
    t.type === 'income' ? sum + Number(t.amount) : sum - Number(t.amount), 0
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Budget Tracker</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Add Transaction Form */}
          <div className="grid grid-cols-6 gap-2 p-4 bg-muted rounded-lg">
            <Input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
            />
            <Select value={newTransaction.type} onValueChange={(v) => setNewTransaction({...newTransaction, type: v as 'income' | 'expense'})}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newTransaction.category} onValueChange={(v) => setNewTransaction({...newTransaction, category: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="scholarship">Scholarship</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Title"
              value={newTransaction.title}
              onChange={(e) => setNewTransaction({...newTransaction, title: e.target.value})}
            />
            <Input
              placeholder="Notes (optional)"
              value={newTransaction.notes}
              onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
            />
            <Button onClick={() => addMutation.mutate()} size="icon" disabled={!newTransaction.amount || !newTransaction.category || !newTransaction.title}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Notes</th>
                  <th className="p-2 text-right">Amount</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t: any) => (
                  <tr key={t.id} className="border-t">
                    <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="p-2 capitalize">{t.type}</td>
                    <td className="p-2 capitalize">{t.category}</td>
                    <td className="p-2">{t.title}</td>
                    <td className="p-2">{t.notes || '-'}</td>
                    <td className={`p-2 text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatIndianNumber(Number(t.amount))}
                    </td>
                    <td className="p-2">
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(t.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Balance:</span>
              <span className={total >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatIndianNumber(total)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ExpenseTracker
