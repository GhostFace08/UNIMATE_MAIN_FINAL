import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { 
  DollarSign, 
  Target, 
  Search, 
  PiggyBank, 
  TrendingUp, 
  BookOpen,
  BrainCircuit,
  Calendar,
  Award
} from "lucide-react"

const Features = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const handleNavigate = (path: string) => {
    if (!user) {
      navigate('/auth')
    } else {
      navigate(path)
    }
  }
  
  const features = [
    {
      id: "finance",
      title: "Smart Finance Tracking",
      description: "Track expenses, set budgets, and get AI-powered insights to manage your student finances like a pro.",
      icon: DollarSign,
      gradient: "gradient-secondary",
      buttonVariant: "finance" as const,
      features: [
        { icon: PiggyBank, text: "Expense categorization" },
        { icon: TrendingUp, text: "Budget recommendations" },
        { icon: Calendar, text: "Bill reminders" }
      ]
    },
    {
      id: "career",
      title: "Career Planning Hub",
      description: "Define your career goals, explore opportunities, and get personalized guidance for your professional journey.",
      icon: Target,
      gradient: "gradient-accent",
      buttonVariant: "career" as const,
      features: [
        { icon: Target, text: "Goal setting & tracking" },
        { icon: BrainCircuit, text: "Skills gap analysis" },
        { icon: Award, text: "Achievement milestones" }
      ]
    },
    {
      id: "academics",
      title: "AI Academic Assistant",
      description: "Get instant help with research, study planning, and academic questions using our powerful AI search engine.",
      icon: Search,
      gradient: "gradient-academic",
      buttonVariant: "academic" as const,
      features: [
        { icon: Search, text: "Intelligent research" },
        { icon: BookOpen, text: "Study scheduling" },
        { icon: BrainCircuit, text: "Concept explanations" }
      ]
    }
  ]

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold">
            Everything You Need to{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            UniMate brings together finance, career, and academic tools in one intelligent platform 
            designed specifically for student success.
          </p>
          
          {/* Tab Highlights */}
          <div className="flex items-center justify-center gap-2 pt-6">
            <div className="inline-flex items-center bg-muted rounded-lg p-1">
              <Button 
                variant={location.pathname === '/finance' ? 'default' : 'ghost'} 
                onClick={() => handleNavigate('/finance')}
                className={location.pathname === '/finance' ? 'shadow-sm' : ''}
              >
                Finance
              </Button>
              <Button 
                variant={location.pathname === '/career' ? 'default' : 'ghost'} 
                onClick={() => handleNavigate('/career')}
                className={location.pathname === '/career' ? 'shadow-sm' : ''}
              >
                Career
              </Button>
              <Button 
                variant={location.pathname === '/academics' ? 'default' : 'ghost'} 
                onClick={() => handleNavigate('/academics')}
                className={location.pathname === '/academics' ? 'shadow-sm' : ''}
              >
                Academics
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card 
              key={feature.id} 
              className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <CardHeader className="relative">
                <div className={`w-12 h-12 rounded-xl ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>

              <CardContent className="relative space-y-6">
                <p className="text-muted-foreground">{feature.description}</p>

                {/* Feature List */}
                <div className="space-y-3">
                  {feature.features.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  variant={feature.buttonVariant} 
                  className="w-full group"
                  onClick={() => handleNavigate(`/${feature.id}`)}
                >
                  Explore {feature.id === 'finance' ? 'Fin Aid' : feature.id === 'career' ? 'Career Aid' : 'Study Aid'}
                  <Target className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features