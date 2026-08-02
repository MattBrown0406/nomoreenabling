import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
      <EnablingMirror lang={lang} embedMode showAttribution showLanguageToggle />
    </>
  );
};

export default MirrorEmbed;
