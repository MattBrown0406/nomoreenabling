import { Helmet } from "react-helmet";

interface ArticleJsonLdProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  url: string;
}

const ArticleJsonLd = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName = "No More Enabling",
  url,
}: ArticleJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      url: "https://nomoreenabling.com/about",
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

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default ArticleJsonLd;
