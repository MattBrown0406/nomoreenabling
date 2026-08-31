import { Helmet } from "react-helmet";

interface QAPageJsonLdProps {
  question: string;
  answer: string;
  url: string;
  datePublished: string;
  authorName?: string;
}

const QAPageJsonLd = ({
  question,
  answer,
  url,
  datePublished,
  authorName = "Matt Brown",
}: QAPageJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: question,
    articleBody: answer,
    datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      url: "https://nomoreenabling.com/about",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    publisher: {
      "@type": "Organization",
      name: "No More Enabling",
      url: "https://nomoreenabling.com",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default QAPageJsonLd;
