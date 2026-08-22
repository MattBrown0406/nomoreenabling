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
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question,
      text: question,
      answerCount: 1,
      url,
      datePublished,
      author: {
        "@type": "Organization",
        name: "No More Enabling",
        url: "https://nomoreenabling.com",
      },
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
        url: `${url}#accepted-answer`,
        datePublished,
        upvoteCount: 0,
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
