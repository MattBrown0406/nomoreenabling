import { useState } from "react";
import "./EnablingMirror.css";

export type MirrorLang = "en" | "es";

const copy = {
  en: {
    eyebrow: "THE ENABLING MIRROR",
    title: "The cycle families get stuck in — and the way out.",
    lead: "Watch the loop run. Then watch what happens when one person changes their part.",
    nodes: [
      { n: "01", title: "Crisis", text: "Something blows up." },
      { n: "02", title: "Rescue", text: "You absorb the cost." },
      { n: "03", title: "Relief", text: "The pressure drops." },
      { n: "04", title: "Repeat", text: "Nothing actually changes." },
    ],
    centerEyebrow: "THE PATTERN CAN CHANGE",
    centerTitle: "Your part is where change begins.",
    gate: "SET A BOUNDARY",
    responseEyebrow: "A DIFFERENT RESPONSE",
    responseTitle: "Care without carrying",
    responseItems: ["Clear boundary", "Natural consequence", "Support real recovery"],
    attribution: "The Enabling Mirror — an interactive teaching tool by",
  },
  es: {
    eyebrow: "EL ESPEJO DEL FACILITAMIENTO",
    title: "El ciclo en que se atascan las familias — y la salida.",
    lead: "Observa el ciclo girar. Después mira qué pasa cuando una persona cambia su parte.",
    nodes: [
      { n: "01", title: "Crisis", text: "Algo estalla." },
      { n: "02", title: "Rescate", text: "Tú absorbes el costo." },
      { n: "03", title: "Alivio", text: "Baja la presión." },
      { n: "04", title: "Repetición", text: "Nada cambia de verdad." },
    ],
    centerEyebrow: "EL PATRÓN PUEDE CAMBIAR",
    centerTitle: "Tu parte es donde empieza el cambio.",
    gate: "PON UN LÍMITE",
    responseEyebrow: "UNA RESPUESTA DISTINTA",
    responseTitle: "Cuidar sin cargar",
    responseItems: ["Límite claro", "Consecuencia natural", "Apoyar la recuperación real"],
    attribution: "El Espejo del Facilitamiento — herramienta interactiva de",
  },
} as const;

interface EnablingMirrorProps {
  lang?: MirrorLang;
  showLanguageToggle?: boolean;
  showAttribution?: boolean;
  embedMode?: boolean;
}

const EnablingMirror = ({
  lang = "en",
  showLanguageToggle = true,
  showAttribution = false,
  embedMode = false,
}: EnablingMirrorProps) => {
  const [activeLang, setActiveLang] = useState<MirrorLang>(lang);
  const t = copy[activeLang];

  return (
    <div className={`mirror-shell${embedMode ? " mirror-embed-mode" : ""}`} lang={activeLang}>
      <div className="mirror-inner">
        <div className="mirror-caption">
          <small>{t.eyebrow}</small>
          <strong>{t.title}</strong>
          <p>{t.lead}</p>
        </div>

        {showLanguageToggle && (
          <div className="mirror-lang" role="group" aria-label="Language / Idioma">
            <button type="button" data-active={activeLang === "en"} onClick={() => setActiveLang("en")}>
              English
            </button>
            <button type="button" data-active={activeLang === "es"} onClick={() => setActiveLang("es")}>
              Español
            </button>
          </div>
        )}

        <div
          className="mirror-scene"
          role="img"
          aria-label={`${t.title} ${t.nodes.map((node) => `${node.title}: ${node.text}`).join(" ")} ${t.gate}. ${t.responseTitle}: ${t.responseItems.join(", ")}.`}
        >
          <div className="mirror-ring" aria-hidden="true" />
          <div className="mirror-current" aria-hidden="true" />
          <div className="mirror-dot" aria-hidden="true" />

          {t.nodes.map((node, index) => (
            <div className={`mirror-node mirror-node-${index + 1}`} key={node.n} aria-hidden="true">
              <small>{node.n}</small>
              <strong>{node.title}</strong>
              <span>{node.text}</span>
            </div>
          ))}

          <div className="mirror-center" aria-hidden="true">
            <span>{t.centerEyebrow}</span>
            <strong>{t.centerTitle}</strong>
          </div>

          <div className="mirror-gate" aria-hidden="true">
            <span>{t.gate}</span>
          </div>

          <div className="mirror-exit" aria-hidden="true" />

          <div className="mirror-response" aria-hidden="true">
            <small>{t.responseEyebrow}</small>
            <strong>{t.responseTitle}</strong>
            {t.responseItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        {showAttribution && (
          <p className="mirror-attribution">
            {t.attribution}{" "}
            <a href="https://nomoreenabling.com/the-mirror" target="_blank" rel="noopener">
              NoMoreEnabling.com
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default EnablingMirror;
