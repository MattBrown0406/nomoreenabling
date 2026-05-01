import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Start Here", href: "/start-here" },
    { name: "Articles", href: "/articles" },
    { name: "Work With Matt", href: "/work-with-matt" },
    { name: "About", href: "/about" },
  ];

  const familyResources = [
    { name: "Family Situation Assessment", href: "/family-situation-assessment", highlight: true },
    { name: "Guided Topic Hubs", href: "/topic-hubs", highlight: true },
    { name: "Free Boundaries Course", href: "/boundaries-course", highlight: false },
    { name: "Helping or Enabling? Tool", href: "/helping-or-enabling" },
    { name: "Signs You Need Professional Help", href: "/professional-guidance-signs" },
    { name: "Why Families Need Support", href: "/why-families-need-support" },
    { name: "A Grounding Reminder", href: "/grounding-reminder" },
    { name: "Family System Notes", href: "/family-system-notes" },
    { name: "Family Support Guide", href: "/family-support-guide" },
  ];

  const scrollToNewsletter = () => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToNewsletter: true } });
    } else {
      const element = document.getElementById('newsletter');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="No More Enabling" className="h-12 md:h-14 w-auto rounded" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Family Education Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                Family Education Resources
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border shadow-lg z-50">
                {familyResources.map((resource) => (
                  <DropdownMenuItem key={resource.name} asChild>
                    <Link
                      to={resource.href}
                      className={`cursor-pointer ${resource.highlight ? 'text-primary font-semibold' : ''}`}
                    >
                      {resource.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <a
                    href="https://soberhelpline.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-primary"
                  >
                    Family Support Forum
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="hero" size="default" onClick={scrollToNewsletter}>
              Get the emails
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in" aria-label="Mobile navigation">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="py-2">
                <p className="text-muted-foreground font-medium mb-2">Family Education Resources</p>
                <div className="flex flex-col gap-2 pl-4">
                  <Link to="/family-situation-assessment" className="text-primary hover:text-primary/80 transition-colors font-semibold" onClick={() => setIsMenuOpen(false)}>Family Situation Assessment</Link>
                  <Link to="/topic-hubs" className="text-primary hover:text-primary/80 transition-colors font-semibold" onClick={() => setIsMenuOpen(false)}>Guided Topic Hubs</Link>
                  <Link to="/boundaries-course" className="text-muted-foreground hover:text-foreground transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Free Boundaries Course</Link>
                  <Link to="/helping-or-enabling" className="text-muted-foreground hover:text-foreground transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Helping or Enabling? Tool</Link>
                  <Link to="/professional-guidance-signs" className="text-muted-foreground hover:text-foreground transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Signs You Need Professional Help</Link>
                  <Link to="/why-families-need-support" className="text-muted-foreground hover:text-foreground transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Why Families Need Support</Link>
                  <Link to="/grounding-reminder" className="text-muted-foreground hover:text-foreground transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>A Grounding Reminder</Link>
                  <Link to="/family-system-notes" className="text-muted-foreground hover:text-foreground transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Family System Notes</Link>
                  <Link to="/family-support-guide" className="text-muted-foreground hover:text-foreground transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Family Support Guide</Link>
                  <a href="https://soberhelpline.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Family Support Forum</a>
                </div>
              </div>
              <Button variant="hero" size="default" className="mt-2" onClick={scrollToNewsletter}>
                Get the emails
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
