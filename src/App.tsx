import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import Category from "./pages/Category";
import Advertise from "./pages/Advertise";
import FamilySupportGuide from "./pages/FamilySupportGuide";
import HelpingOrEnabling from "./pages/HelpingOrEnabling";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/about" element={<About />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/family-support-guide" element={<FamilySupportGuide />} />
          <Route path="/helping-or-enabling" element={<HelpingOrEnabling />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
