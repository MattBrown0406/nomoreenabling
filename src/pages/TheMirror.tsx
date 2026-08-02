import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, ExternalLink, Code2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EnablingMirror, { type MirrorLang } from "@/components/mirror/EnablingMirror";
import {
  MIRROR_TIKTOK_PROFILE_URL,
  MIRROR_TIKTOK_VIDEO_URL,
  getMirrorEmbedCode,
} from "@/config/theMirror";
import { trackGAConversion } from "@/lib/gaConversions";

const TheMirror = () => {
  const [embedLang, setEmbedLang] = useState<MirrorLang>("en");
  const [copied, setCopied] = useState(false);
  const embedCode = useMemo(() => getMirrorEmbedCode(embedLang), [embedLang]);

  useEffect(() => {
    if (!MIRROR_TIKTOK_VIDEO_URL) return;
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast.success("Embed code copied — paste it into your page HTML.");
      trackGAConversion("mirror_embed_copy", { source: `the_mirror_${embedLang}` });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Copy failed — select the code and copy it manually.");
    }
  };

  return (
    <>
      <SEOHead
        title="The Enabling Mirror — Interactive Enabling Cycle Tool"
        description="A free interactive diagram of the enabling cycle families fall into — crisis, rescue, relief, repeat — and how one boundary changes it. Embed it free on your site."
        canonicalUrl="https://nomoreenabling.com/the-mirror"
        keywords="enabling cycle diagram, enabling mirror, interactive addiction family tool, codependency cycle, embed enabling diagram"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com/" },
          { name: "The Enabling Mirror", url: "https://nomoreenabling.com/the-mirror" },
        ]}
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto max-w-4xl px-4 py-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Free interactive tool</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
            The Enabling Mirror
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Most families never see the pattern they are inside of. Something blows up, someone absorbs the cost,
            the pressure drops for a few days — and then it happens again. That relief is what makes the loop so
            hard to break: it feels like helping, and in the short term it works. The Enabling Mirror animates that
            cycle so you can watch it turn, then shows the single interruption that changes the outcome — one clear
            boundary that lets a natural consequence land while care stays fully intact. Addiction is a chronic
            brain disease, not a moral failure, and no family member causes it or cures it. But the part you play in
            the cycle is yours, and it is the part you can change today. Use the tool with your family, in a session,
            or in a support group — and switch it to Spanish for the people who need it in their first language.
          </p>

          <div className="mt-10">
            <EnablingMirror lang="en" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link
                to="/helping-or-enabling"
                onClick={() => trackGAConversion("mirror_tool_click", { source: "the_mirror_helping_or_enabling" })}
              >
                Am I helping or enabling?
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link
                to="/boundaries-course"
                onClick={() => trackGAConversion("mirror_tool_click", { source: "the_mirror_boundaries_course" })}
              >
                Learn to set the boundary
              </Link>
            </Button>
          </div>

          {/* Share on TikTok */}
          <section className="mt-14" aria-labelledby="mirror-video">
            <h2 id="mirror-video" className="font-serif text-2xl font-bold text-foreground">
              Watch and share the 60-second version
            </h2>
            <p className="mt-2 text-muted-foreground">
              The same cycle, explained on video — easy to send to a family member who is not ready to read an
              article yet.
            </p>

            <div className="mt-5">
              {MIRROR_TIKTOK_VIDEO_URL ? (
                <blockquote
                  className="tiktok-embed"
                  cite={MIRROR_TIKTOK_VIDEO_URL}
                  data-video-id={MIRROR_TIKTOK_VIDEO_URL.split("/video/")[1]?.split(/[?/]/)[0]}
                  style={{ maxWidth: 605, minWidth: 288 }}
                >
                  <section>
                    <a href={MIRROR_TIKTOK_VIDEO_URL} target="_blank" rel="noopener noreferrer">
                      Watch The Enabling Mirror on TikTok
                    </a>
                  </section>
                </blockquote>
              ) : (
                <Card>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
                    <div>
                      <p className="font-semibold text-foreground">The Enabling Mirror on TikTok</p>
                      <p className="text-sm text-muted-foreground">
                        Watch and share the video walkthrough from @mattbrowninterventionist.
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <a
                        href={MIRROR_TIKTOK_PROFILE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackGAConversion("mirror_tiktok_click", { source: "the_mirror" })}
                      >
                        Watch on TikTok
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Embed this */}
          <section className="mt-14" aria-labelledby="mirror-embed">
            <div className="rounded-2xl border border-border bg-muted/40 p-6 md:p-8">
              <div className="flex items-center gap-2 text-primary">
                <Code2 className="h-5 w-5" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-[0.16em]">Embed this on your site</span>
              </div>
              <h2 id="mirror-embed" className="mt-3 font-serif text-2xl font-bold text-foreground">
                Free to use — therapists, treatment centers, and recovery writers
              </h2>
              <p className="mt-3 text-muted-foreground">
                Copy the snippet below into any page, blog post, or client resource hub. It stays responsive, works
                in English or Spanish, and always credits the source. No signup, no tracking pixel, no cost — just
                keep the attribution link intact.
              </p>

              <div className="mt-5 inline-flex rounded-lg border border-border bg-background p-1">
                {(["en", "es"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setEmbedLang(lang)}
                    className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
                      embedLang === lang ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {lang === "en" ? "English" : "Español"}
                  </button>
                ))}
              </div>

              <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-background p-4 text-xs leading-relaxed text-foreground">
                <code>{embedCode}</code>
              </pre>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={handleCopy}>
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Copied" : "Copy embed code"}
                </Button>
                <Button asChild variant="outline">
                  <a href={`/the-mirror/embed?lang=${embedLang}`} target="_blank" rel="noopener noreferrer">
                    Preview the embed
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Using it in a handout, slide deck, or training?{" "}
                <Link to="/work-with-matt" className="font-semibold text-primary underline">
                  Tell us where it lives
                </Link>{" "}
                and we will link back to your program.
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TheMirror;
