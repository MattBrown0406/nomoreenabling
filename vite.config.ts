import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sitemapPlugin } from "./plugins/vite-plugin-sitemap";

// Every newsletter / lead-magnet / assessment email form is gated on a
// Cloudflare Turnstile token. The site key is inlined at build time, so a
// production build without it ships forms that can never submit. Turnstile
// keys are not configured for this project yet, so we warn loudly instead of
// failing the build. Set STRICT_TURNSTILE=1 to make this fatal again once the
// keys are in place.
const assertTurnstileConfigured = (mode: string) => {
  if (mode !== "production") return;
  const env = loadEnv(mode, __dirname, "");
  if (env.VITE_TURNSTILE_SITE_KEY || env.ALLOW_MISSING_TURNSTILE) return;
  const message =
    "VITE_TURNSTILE_SITE_KEY is not set. Production builds inline this key; without it every email capture form renders \"Security verification is temporarily unavailable\". Add it to the build environment (or .env).";
  if (env.STRICT_TURNSTILE) throw new Error(message);
  console.warn(`[turnstile] ${message}`);
};


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  assertTurnstileConfigured(mode);
  return {
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const normalizedId = id.replace(/\\/g, "/");

            if (
              normalizedId.includes("/node_modules/react-dom/") ||
              normalizedId.includes("/node_modules/react/") ||
              normalizedId.includes("/node_modules/scheduler/")
            ) {
              return "react-vendor";
            }
            if (id.includes("react-router") || id.includes("@tanstack/react-query")) {
              return "router-data-vendor";
            }
            if (id.includes("@supabase/")) {
              return "supabase-vendor";
            }
            if (id.includes("lucide-react") || id.includes("recharts")) {
              return "ui-chart-vendor";
            }
            if (id.includes("@radix-ui") || id.includes("vaul") || id.includes("cmdk")) {
              return "radix-ui-vendor";
            }
            return "vendor";
          }

          if (id.includes("/src/data/blogPosts.ts")) {
            return "article-content";
          }
          if (id.includes("/src/pages/ArticlePage") || id.includes("/src/pages/Articles") || id.includes("/src/pages/Category")) {
            return "article-pages";
          }
          if (id.includes("/src/pages/HelpingOrEnabling") || id.includes("/src/pages/BoundariesCourse") || id.includes("/src/pages/FamilySupportGuide")) {
            return "guided-tools";
          }
          if (id.includes("/src/pages/TopicHub") || id.includes("/src/pages/StartHere") || id.includes("/src/data/topicHubs.ts")) {
            return "topic-hubs";
          }
        },
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    sitemapPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  };
});
