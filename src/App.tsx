import { Toaster } from "@/components/ui/toaster";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import Category from "./pages/Category";
import Advertise from "./pages/Advertise";
import FamilySupportGuide from "./pages/FamilySupportGuide";
import HelpingOrEnabling from "./pages/HelpingOrEnabling";
import ProfessionalGuidanceSigns from "./pages/ProfessionalGuidanceSigns";
import WhyFamiliesNeedSupport from "./pages/WhyFamiliesNeedSupport";
import GroundingReminder from "./pages/GroundingReminder";
import FamilySystemNotes from "./pages/FamilySystemNotes";
import BoundariesCourse from "./pages/BoundariesCourse";
import AdminAnalytics from "./pages/AdminAnalytics";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import AuthGuard from "./components/auth/AuthGuard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OrganizationJsonLd />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/about" element={<About />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/family-support-guide" element={<FamilySupportGuide />} />
          <Route path="/helping-or-enabling" element={<HelpingOrEnabling />} />
          <Route path="/professional-guidance-signs" element={<ProfessionalGuidanceSigns />} />
          <Route path="/why-families-need-support" element={<WhyFamiliesNeedSupport />} />
          <Route path="/grounding-reminder" element={<GroundingReminder />} />
          <Route path="/family-system-notes" element={<FamilySystemNotes />} />
          <Route path="/boundaries-course" element={<BoundariesCourse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/admin" element={
            <AuthGuard>
              <AdminAnalytics />
            </AuthGuard>
          } />

          {/* Legacy WordPress 301 Redirects */}
          <Route path="/are-you-an-enabler" element={<Navigate to="/helping-or-enabling" replace />} />
          <Route path="/are-you-an-enabler/" element={<Navigate to="/helping-or-enabling" replace />} />
          <Route path="/help-an-addict" element={<Navigate to="/family-support-guide" replace />} />
          <Route path="/help-an-addict/" element={<Navigate to="/family-support-guide" replace />} />
          <Route path="/enabling-after-treatment" element={<Navigate to="/articles/hidden-role-enabling-addiction" replace />} />
          <Route path="/enabling-after-treatment/" element={<Navigate to="/articles/hidden-role-enabling-addiction" replace />} />
          <Route path="/powerlessness" element={<Navigate to="/articles/letting-go-without-collapse" replace />} />
          <Route path="/powerlessness/" element={<Navigate to="/articles/letting-go-without-collapse" replace />} />
          <Route path="/forgiveness-in-addiction" element={<Navigate to="/articles/family-trauma-after-addiction" replace />} />
          <Route path="/forgiveness-in-addiction/" element={<Navigate to="/articles/family-trauma-after-addiction" replace />} />
          <Route path="/how-to-support-someone-in-drug-rehab" element={<Navigate to="/family-support-guide" replace />} />
          <Route path="/how-to-support-someone-in-drug-rehab/" element={<Navigate to="/family-support-guide" replace />} />
          <Route path="/author/rzimmers" element={<Navigate to="/about" replace />} />
          <Route path="/author/rzimmers/" element={<Navigate to="/about" replace />} />
          <Route path="/author/ericbutton" element={<Navigate to="/about" replace />} />
          <Route path="/author/ericbutton/" element={<Navigate to="/about" replace />} />
          <Route path="/providers" element={<Navigate to="/advertise" replace />} />
          <Route path="/providers/" element={<Navigate to="/advertise" replace />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
