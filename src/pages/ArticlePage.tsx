import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Clock, Calendar, Tag, Facebook, Mail, Link2, Check } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { blogPosts } from "@/data/blogPosts";
import AdSpace from "@/components/ads/AdSpace";
import EagleCreekRanchBanner from "@/components/ads/EagleCreekRanchBanner";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/seo/SEOHead";
import ArticleJsonLd from "@/components/seo/ArticleJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = blogPosts.find((post) => post.slug === slug);
  const [copied, setCopied] = useState(false);
  const viewRecorded = useRef(false);

  const articleUrl = `https://nomoreenabling.com/articles/${slug}`;
  const imageUrl = article?.image?.startsWith('http') 
    ? article.image 
    : `https://nomoreenabling.com${article?.image}`;

  // Convert date string to ISO format for structured data
  const getISODate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article]);

  // Record article view
  useEffect(() => {
    if (slug && !viewRecorded.current) {
      viewRecorded.current = true;
      supabase
        .from("article_views")
        .insert({ article_slug: slug })
        .then(() => {
          // View recorded silently
        });
    }
  }, [slug]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article?.title || '';

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareOnX = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`Check out this article: ${shareUrl}`)}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL from your browser's address bar.",
        variant: "destructive",
      });
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <Link to="/articles">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={article.title}
        description={article.excerpt}
        canonicalUrl={articleUrl}
        ogType="article"
        ogImage={imageUrl}
        articlePublishedTime={getISODate(article.date)}
        keywords={article.categories.join(", ")}
      />
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        image={imageUrl}
        datePublished={getISODate(article.date)}
        url={articleUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Articles", url: "https://nomoreenabling.com/articles" },
          { name: article.title, url: articleUrl },
        ]}
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="flex gap-8 max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="flex-1 max-w-3xl">
              {/* Back Link */}
              <Link 
                to="/articles" 
                className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
              </Link>

              {/* Article Header */}
              <article className="bg-card rounded-xl shadow-lg p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {article.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* Social Share Buttons */}
                <div className="flex items-center gap-2 mb-8 pb-6 border-b border-border">
                  <span className="text-sm text-muted-foreground mr-2">Share:</span>
                  <button
                    onClick={shareOnFacebook}
                    className="p-2 rounded-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    onClick={shareOnX}
                    className="p-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
                    aria-label="Share on X"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={shareViaEmail}
                    className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                    aria-label="Share via Email"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    onClick={copyLink}
                    className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                    aria-label="Copy link"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Ad Space */}
                <div className="mb-8">
                  <AdSpace size="leaderboard" />
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none text-foreground/90">
                  {article.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <h2 key={index} className="text-xl font-bold text-foreground mt-8 mb-4">
                          {paragraph.replace(/\*\*/g, '')}
                        </h2>
                      );
                    }
                    if (paragraph.includes('**')) {
                      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={index} className="mb-4 leading-relaxed">
                          {parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={i} className="font-semibold text-foreground">{part.replace(/\*\*/g, '')}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      );
                    }
                    return (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                {/* Bottom Ad Space */}
                <div className="mt-10 pt-8 border-t border-border">
                  <AdSpace size="leaderboard" />
                </div>
              </article>

              {/* Related Articles */}
              <div className="mt-12 mb-16">
                <h2 className="text-2xl font-bold mb-6">Continue Reading</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {blogPosts
                    .filter((post) => post.slug !== slug)
                    .slice(0, 2)
                    .map((post) => (
                      <Link
                        key={post.id}
                        to={`/articles/${post.slug}`}
                        className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <span className="text-xs text-primary font-medium">{post.category}</span>
                          <h3 className="font-semibold text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <EagleCreekRanchBanner />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
