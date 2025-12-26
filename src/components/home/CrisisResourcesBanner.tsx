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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisResourcesBanner;
