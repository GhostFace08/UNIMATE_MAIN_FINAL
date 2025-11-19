import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, TrendingUp, BookOpen, Users } from "lucide-react"

const BlogPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">UniMate Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tips, insights, and stories from the student community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <PenTool className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Latest Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stay updated with the latest tips, tricks, and insights on managing student life, 
                  from budgeting hacks to career advice and study strategies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Success Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Read inspiring stories from students who have achieved their goals using UniMate. 
                  Learn from their experiences and strategies for success.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Study Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Discover effective study techniques, time management strategies, and academic 
                  resources to help you excel in your courses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Community Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with fellow students through community-contributed content, discussions, 
                  and shared experiences on the student journey.
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

export default BlogPage
