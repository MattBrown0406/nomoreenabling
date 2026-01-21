import { Headphones, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const GuidedMeditation = () => {
  return (
    <section className="container mx-auto px-4 py-8">
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/30 border-primary/20">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Icon and Title */}
            <div className="flex-shrink-0 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                Guided Meditation
              </h2>
              <p className="text-primary font-medium text-sm mt-1">For Family Members</p>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Staying Grounded When They Won't Accept Help
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                A calming meditation to help you find peace and clarity when your loved one 
                refuses support. Remember: you cannot control their choices, but you can 
                protect your own well-being.
              </p>
              
              {/* Audio Player */}
              <div className="bg-background/80 rounded-lg p-4 shadow-sm">
                <audio 
                  controls 
                  className="w-full"
                  preload="metadata"
                >
                  <source src="/audio/staying-grounded-meditation.mp3" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>

              {/* Supportive Message */}
              <div className="flex items-center justify-center md:justify-start gap-2 mt-4 text-muted-foreground text-xs">
                <Heart className="w-3.5 h-3.5 text-primary" />
                <span>Take a moment for yourself. You deserve peace too.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default GuidedMeditation;