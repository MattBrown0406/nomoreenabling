import { Helmet } from "react-helmet";

const OrganizationJsonLd = () => {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "No More Enabling",
    url: "https://nomoreenabling.com",
    logo: "https://nomoreenabling.com/favicon.jpg",
    description:
      "Educational resource for families affected by addiction, codependency, and enabling behaviors. Founded by interventionist Matt Brown.",
    founder: {
      "@type": "Person",
      name: "Matt Brown",
      jobTitle: "Professional Interventionist",
      url: "https://nomoreenabling.com/about",
    },
    sameAs: [
      "https://www.tiktok.com/@mattbrowninterventionist",
      "https://www.instagram.com/mattbrowninterventionist/",
      "https://www.facebook.com/mbrownsober",
      "https://www.youtube.com/@ThePartyWreckers",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "matt@nomoreenabling.com",
      contactType: "customer support",
      availableLanguage: "English",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "No More Enabling",
    url: "https://nomoreenabling.com",
    description:
      "Practical education for families trying to stop enabling addiction without losing themselves in the process.",
    publisher: {
      "@type": "Organization",
      name: "No More Enabling",
    },
    inLanguage: "en-US",
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
    </Helmet>
  );
};

export default OrganizationJsonLd;
