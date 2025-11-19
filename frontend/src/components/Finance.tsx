import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { PiggyBank, TrendingUp, Target, CreditCard, DollarSign, BarChart3 } from "lucide-react"
import ExpenseTracker from "./ExpenseTracker"
import FinancialGoalsForm from "./FinancialGoalsForm"
import AIChatbot from "./AIChatbot"
import TransactionSpreadsheet from "./TransactionSpreadsheet"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { formatIndianNumber } from "@/lib/formatters"

const Finance = () => {
  const [expenseTrackerOpen, setExpenseTrackerOpen] = useState(false)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [goalsFormOpen, setGoalsFormOpen] = useState(false)
  const [spreadsheetOpen, setSpreadsheetOpen] = useState(false)

  const { data: transactions = [] } = useQuery({
    queryKey: ['finance-transactions-summary'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      
      const { data, error } = await supabase
        .from('finance_transactions')
        .select('*')
        .eq('user_id', user.id)
      
      if (error) throw error
      return data || []
    }
  })

  const { data: goals = [] } = useQuery({
    queryKey: ['finance-goals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      
      const { data, error } = await supabase
        .from('finance_goals')
        .select('*')
        .eq('user_id', user.id)
      
      if (error) throw error
      return data || []
    }
  })

  const totalIncome = transactions.reduce((sum: number, t: any) => t.type === 'income' ? sum + Number(t.amount) : sum, 0)
  const totalExpenses = transactions.reduce((sum: number, t: any) => t.type === 'expense' ? sum + Number(t.amount) : sum, 0)
  const netSavings = totalIncome - totalExpenses

  return (
    <section id="finance" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-secondary bg-clip-text text-transparent">
            Smart Financial Management
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take control of your student finances with AI-powered budgeting, expense tracking, and financial planning tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-all duration-300 border-secondary/20">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Budget Tracker</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Set spending limits and track your expenses across different categories with smart notifications.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setExpenseTrackerOpen(true)}>Start Budgeting</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-secondary/20">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Expense Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Get detailed insights into your spending patterns with AI-powered analytics and recommendations.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setAnalyticsOpen(true)}>View Analytics</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-secondary/20">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Financial Goals</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Set and track financial goals like emergency funds, textbook savings, or graduation trip funds.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setGoalsFormOpen(true)}>Set Goals</Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-secondary">Smart Money Management</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center mt-1">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Bill Reminders</h4>
                    <p className="text-muted-foreground text-sm">Never miss a payment with intelligent bill tracking and reminders.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center mt-1">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Student Discounts</h4>
                    <p className="text-muted-foreground text-sm">Discover and track student discounts to maximize your savings.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center mt-1">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Financial Reports</h4>
                    <p className="text-muted-foreground text-sm">Generate monthly and semester financial reports with actionable insights.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-secondary rounded-xl p-8 text-white cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSpreadsheetOpen(true)}>
              <h4 className="text-2xl font-bold mb-4">This Month's Overview</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Income</span>
                  <span className="font-semibold">{formatIndianNumber(totalIncome)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Expenses</span>
                  <span className="font-semibold">{formatIndianNumber(totalExpenses)}</span>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Net Savings</span>
                    <span className="text-white drop-shadow-md">{formatIndianNumber(netSavings)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {goals.length > 0 && (
            <div className="mt-8 space-y-4">
              <h4 className="text-2xl font-bold">Your Financial Goals</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals.map((goal: any) => (
                  <Card key={goal.id}>
                    <CardContent className="pt-6">
                      <h5 className="font-semibold mb-2">{goal.title}</h5>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Target: {formatIndianNumber(Number(goal.target_amount))}</p>
                        <p>Current: {formatIndianNumber(Number(goal.current_amount))}</p>
                        {goal.deadline && <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ExpenseTracker open={expenseTrackerOpen} onOpenChange={setExpenseTrackerOpen} />
      <AIChatbot open={analyticsOpen} onOpenChange={setAnalyticsOpen} title="Financial Analytics Assistant" chatType="finance" />
      <FinancialGoalsForm open={goalsFormOpen} onOpenChange={setGoalsFormOpen} />
      <TransactionSpreadsheet open={spreadsheetOpen} onOpenChange={setSpreadsheetOpen} />
    </section>
  )
}

export default Finance
