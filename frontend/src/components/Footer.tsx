import { GraduationCap, Mail, Phone, MapPin } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog"

const Footer = () => {
  const navigate = useNavigate()
  const [policyDialog, setPolicyDialog] = useState<string | null>(null)

  const handlePolicyClick = (policy: string) => {
    setPolicyDialog(policy)
  }

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                UniMate
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your AI-powered companion for student success. Track finances, plan your career, 
              and excel in academics all in one place.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/finance" className="hover:text-foreground transition-colors">Finance Tracking</Link></li>
              <li><Link to="/career" className="hover:text-foreground transition-colors">Career Planning</Link></li>
              <li><Link to="/academics" className="hover:text-foreground transition-colors">Academic Assistance</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/student-guide" className="hover:text-foreground transition-colors">Student Guide</Link></li>
              <li><Link to="/help-center" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/community" className="hover:text-foreground transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@unimate.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1-800-UNIMATE</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 UniMate. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <button onClick={() => handlePolicyClick('privacy')} className="hover:text-foreground transition-colors">Privacy</button>
            <button onClick={() => handlePolicyClick('terms')} className="hover:text-foreground transition-colors">Terms</button>
            <button onClick={() => handlePolicyClick('cookies')} className="hover:text-foreground transition-colors">Cookies</button>
          </div>
        </div>
      </div>

      <AlertDialog open={!!policyDialog} onOpenChange={() => setPolicyDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {policyDialog === 'privacy' && 'Privacy Policy'}
              {policyDialog === 'terms' && 'Terms of Service'}
              {policyDialog === 'cookies' && 'Cookie Policy'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              There is nothing here yet. This section is under development.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </footer>
  )
}

export default Footer