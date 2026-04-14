import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "nme_reading_progress";

interface ReadingProgress {
  articlesRead: string[];
  lastReadAt: Record<string, string>;
}

const getStoredProgress = (): ReadingProgress => {
  if (typeof window === "undefined") {
    return { articlesRead: [], lastReadAt: {} };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading progress from localStorage:", e);
  }
  return { articlesRead: [], lastReadAt: {} };
};

const saveProgress = (progress: ReadingProgress) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Error saving progress to localStorage:", e);
  }
};

export const useReadingProgress = () => {
  const [progress, setProgress] = useState<ReadingProgress>(getStoredProgress);

  // Sync with localStorage on mount
  useEffect(() => {
    setProgress(getStoredProgress());
  }, []);

  const markAsRead = useCallback((slug: string) => {
    setProgress((prev) => {
      if (prev.articlesRead.includes(slug)) {
        // Update lastReadAt even if already read
        const updated = {
          ...prev,
          lastReadAt: {
            ...prev.lastReadAt,
            [slug]: new Date().toISOString(),
          },
        };
        saveProgress(updated);
        return updated;
      }

      const updated = {
        articlesRead: [...prev.articlesRead, slug],
        lastReadAt: {
          ...prev.lastReadAt,
          [slug]: new Date().toISOString(),
        },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const isRead = useCallback(
    (slug: string) => {
      return progress.articlesRead.includes(slug);
    },
    [progress.articlesRead]
  );

  const getReadCount = useCallback(() => {
    return progress.articlesRead.length;
  }, [progress.articlesRead]);

  const clearProgress = useCallback(() => {
    const empty = { articlesRead: [], lastReadAt: {} };
    saveProgress(empty);
    setProgress(empty);
  }, []);

  return {
    articlesRead: progress.articlesRead,
    markAsRead,
    isRead,
    getReadCount,
    clearProgress,
  };
};
