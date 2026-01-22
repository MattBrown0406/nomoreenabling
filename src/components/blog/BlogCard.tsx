import { Link } from "react-router-dom";
import { Clock, ArrowRight, CheckCircle } from "lucide-react";
import { useReadingProgress } from "@/hooks/useReadingProgress";

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  slug: string;
  featured?: boolean;
}

const BlogCard = ({ title, excerpt, category, readTime, date, image, slug, featured = false }: BlogCardProps) => {
  const { isRead } = useReadingProgress();
  const hasRead = isRead(slug);

  if (featured) {
    return (
      <Link to={`/articles/${slug}`} className="group block">
        <article className="blog-card grid md:grid-cols-2 gap-6 relative">
          {hasRead && (
            <div className="absolute top-3 right-3 z-10 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle size={12} />
              Read
            </div>
          )}
          <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
            <img
              src={image}
              alt={title}
              loading="lazy"
              width={800}
              height={600}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <span className="text-accent font-medium text-sm uppercase tracking-wide">
              {category}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
              {title}
            </h2>
            <p className="text-muted-foreground mt-4 line-clamp-3">
              {excerpt}
            </p>
            <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
              <span>{date}</span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {readTime}
              </span>
            </div>
            <span className="inline-flex items-center gap-2 mt-4 text-primary font-medium group-hover:gap-3 transition-all">
              {hasRead ? "Read Again" : "Read More"} <ArrowRight size={16} />
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/articles/${slug}`} className="group block">
      <article className="blog-card h-full flex flex-col relative">
        {hasRead && (
          <div className="absolute top-2 right-2 z-10 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle size={10} />
            Read
          </div>
        )}
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            width={640}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <span className="text-accent font-medium text-xs uppercase tracking-wide">
            {category}
          </span>
          <h3 className="font-serif text-lg font-bold text-foreground mt-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2 flex-grow">
            {excerpt}
          </p>
          <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
            <span>{date}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {readTime}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
