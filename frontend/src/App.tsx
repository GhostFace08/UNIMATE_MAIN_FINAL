import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FeaturesPage from "./pages/FeaturesPage";
import FinancePage from "./pages/FinancePage";
import CareerPage from "./pages/CareerPage";
import AcademicsPage from "./pages/AcademicsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import StudentGuidePage from "./pages/StudentGuidePage";
import HelpCenterPage from "./pages/HelpCenterPage";
import BlogPage from "./pages/BlogPage";
import CommunityPage from "./pages/CommunityPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/student-guide" element={<StudentGuidePage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/community" element={<CommunityPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
