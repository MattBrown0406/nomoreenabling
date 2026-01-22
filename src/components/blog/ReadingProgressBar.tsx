import { BookOpen, CheckCircle } from "lucide-react";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { blogPosts } from "@/data/blogPosts";
import { Progress } from "@/components/ui/progress";

const ReadingProgressBar = () => {
  const { getReadCount } = useReadingProgress();
  const readCount = getReadCount();
  const totalArticles = blogPosts.length;
  const percentage = totalArticles > 0 ? Math.round((readCount / totalArticles) * 100) : 0;

  if (readCount === 0) {
    return null;
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Your Reading Progress</span>
      </div>
      <Progress value={percentage} className="h-2 mb-2" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-primary" />
          {readCount} of {totalArticles} articles read
        </span>
        <span className="font-medium text-primary">{percentage}%</span>
      </div>
    </div>
  );
};

export default ReadingProgressBar;
