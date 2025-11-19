import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Briefcase, Users, MapPin, Calendar, Star, FileText } from "lucide-react";
import CareerAssessmentForm from "./CareerAssessmentForm"
import ResumeAnalysis from "./ResumeAnalysis"
import AIChatbot from "./AIChatbot"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

const Career = () => {
  const [goalsOpen, setGoalsOpen] = useState(false)
  const [skillDevOpen, setSkillDevOpen] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)

  const { data: careerGoals = [] } = useQuery({
    queryKey: ['career-goals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      
      const { data, error } = await supabase
        .from('career_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    }
  })

  return (
    <section id="career" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
            Career Planning & Development
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Define your career path with AI-powered guidance, skill assessments, and personalized job recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-all duration-300 border-accent/20">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Career Goals</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Discover your strengths, interests, and ideal career paths with our comprehensive AI assessment.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setGoalsOpen(true)}>Set Goals</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-accent/20">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Resume Analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Upload your resume for AI-powered analysis and get personalized recommendations for improvement.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setResumeOpen(true)}>Analyze Resume</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-accent/20">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Skill Development</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Get personalized skill recommendations and learning paths based on your career goals.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setSkillDevOpen(true)}>Start Learning</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-card rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-accent">Trending Career Paths</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="font-medium">Software Development</span>
                </div>
                <span className="text-accent font-semibold">↗ 24%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="font-medium">Data Science</span>
                </div>
                <span className="text-accent font-semibold">↗ 19%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="font-medium">UX/UI Design</span>
                </div>
                <span className="text-accent font-semibold">↗ 16%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="font-medium">Digital Marketing</span>
                </div>
                <span className="text-accent font-semibold">↗ 12%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-accent rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Your Career Journey</h3>
            {careerGoals.length > 0 ? (
              <div className="space-y-6">
                {careerGoals.slice(0, 3).map((goal: any) => (
                  <div key={goal.id} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{goal.title}</h4>
                      <p className="text-accent-light text-sm">{goal.description || 'No description'}</p>
                      {goal.target_date && (
                        <p className="text-accent-light text-xs mt-1">Target: {new Date(goal.target_date).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-accent-light">No career goals set yet</p>
              </div>
            )}
            <Button 
              variant="outline" 
              className="mt-6 border-white hover:bg-white text-purple-500 w-full"
              onClick={() => setGoalsOpen(true)}
            >
              Update Career Plan
            </Button>
          </div>
        </div>
      </div>

      <CareerAssessmentForm open={goalsOpen} onOpenChange={setGoalsOpen} />
      <AIChatbot open={skillDevOpen} onOpenChange={setSkillDevOpen} title="Career Development Assistant" chatType="career" />
      <ResumeAnalysis open={resumeOpen} onOpenChange={setResumeOpen} />
    </section>
  )
}

export default Career
