import { Helmet } from "react-helmet";

const OrganizationJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "No More Enabling",
    url: "https://nomoreenabling.com",
    logo: "https://nomoreenabling.com/favicon.jpg",
    description: "Educational resource for families affected by addiction, codependency, and enabling behaviors. Founded by Matt Brown, a professional interventionist with over 20 years of experience.",
    founder: {
      "@type": "Person",
      name: "Matt Brown",
      jobTitle: "Professional Interventionist",
    },
    sameAs: [
      "https://www.tiktok.com/@mattbrowninterventionist",
      "https://www.instagram.com/mattbrowninterventionist/",
      "https://www.facebook.com/mbrownsober",
      "https://www.youtube.com/@ThePartyWreckers",
      "https://freedominterventions.com",
      "https://soberhelpline.com",
      "https://partywreckers.com",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "matt@nomoreenabling.com",
      contactType: "customer support",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default OrganizationJsonLd;
