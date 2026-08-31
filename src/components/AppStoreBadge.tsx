const FAMILY_BRIDGE_URL = "https://familybridgeapp.com";

interface AppStoreBadgeProps {
  className?: string;
  height?: number;
}

const AppStoreBadge = ({ className = "", height = 48 }: AppStoreBadgeProps) => (
  <a
    href={FAMILY_BRIDGE_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center rounded-lg bg-[#0d4a4a] px-5 font-semibold text-white transition-opacity hover:opacity-90 ${className}`}
    style={{ minHeight: `${height}px` }}
    aria-label="Learn about the Family Bridge app"
  >
    Learn about Family Bridge
  </a>
);

export default AppStoreBadge;
