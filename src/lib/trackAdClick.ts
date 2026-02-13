import { supabase } from "@/integrations/supabase/client";

export const trackAdClick = (adName: string) => {
  const pagePath = window.location.pathname;
  
  // Fire and forget - don't block the click
  supabase
    .from("ad_clicks")
    .insert({ ad_name: adName, page_path: pagePath })
    .then(() => {
      // Click tracked silently
    });
};
