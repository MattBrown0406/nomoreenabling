import { Phone, AlertTriangle } from "lucide-react";

const CrisisResourcesBanner = () => {
  return (
    <div className="bg-destructive/10 border-b border-destructive/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
          <div className="flex items-center gap-2 font-semibold text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>If you are in crisis:</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <a 
              href="tel:988" 
              className="flex items-center gap-1.5 text-foreground hover:text-destructive transition-colors font-medium"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>988 Suicide & Crisis Lifeline</span>
            </a>
            
            <a 
              href="tel:1-800-662-4357" 
              className="flex items-center gap-1.5 text-foreground hover:text-destructive transition-colors font-medium"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>SAMHSA: 1-800-662-4357</span>
            </a>
            
            <span className="text-muted-foreground">
              Emergency? <strong className="text-foreground">Call 911</strong>
            </span>

            <a
              href="tel:+14582988002"
              className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors font-semibold"
              onClick={() => {
                if (typeof window !== "undefined" && typeof window.gtag === "function") {
                  window.gtag("event", "phone_call_click", { source: "crisis_banner", phone: "458-298-8002" });
                }
              }}
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Family support: 458-298-8002</span>
            </a>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          This site is for families and loved ones of people struggling with addiction who want to stop enabling and start healing.
        </p>
      </div>
    </div>
  );
};

export default CrisisResourcesBanner;
