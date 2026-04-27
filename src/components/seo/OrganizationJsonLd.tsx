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

  const professionalServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Matt Brown Addiction Family Coaching and Intervention Guidance",
    url: "https://nomoreenabling.com/about",
    image: "https://nomoreenabling.com/favicon.jpg",
    description:
      "Family coaching and professional intervention guidance for families navigating addiction, enabling, boundaries, treatment resistance, and relapse patterns.",
    founder: {
      "@type": "Person",
      name: "Matt Brown",
      jobTitle: "Professional Interventionist",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    serviceType: [
      "Family addiction coaching",
      "Addiction intervention guidance",
      "Family boundaries coaching",
      "Treatment resistance consultation",
    ],
    email: "matt@nomoreenabling.com",
    sameAs: organizationJsonLd.sameAs,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(professionalServiceJsonLd)}</script>
    </Helmet>
  );
};

export default OrganizationJsonLd;
