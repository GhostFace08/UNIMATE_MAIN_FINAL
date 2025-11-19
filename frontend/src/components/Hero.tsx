import { Button } from "@/components/ui/enhanced-button"
import { ArrowRight, Bot, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import heroImage from "@/assets/hero-student-desk.jpg"

const Hero = () => {
  const navigate = useNavigate()

  const handleStartJourney = () => {
  const token = localStorage.getItem("sb-nsftwcfxoyowrbjrpwcq-auth-token");

  if (token) {
    navigate("/features");
  } else {
    navigate("/auth");
  }
};


  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden">
      {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary animate-pulse-slow" />
        <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-accent animate-float" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-secondary animate-pulse-slow" />
        <div className="absolute bottom-32 right-1/3 w-24 h-24 rounded-full bg-academic animate-float" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE TEXT */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Bot className="w-4 h-4" />
              AI-Powered Student Assistant
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Your Complete{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Student Companion
                </span>{" "}
                Platform
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                UniMate helps you track finances, plan your career, and excel in academics 
                with AI-powered insights tailored for student life.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-muted-foreground">Students Helped</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-muted-foreground">AI Support</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleStartJourney}
                variant="hero" 
                size="xl" 
                className="group"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Trust */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>✓ Built by Students, for Students</span>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={heroImage}
                alt="Students using UniMate platform"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
            </div>

            <div className="absolute -top-4 -left-4 bg-card rounded-xl p-4 shadow-lg animate-float">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="font-medium">Budget on track!</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-card rounded-xl p-4 shadow-lg animate-pulse-slow opacity-100">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-academic"></div>
                <span className="font-medium">Next study session: Physics</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
