import { Link, useLocation } from "react-router-dom";
import { Activity, Home, ClipboardList, Mic, BarChart3, MessageCircle, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/assessment", label: "COPD Test", icon: ClipboardList },
  { path: "/recording", label: "Audio", icon: Mic },
  { path: "/results", label: "Results", icon: BarChart3 },
  { path: "/chatbot", label: "Assistant", icon: MessageCircle },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-gradient-hero">PulmoSense AI</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={cn("block h-0.5 w-5 bg-foreground transition-transform", mobileOpen && "rotate-45 translate-y-1.5")} />
              <span className={cn("block h-0.5 w-5 bg-foreground transition-opacity", mobileOpen && "opacity-0")} />
              <span className={cn("block h-0.5 w-5 bg-foreground transition-transform", mobileOpen && "-rotate-45 -translate-y-1.5")} />
            </div>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-border/50 bg-card p-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/50 py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 PulmoSense AI — Early COPD Detection Platform. Not a substitute for professional medical advice.
        </div>
      </footer>
    </div>
  );
}
