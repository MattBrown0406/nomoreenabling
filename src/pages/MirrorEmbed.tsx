import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import EnablingMirror, { type MirrorLang } from "@/components/mirror/EnablingMirror";

const MirrorEmbed = () => {
  const location = useLocation();
  const [lang, setLang] = useState<MirrorLang>("en");

  useEffect(() => {
    const param = new URLSearchParams(location.search).get("lang");
    setLang(param === "es" ? "es" : "en");
  }, [location.search]);

  return (
    <>
      <SEOHead
        title="The Enabling Mirror (embed)"
        description="Embeddable interactive diagram of the enabling cycle in families affected by addiction."
        canonicalUrl="https://nomoreenabling.com/the-mirror"
        noindex
      />
      <EnablingMirror key={lang} lang={lang} embedMode showAttribution showLanguageToggle />
    </>
  );
};

export default MirrorEmbed;
