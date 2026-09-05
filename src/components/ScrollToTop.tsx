import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Reset scroll position on client-side navigation.
 *
 * React Router's pushState navigation keeps the previous scroll offset, so a
 * footer link clicked from the bottom of a long article opened the next page
 * scrolled to its bottom. When the target has a hash (e.g. #consultation-form)
 * scroll to that element instead; pushState never honours the hash on its own.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (hash) {
      // Wait a frame so the destination page has rendered the target element.
      const frame = window.requestAnimationFrame(() => {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          target.scrollIntoView({ block: "start" });
        } else {
          window.scrollTo(0, 0);
        }
      });
      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
