import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Bot } from "lucide-react"

interface NotOperationalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
}

const NotOperationalDialog = ({ open, onOpenChange, title = "Feature" }: NotOperationalDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            This feature is currently not operational. We're working hard to bring it to you soon!
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default NotOperationalDialog
