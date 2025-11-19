import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

interface TransactionSpreadsheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TransactionSpreadsheet = ({ open, onOpenChange }: TransactionSpreadsheetProps) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
        </DialogHeader>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Notes</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t: any) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="p-3 capitalize">{t.type}</td>
                  <td className="p-3 capitalize">{t.category}</td>
                  <td className="p-3">{t.title}</td>
                  <td className="p-3">{t.notes || '-'}</td>
                  <td className={`p-3 text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    ${Number(t.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionSpreadsheet
