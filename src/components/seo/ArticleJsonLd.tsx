import { Helmet } from "react-helmet";

interface ArticleJsonLdProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  url: string;
  keywords?: string;
}

const ArticleJsonLd = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName = "Matt Brown",
  url,
  keywords,
}: ArticleJsonLdProps) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      url: "https://freedominterventions.com/interventionist",
    },
    publisher: {
      "@type": "Organization",
      name: "No More Enabling",
      url: "https://nomoreenabling.com",
      logo: {
        "@type": "ImageObject",
        url: "https://nomoreenabling.com/favicon.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  if (keywords) {
    jsonLd.keywords = keywords;
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default ArticleJsonLd;
