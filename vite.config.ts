import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sitemapPlugin } from "./plugins/vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
}));
