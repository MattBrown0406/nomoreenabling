import { Helmet } from "react-helmet";
import type { GlossaryTerm } from "@/data/aeoAnswers";

interface DefinedTermJsonLdProps {
  term: GlossaryTerm;
}

const DefinedTermJsonLd = ({ term }: DefinedTermJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.plainDefinition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "No More Enabling Addiction Family Glossary",
      url: "https://nomoreenabling.com/glossary",
    },
    url: `https://nomoreenabling.com/glossary/${term.slug}`,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default DefinedTermJsonLd;
