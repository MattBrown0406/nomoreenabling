import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/logo.jpg";

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <img src={logo} alt="No More Enabling" className="h-16 w-auto rounded" />
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Practical guidance for families trying to respond to addiction with clearer boundaries,
              steadier decisions, and less chaos.
            </p>
            <nav className="flex gap-4 mt-6" aria-label="Social media links">
              <a href="https://www.tiktok.com/@mattbrowninterventionist" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow us on TikTok">
                <TikTokIcon size={20} />
              </a>
              <a href="https://www.instagram.com/mattbrowninterventionist/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow us on Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/mbrownsober" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow us on Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.youtube.com/@ThePartyWreckers" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Subscribe to our YouTube channel">
                <Youtube size={20} />
              </a>
            </nav>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h4 className="font-serif text-lg font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/articles" className="text-muted-foreground hover:text-foreground transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/work-with-matt" className="text-muted-foreground hover:text-foreground transition-colors">
                  Work With Matt
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a href="mailto:matt@nomoreenabling.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link to="/advertise" className="text-muted-foreground hover:text-foreground transition-colors">
                  Advertise
                </Link>
              </li>
              <li>
                <Link to="/advertise/media-kit" className="text-muted-foreground hover:text-foreground transition-colors">
                  Media Kit
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <h4 className="font-serif text-lg font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-border mt-10 pt-8 text-center text-muted-foreground text-sm">
          <p>
            © {new Date().getFullYear()} No More Enabling. All rights reserved.
            <Link to="/admin" className="ml-2 text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              Staff
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
