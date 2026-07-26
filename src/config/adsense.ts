// Google AdSense configuration
// Publisher ID (client) is set once here. Slot IDs are created in the AdSense
// dashboard (Ads > By ad unit). Paste each slot's numeric ID below. Any slot
// left as an empty string will render a placeholder in development and render
// nothing in production, so it is safe to ship before every slot is filled.

export const ADSENSE_CLIENT = "ca-pub-4711693967004790";

export const ADSENSE_SLOTS = {
  // Home page
  homeTop: "",           // Leaderboard near the top of the home page
  homeMid: "",           // In-feed / mid home page
  homeSidebar: "",       // Sidebar rectangle on the home page

  // Articles listing page
  articlesTop: "",       // Leaderboard above the article grid
  articlesBottom: "",    // Leaderboard below the article grid

  // Individual article page
  articleTop: "",        // Leaderboard above article body
  articleInline: "",     // In-article rectangle mid-body
  articleBottom: "",     // Leaderboard below article body
  articleSidebar: "",    // Sidebar rectangle
} as const;

export type AdSenseSlotKey = keyof typeof ADSENSE_SLOTS;
