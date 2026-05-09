import { Helmet } from "react-helmet";

interface QAPageJsonLdProps {
  question: string;
  answer: string;
  url: string;
  authorName?: string;
}

const QAPageJsonLd = ({
  question,
  answer,
  url,
  authorName = "Matt Brown",
}: QAPageJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question,
      text: question,
      answerCount: 1,
      url,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
        author: {
          "@type": "Person",
          name: authorName,
          url: "https://nomoreenabling.com/about",
        },
      },
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default QAPageJsonLd;
