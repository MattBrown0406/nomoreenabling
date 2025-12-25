import interventionOnCallLogo from "@/assets/intervention-on-call-logo.jpg";

const InterventionOnCallBanner = () => {
  return (
    <a
      href="https://interventiononcall.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-card rounded-xl p-6 shadow-card hover:shadow-lg transition-shadow border border-border/50"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <img 
          src={interventionOnCallLogo} 
          alt="Intervention On Call" 
          className="w-full max-w-xs h-auto border-2 border-black rounded"
        />
        
        <p className="text-sm font-medium text-foreground">
          Professional Intervention Services
        </p>
        
        <ul className="text-sm text-muted-foreground space-y-2 text-left w-full">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>Certified intervention professionals available 24/7</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>Free family support meetings via Zoom</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>Compassionate, evidence-based approach</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>Nationwide coverage with local expertise</span>
          </li>
        </ul>
        
        <span className="inline-block bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Get Help Now
        </span>
      </div>
    </a>
  );
};

export default InterventionOnCallBanner;
