import { cn } from "@/lib/utils";

interface AdSpaceProps {
  size: "banner" | "sidebar" | "inline" | "leaderboard";
  className?: string;
}

const sizeClasses = {
  banner: "h-24 md:h-32 w-full",
  sidebar: "h-64 w-full",
  inline: "h-20 w-full my-6",
  leaderboard: "h-20 md:h-24 w-full max-w-4xl mx-auto",
};

const AdSpace = ({ size, className }: AdSpaceProps) => {
  return (
    <div
      className={cn(
        "ad-space",
        sizeClasses[size],
        className
      )}
    >
      <div className="text-center">
        <p className="font-medium">Advertisement</p>
        <p className="text-xs mt-1 opacity-70">Your Ad Here</p>
      </div>
    </div>
  );
};

export default AdSpace;
