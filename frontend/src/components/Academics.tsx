import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, GraduationCap, FileText, Lightbulb, Clock, History } from "lucide-react"
import { useState } from "react"
import StudyPlanForm from "./StudyPlanForm"
import DailyStudyLog from "./DailyStudyLog"
import GradeTracker from "./GradeTracker"
import AIChatbot from "./AIChatbot"
import StudySpreadsheet from "./StudySpreadsheet"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

const Academics = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [studyPlanOpen, setStudyPlanOpen] = useState(false)
  const [dailyLogOpen, setDailyLogOpen] = useState(false)
  const [gradeTrackerOpen, setGradeTrackerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [spreadsheetOpen, setSpreadsheetOpen] = useState(false)

  const { data: studySessions = [] } = useQuery({
    queryKey: ['study-sessions-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      
      const { data, error } = await supabase
        .from('academic_study_sessions')
        .select('*')
        .eq('user_id', user.id)
      
      if (error) throw error
      return data || []
    }
  })

  const { data: courses = [] } = useQuery({
    queryKey: ['academic-courses-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      
      const { data, error } = await supabase
        .from('academic_courses')
        .select('*')
        .eq('user_id', user.id)
      
      if (error) throw error
      return data || []
    }
  })

  const { data: recentSearches = [] } = useQuery({
    queryKey: ['recent-academic-searches'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('id, title, created_at')
        .eq('user_id', user.id)
        .eq('chat_type', 'academic')
        .order('created_at', { ascending: false })
        .limit(4)
      
      if (error) throw error
      return data || []
    }
  })

  const totalStudyMinutes = studySessions.reduce((sum: number, s: any) => sum + (s.duration_minutes || 0), 0)
  const totalStudyHours = Math.round(totalStudyMinutes / 60)
  
  const handleSearch = () => {
    setSearchOpen(true)
  }

  const handleRecentSearchClick = (convId: string, query: string) => {
    setSearchQuery(query)
    setSearchOpen(true)
  }

  const handleRecentSearchesClick = () => {
    setSearchQuery('')
    setSearchOpen(true)
  }

  return (
    <section id="academics" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-academic bg-clip-text text-transparent">
            AI-Powered Academic Assistant
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enhance your learning with intelligent search, personalized study plans, and academic insights powered by AI.
          </p>
        </div>

        {/* AI Search Engine */}
        <div className="bg-card rounded-2xl p-8 shadow-lg mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center text-academic">Smart Academic Search</h3>
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Ask anything... 'Explain quantum mechanics', 'Help with calculus', 'Research paper on AI ethics'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg border-academic/30 focus:border-academic"
              />
              <Button variant="secondary" size="lg" className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={handleSearch}>
                Search
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-academic" />
                <span>Instant explanations</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-academic" />
                <span>Research assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-academic" />
                <span>Study strategies</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-all duration-300 border-academic/20">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-academic rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Study Planner</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Create personalized study schedules and track your academic progress with AI recommendations.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setStudyPlanOpen(true)}>Create Plan</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-academic/20">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-academic rounded-lg flex items-center justify-center mx-auto mb-4">
                <History className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Daily Study Log</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Track your daily study sessions and monitor your learning progress.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setDailyLogOpen(true)}>View Log</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-academic/20">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-academic rounded-lg flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Grade Tracker</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Monitor your academic performance and get insights on areas that need improvement.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setGradeTrackerOpen(true)}>Track Grades</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Searches & Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-card rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-academic cursor-pointer hover:underline" onClick={handleRecentSearchesClick}>
              Recent Searches
            </h3>
            <div className="space-y-4">
              {recentSearches.length > 0 ? (
                recentSearches.map((search: any) => (
                  <div 
                    key={search.id}
                    className="flex items-center gap-3 p-3 hover:bg-academic/5 rounded-lg cursor-pointer transition-colors" 
                    onClick={() => handleRecentSearchClick(search.id, search.title)}
                  >
                    <Clock className="w-4 h-4 text-academic" />
                    <span className="flex-1">{search.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(search.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent searches yet</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-academic rounded-2xl p-8 text-white cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSpreadsheetOpen(true)}>
            <h3 className="text-2xl font-bold mb-6">Study Statistics</h3>
            {studySessions.length > 0 || courses.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Total Study Hours</span>
                    <span className="font-semibold">{totalStudyHours} hours</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-academic-light h-2 rounded-full" style={{ width: `${Math.min(totalStudyHours * 2.5, 100)}%` }}></div>
                  </div>
                </div>
                {courses.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Total Courses</span>
                      <span className="font-semibold">{courses.length}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-academic-light h-2 rounded-full" style={{ width: `${Math.min(courses.length * 5, 100)}%` }}></div>
                    </div>
                  </div>
                )}
                <div className="pt-4 border-t border-white/20">
                  <p className="text-academic-light text-sm">
                    Click to view detailed study statistics
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-academic-light">No study data yet</p>
                <p className="text-academic-light text-sm mt-2">Start tracking your study sessions to see statistics</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <StudyPlanForm open={studyPlanOpen} onOpenChange={setStudyPlanOpen} />
      <DailyStudyLog open={dailyLogOpen} onOpenChange={setDailyLogOpen} />
      <GradeTracker open={gradeTrackerOpen} onOpenChange={setGradeTrackerOpen} />
      <AIChatbot 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
        title="Academic Search Assistant" 
        initialMessage={searchQuery}
        chatType="academic"
        conversationId={recentSearches.find((s: any) => s.title === searchQuery)?.id || null}
      />
      <StudySpreadsheet open={spreadsheetOpen} onOpenChange={setSpreadsheetOpen} />
    </section>
  )
}

export default Academics