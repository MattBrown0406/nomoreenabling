import soberHelplineLogo from "@/assets/sober-helpline-logo.png";

const SoberHelplineBanner = () => {
  return (
    <a
      href="https://soberhelpline.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-card rounded-xl p-6 shadow-card hover:shadow-lg transition-shadow border border-border/50"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <img 
          src={soberHelplineLogo} 
          alt="Sober Helpline" 
          className="w-32 h-auto border-2 border-black rounded"
        />
        
        <p className="text-sm font-medium text-foreground">
          Support for Families Facing Addiction
        </p>
        
        <ul className="text-sm text-muted-foreground space-y-2 text-left w-full">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>Find ethical, vetted treatment providers</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>Access educational videos and trusted resources</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>Book Zoom calls with experts to create a personalized treatment map</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>Join a supportive community of families navigating addiction together</span>
          </li>
        </ul>
        
        <span className="inline-block bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Learn More
        </span>
      </div>
    </a>
  );
};

export default SoberHelplineBanner;
