import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, MessageSquare, FileText, Mail } from "lucide-react"

const HelpCenterPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get support and find answers to your questions about UniMate
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle>FAQs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find quick answers to the most commonly asked questions about features, 
                  account management, and getting the most out of UniMate.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with our support team in real-time to get immediate assistance 
                  with any issues or questions you may have.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access detailed guides and tutorials for all UniMate features including 
                  finance tracking, career planning, and academic tools.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Email us at support@unimate.com for personalized assistance. 
                  We typically respond within 24 hours.
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

export default HelpCenterPage
