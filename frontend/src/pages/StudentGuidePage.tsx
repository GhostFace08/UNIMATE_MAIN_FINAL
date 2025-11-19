import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Compass, Users, Lightbulb } from "lucide-react"

const StudentGuidePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Student Guide</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn everything about UniMate and how it can help you succeed in your academic journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle>About UniMate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  UniMate is your all-in-one student companion platform designed to help you manage finances, 
                  plan your career, and excel in academics. Built by students, for students.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create your account and explore our three main features: Finance tracking for budget management, 
                  Career planning for professional development, and Academic tools for study success.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join thousands of students already using UniMate to achieve their goals. Connect with peers, 
                  share tips, and grow together in our supportive community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Tips & Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set realistic financial goals, track your expenses regularly, update your career plan monthly, 
                  and maintain a consistent study schedule for the best results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default StudentGuidePage
