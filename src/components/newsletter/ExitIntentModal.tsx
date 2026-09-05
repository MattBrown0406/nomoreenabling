import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BoundariesCourseCallout from "./BoundariesCourseCallout";
import { hasSubscribedCookie } from "@/hooks/useAbVariant";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";

const SESSION_KEY = "nme_exit_intent_shown";

interface Props {
  articleSlug?: string;
}

const ExitIntentModal = ({ articleSlug }: Props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasSubscribedCookie()) return;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* ignore */
    }

    const trigger = () => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
      void trackFunnelEvent("email_capture_view", {
        source: "exit_intent",
        articleSlug,
        metadata: { placement: "exit_intent" },
      });
    };

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    let mobileTimer: number | undefined;
    if (isMobile) {
      mobileTimer = window.setTimeout(trigger, 30000);
    }

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !isMobile) {
        trigger();
      }
    };

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      if (mobileTimer) window.clearTimeout(mobileTimer);
    };
  }, [articleSlug]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 border-0 bg-transparent shadow-none">
        <DialogTitle className="sr-only">Free Boundaries email course</DialogTitle>
        <DialogDescription className="sr-only">
          Enroll in a free 4-week email course on setting boundaries with an addicted loved one.
        </DialogDescription>
        <div className="bg-background rounded-2xl overflow-hidden">
          <BoundariesCourseCallout source="exit_intent" compact />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentModal;
