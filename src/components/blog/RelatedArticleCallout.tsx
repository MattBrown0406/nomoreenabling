import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

interface RelatedArticleCalloutProps {
  title: string;
  slug: string;
  excerpt: string;
}

const RelatedArticleCallout = ({ title, slug, excerpt }: RelatedArticleCalloutProps) => {
  return (
    <div className="my-8 bg-primary/5 border border-primary/20 rounded-xl p-5 md:p-6">
      <div className="flex items-center gap-2 text-primary text-sm font-medium mb-2">
        <BookOpen className="w-4 h-4" />
        <span>Related Reading</span>
      </div>
      <Link
        to={`/articles/${slug}`}
        className="group block"
      >
        <h4 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
          {title}
        </h4>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
          {excerpt}
        </p>
        <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium mt-2 group-hover:gap-2.5 transition-all">
          Read article <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </Link>
    </div>
  );
};

export default RelatedArticleCallout;
