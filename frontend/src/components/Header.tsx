import { Button } from "@/components/ui/enhanced-button"
import { GraduationCap, Menu, X, LogOut, Bell } from "lucide-react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { formatIndianNumber } from "@/lib/formatters"

interface Profile {
  full_name: string | null
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()

  // Fetch user profile for full name
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
      return data as Profile
    },
    enabled: !!user
  })

  // Fetch user data for notifications
  const { data: studySessions = [] } = useQuery({
    queryKey: ['notifications-study'],
    queryFn: async () => {
      if (!user) return []
      const { data } = await supabase
        .from('academic_study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(3)
      return data || []
    },
    enabled: !!user
  })

  const { data: transactions = [] } = useQuery({
    queryKey: ['notifications-transactions'],
    queryFn: async () => {
      if (!user) return []
      const { data } = await supabase
        .from('finance_transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .order('date', { ascending: false })
        .limit(5)
      return data || []
    },
    enabled: !!user
  })

  const { data: careerGoals = [] } = useQuery({
    queryKey: ['notifications-career'],
    queryFn: async () => {
      if (!user) return []
      const { data } = await supabase
        .from('career_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)
      return data || []
    },
    enabled: !!user
  })

  const hasNotifications = studySessions.length > 0 || transactions.length > 0 || careerGoals.length > 0

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            UniMate
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/features" 
            className={`transition-all px-3 py-1.5 rounded-md ${
              location.pathname === '/features' 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Features
          </Link>
          <Link 
            to="/finance" 
            className={`transition-all px-3 py-1.5 rounded-md ${
              location.pathname === '/finance' 
                ? 'bg-secondary/10 text-secondary font-semibold' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Finance
          </Link>
          <Link 
            to="/career" 
            className={`transition-all px-3 py-1.5 rounded-md ${
              location.pathname === '/career' 
                ? 'bg-accent/10 text-accent font-semibold' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Career
          </Link>
          <Link 
            to="/academics" 
            className={`transition-all px-3 py-1.5 rounded-md ${
              location.pathname === '/academics' 
                ? 'bg-academic/10 text-academic font-semibold' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Academics
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {user && hasNotifications && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-background z-50">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {studySessions.length > 0 && (
                    <DropdownMenuItem className="p-4 cursor-pointer">
                      <div>
                        <p className="font-medium text-sm">Recent Study Session</p>
                        <p className="text-xs text-muted-foreground">
                          {studySessions[0].subject} - {studySessions[0].duration_minutes} minutes
                        </p>
                      </div>
                    </DropdownMenuItem>
                  )}
                  {transactions.length > 0 && (
                    <DropdownMenuItem className="p-4 cursor-pointer">
                      <div>
                        <p className="font-medium text-sm">Recent Expense</p>
                        <p className="text-xs text-muted-foreground">
                          {formatIndianNumber(Number(transactions[0].amount))} - {transactions[0].category}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  )}
                  {careerGoals.length > 0 && (
                    <DropdownMenuItem className="p-4 cursor-pointer">
                      <div>
                        <p className="font-medium text-sm">Career Goal</p>
                        <p className="text-xs text-muted-foreground">{careerGoals[0].title}</p>
                      </div>
                    </DropdownMenuItem>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {profile?.full_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button variant="hero" size="lg">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border md:hidden">
            <nav className="flex flex-col p-4 gap-4">
              <Link 
                to="/features" 
                className={`transition-colors ${
                  location.pathname === '/features' 
                    ? 'text-foreground font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/finance" 
                className={`transition-colors ${
                  location.pathname === '/finance' 
                    ? 'text-foreground font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Finance
              </Link>
              <Link 
                to="/career" 
                className={`transition-colors ${
                  location.pathname === '/career' 
                    ? 'text-foreground font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Career
              </Link>
              <Link 
                to="/academics" 
                className={`transition-colors ${
                  location.pathname === '/academics' 
                    ? 'text-foreground font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Academics
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground mb-2">
                      {profile?.full_name || user.email}
                    </span>
                    <Button variant="outline" onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="hero" className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header