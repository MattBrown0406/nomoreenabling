import { Toaster } from "@/components/ui/toaster";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import Category from "./pages/Category";
import Advertise from "./pages/Advertise";
import AdvertiseMediaKit from "./pages/AdvertiseMediaKit";
import FamilySupportGuide from "./pages/FamilySupportGuide";
import HelpingOrEnabling from "./pages/HelpingOrEnabling";
import ProfessionalGuidanceSigns from "./pages/ProfessionalGuidanceSigns";
import WhyFamiliesNeedSupport from "./pages/WhyFamiliesNeedSupport";
import GroundingReminder from "./pages/GroundingReminder";
import FamilySystemNotes from "./pages/FamilySystemNotes";
import BoundariesCourse from "./pages/BoundariesCourse";
import StartHere from "./pages/StartHere";
import TwoHouseholds from "./pages/TwoHouseholds";
import TopicHubs from "./pages/TopicHubs";
import TopicHubDetail from "./pages/TopicHubDetail";
import WorkWithMatt from "./pages/WorkWithMatt";
import TrustedTools from "./pages/TrustedTools";
import EnablingCostCalculator from "./pages/EnablingCostCalculator";
import FreeTools from "./pages/FreeTools";
import Press from "./pages/Press";
import CommercialIntentPage from "./pages/CommercialIntentPage";
import FamilySituationAssessment from "./pages/FamilySituationAssessment";
import SupportBridge from "./pages/SupportBridge";
import AdminAnalytics from "./pages/AdminAnalytics";
import EnablingAnswerCenter from "./pages/EnablingAnswerCenter";
import Answers from "./pages/Answers";
import AnswerDetail from "./pages/AnswerDetail";
import Glossary from "./pages/Glossary";
import GlossaryTerm from "./pages/GlossaryTerm";
import TheMirror from "./pages/TheMirror";
import MirrorEmbed from "./pages/MirrorEmbed";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import ContactFormWidget from "@/components/ContactFormWidget";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import SocialShareUrlGuard from "@/components/SocialShareUrlGuard";
import ScrollToTop from "@/components/ScrollToTop";
import {
  legacyPageRedirects,
  resolveLegacyArticleSlug,
} from "@/lib/legacyRedirects";

const LegacyArticleRedirect = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  return <Navigate to={`/articles/${resolveLegacyArticleSlug(slug)}`} replace />;
};

export const AppRoutes = () => (
  <>
    <GoogleAnalytics />
    <ScrollToTop />
    <SocialShareUrlGuard />
    <OrganizationJsonLd />
    <ContactFormWidget />
    <Routes>
      <Route path="/" element={<Index />} />
      {Object.entries(legacyPageRedirects).map(([from, to]) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}
      <Route path="/article/:slug" element={<LegacyArticleRedirect />} />
      <Route path="/blog/:slug" element={<LegacyArticleRedirect />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:slug" element={<ArticlePage />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/about" element={<About />} />
      <Route path="/advertise" element={<Advertise />} />
      <Route path="/advertise/media-kit" element={<AdvertiseMediaKit />} />
      <Route path="/family-support-guide" element={<FamilySupportGuide />} />
      <Route path="/helping-or-enabling" element={<HelpingOrEnabling />} />
      <Route path="/professional-guidance-signs" element={<ProfessionalGuidanceSigns />} />
      <Route path="/why-families-need-support" element={<WhyFamiliesNeedSupport />} />
      <Route path="/grounding-reminder" element={<GroundingReminder />} />
      <Route path="/family-system-notes" element={<FamilySystemNotes />} />
      <Route path="/boundaries-course" element={<BoundariesCourse />} />
      <Route path="/start-here" element={<StartHere />} />
      <Route path="/two-households" element={<TwoHouseholds />} />
      <Route path="/split-house" element={<Navigate to="/two-households" replace />} />
      <Route path="/split-house/" element={<Navigate to="/two-households" replace />} />
      <Route path="/divorced-parents" element={<Navigate to="/two-households" replace />} />
      <Route path="/divorced-parents/" element={<Navigate to="/two-households" replace />} />
      <Route path="/the-mirror" element={<TheMirror />} />
      <Route path="/the-mirror/embed" element={<MirrorEmbed />} />
      <Route path="/answers" element={<Answers />} />
      <Route path="/answers/:answerSlug" element={<AnswerDetail />} />
      <Route path="/enabling-answer-center" element={<EnablingAnswerCenter />} />
      <Route path="/glossary" element={<Glossary />} />
      <Route path="/glossary/:termSlug" element={<GlossaryTerm />} />
      <Route path="/topic-hubs" element={<TopicHubs />} />
      <Route path="/topic-hubs/:slug" element={<TopicHubDetail />} />
      <Route path="/work-with-matt" element={<WorkWithMatt />} />
      <Route path="/trusted-tools" element={<TrustedTools />} />
      <Route path="/enabling-cost-calculator" element={<EnablingCostCalculator />} />
      <Route path="/tools" element={<FreeTools />} />
      <Route path="/press" element={<Press />} />
      <Route path="/intervention-help" element={<CommercialIntentPage pageSlug="intervention-help" />} />
      <Route path="/family-addiction-coaching" element={<CommercialIntentPage pageSlug="family-addiction-coaching" />} />
      <Route path="/addiction-intervention-for-adult-child" element={<CommercialIntentPage pageSlug="addiction-intervention-for-adult-child" />} />
      <Route path="/alcohol-intervention-help" element={<CommercialIntentPage pageSlug="alcohol-intervention-help" />} />
      <Route path="/what-to-do-when-they-refuse-treatment" element={<CommercialIntentPage pageSlug="what-to-do-when-they-refuse-treatment" />} />
      <Route path="/family-addiction-consultation" element={<CommercialIntentPage pageSlug="family-addiction-consultation" />} />
      <Route path="/family-situation-assessment" element={<FamilySituationAssessment />} />
      <Route path="/support/:slug" element={<SupportBridge />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/cookies" element={<CookiePolicy />} />
      <Route path="/admin" element={<AdminAnalytics />} />

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

      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

// Module scope so a re-render of the shell can never discard the query cache.
const queryClient = new QueryClient();

export const AppShell = ({ router }: { router: ReactNode }) => {
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {router}
    </TooltipProvider>
  </QueryClientProvider>
  );
};

const App = () => (
  <AppShell router={<BrowserRouter><AppRoutes /></BrowserRouter>} />
);

export default App;
