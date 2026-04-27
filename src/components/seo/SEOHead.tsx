import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  ogImageAlt?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  keywords?: string;
  noindex?: boolean;
}

const SEOHead = ({
  title,
  description,
  canonicalUrl,
  ogType = "website",
  ogImage = "https://nomoreenabling.com/favicon.jpg",
  ogImageAlt = "No More Enabling",
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor = "Matt Brown",
  keywords,
  noindex = false,
}: SEOHeadProps) => {
  const location = useLocation();

  const buildTitle = () => {
    const suffix = " | No More Enabling";
    if (title.includes("No More Enabling")) return title;
    return `${title}${suffix}`;
  };

  const fullTitle = buildTitle();

  // Auto-generate canonical from current route if not provided
  const canonical = canonicalUrl || `https://nomoreenabling.com${location.pathname === '/' ? '' : location.pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={articleAuthor} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="No More Enabling" />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific OG tags */}
      {ogType === "article" && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {ogType === "article" && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {ogType === "article" && (
        <meta property="article:author" content={articleAuthor} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@NoMoreEnabling" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
    </Helmet>
  );
};

export default SEOHead;
