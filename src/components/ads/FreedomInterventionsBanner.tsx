import freedomLogo from "@/assets/freedom-interventions-logo.jpg";

interface FreedomInterventionsBannerProps {
  size?: "sidebar" | "leaderboard";
}

const FreedomInterventionsBanner = ({ size = "sidebar" }: FreedomInterventionsBannerProps) => {
  const isLeaderboard = size === "leaderboard";

  return (
    <a
      href="https://freedominterventions.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-card rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-shadow ${
        isLeaderboard ? "max-w-4xl mx-auto" : ""
      }`}
    >
      <div className={`flex ${isLeaderboard ? "flex-row items-center gap-6 p-4" : "flex-col items-center gap-3 p-6"}`}>
        <img
          src={freedomLogo}
          alt="Freedom Interventions"
          className={isLeaderboard ? "h-20 w-auto" : "h-28 w-auto"}
        />
        <div className={isLeaderboard ? "text-left" : "text-center"}>
          <p className="text-foreground font-medium text-sm md:text-base">
            Is your family in crisis?
          </p>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            Freedom Interventions helps families navigate addiction with compassion and expertise.
          </p>
          <span className="inline-block mt-2 text-primary text-xs font-semibold hover:underline">
            Get Help Today →
          </span>
        </div>
      </div>
    </a>
  );
};

export default FreedomInterventionsBanner;