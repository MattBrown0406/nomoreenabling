import { Helmet } from "react-helmet";

interface PersonJsonLdProps {
  imageUrl: string;
}

const PersonJsonLd = ({ imageUrl }: PersonJsonLdProps) => {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Matt Brown",
    url: "https://nomoreenabling.com/about",
    image: imageUrl,
    jobTitle: "Professional Interventionist",
    description:
      "Matt Brown is a professional interventionist and founder of No More Enabling, helping families navigate addiction, treatment resistance, relapse, and recovery planning since 2004.",
    knowsAbout: [
      "Addiction intervention",
      "Family addiction support",
      "Treatment resistance",
      "Family boundaries",
      "Recovery planning",
      "Codependency and enabling",
    ],
    founder: {
      "@type": "Organization",
      name: "No More Enabling",
      url: "https://nomoreenabling.com",
    },
    worksFor: {
      "@type": "Organization",
      name: "Freedom Interventions",
      url: "https://freedominterventions.com",
    },
    sameAs: [
      "https://www.tiktok.com/@mattbrowninterventionist",
      "https://www.instagram.com/mattbrowninterventionist/",
      "https://www.facebook.com/mbrownsober",
      "https://www.youtube.com/@ThePartyWreckers",
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
    </Helmet>
  );
};

export default PersonJsonLd;
