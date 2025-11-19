import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageCircle, Trophy, Heart } from "lucide-react"

const CommunityPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">UniMate Community</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with thousands of students on their journey to success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Join the Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with over 10,000+ students worldwide. Share experiences, ask questions, 
                  and support each other on your academic and professional journeys.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Discussion Forums</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Participate in topic-specific forums covering finance, career development, 
                  study strategies, and more. Get advice from peers and mentors.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Challenges & Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Take part in community challenges, virtual study sessions, and career workshops. 
                  Earn badges and recognition for your achievements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Peer Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find study buddies, accountability partners, and mentors. Build meaningful 
                  connections that last beyond graduation.
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

export default CommunityPage
