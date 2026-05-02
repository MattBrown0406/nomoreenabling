import { supabase } from "@/integrations/supabase/client";
import { trackGAConversion } from "@/lib/gaConversions";

export const trackAdClick = (adName: string) => {
  const pagePath = window.location.pathname;

  trackGAConversion("sponsor_click", {
    sponsor_name: adName,
    page_path: pagePath,
  });
  
  // Fire and forget - don't block the click
  supabase
    .from("ad_clicks")
    .insert({ ad_name: adName, page_path: pagePath })
    .then(() => {
      // Click tracked silently
    });
};
