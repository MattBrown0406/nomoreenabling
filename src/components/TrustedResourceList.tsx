import { ExternalLink, ShieldCheck } from "lucide-react";
import type { TrustedResource } from "@/data/trustedResources";

interface TrustedResourceListProps {
  resources: TrustedResource[];
  title?: string;
  description?: string;
}

const TrustedResourceList = ({
  resources,
  title = "Source-worthy public resources",
  description = "These links are not a substitute for medical, legal, or crisis care. They are included to help families verify safety and treatment information from official sources.",
}: TrustedResourceListProps) => {
  if (resources.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="flex gap-3">
        <ShieldCheck className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Trust signals</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{resource.organization}</p>
                <h3 className="mt-1 font-semibold text-foreground">{resource.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{resource.description}</p>
              </div>
              <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default TrustedResourceList;
