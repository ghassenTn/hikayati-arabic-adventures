import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Book,
  PlusCircle,
  BarChart,
  MessageCircle,
  Menu, // Icon for hamburger menu
  X, // Icon for closing mobile menu
  UserCircle, // Placeholder for User Profile/Login
} from "lucide-react";
import { ThemeToggle } from "@/components/themes/theme-toggle";
import { Button } from "@/components/ui/button"; // Using Button component for consistency
import UserProfileButton from "../auth/UserProfileButton";

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // --- Navigation Items ---
  const navItems = [
    { path: "/", icon: Home, label: "الرئيسية" },
    { path: "/stories", icon: Book, label: "القصص" },
    { path: "/create", icon: PlusCircle, label: "قصة جديدة" },
    { 
      path: "/analytics", 
      icon: BarChart, 
      label: "التحليلات",
       // Adding beta tag to this item
    },
    { path: "/chat", icon: MessageCircle, label: "المساعد",badge: "Beta" },
  ];

  // --- Active Path Check ---
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // --- Close mobile menu on navigation ---
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // --- Handle scroll detection for sticky header styling ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Toggle Mobile Menu ---
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // --- Common Link Classes ---
  const commonLinkClasses = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const activeLinkClasses = "bg-primary text-primary-foreground";
  const inactiveLinkClasses = "text-muted-foreground hover:bg-accent hover:text-accent-foreground";

  // --- Badge Classes ---
  const badgeClasses = "ml-2 px-1.5 py-0.5 rounded text-[0.65rem] font-medium bg-primary/5 text-primary/80 border border-primary/10";
  // --- Render Navigation Links (Helper for DRY) ---
  const renderNavLinks = (isMobile: boolean = false) => (
    navItems.map((item) => (
      <Link
        key={item.path}
        to={item.path}
        className={cn(
          commonLinkClasses,
          isActive(item.path) ? activeLinkClasses : inactiveLinkClasses,
          isMobile ? "w-full justify-start text-base" : "md:text-sm",
          "group" // Added for group hover effects
        )}
        aria-current={isActive(item.path) ? "page" : undefined}
        onClick={isMobile ? toggleMobileMenu : undefined}
      >
        <item.icon 
          size={isMobile ? 20 : 18} 
          aria-hidden="true"
          className={cn(
            "transition-colors",
            isActive(item.path) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
          )}
        />
        <span className="flex items-center">
          {item.label}
          {item.badge && (
            <span className={cn(
              badgeClasses,
              "transition-colors",
              isActive(item.path) ? "bg-primary/20 text-primary-foreground/90 border-primary/30" : ""
            )}>
              {item.badge}
            </span>
          )}
        </span>
      </Link>
    ))
  );

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-shadow duration-300 ease-in-out",
      isScrolled ? "shadow-md bg-background/95 backdrop-blur-sm" : "shadow-none bg-background",
      "border-border"
    )}>
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* --- Logo/Brand --- */}
        <Link 
          to="/" 
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="font-bold text-xl text-primary">حكايتي</span>
        </Link>

        {/* --- Desktop Navigation --- */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {renderNavLinks(false)}
        </nav>

        {/* --- Right Aligned Items (Theme Toggle, Auth) --- */}
        <div className="flex items-center gap-2">
           {/* User Auth Placeholder - Desktop */}
          <div className="hidden md:flex">
            <Button variant="ghost" size="icon" aria-label="User Profile" asChild>
              <Link to="/profile">
                <UserCircle size={20} />
              </Link>
            </Button>
          </div>
          
          <ThemeToggle />

          {/* --- Mobile Menu Button --- */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu Panel --- */}
      <div 
        id="mobile-menu"
        className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        )}
        style={{ willChange: 'transform, opacity' }}
      >
         <nav className="px-2 pt-2 pb-4 space-y-1" aria-label="Mobile navigation">
          {renderNavLinks(true)}

          {/* Divider */}
          <div className="border-t border-border pt-4 mt-4 mx-2"></div>

          {/* User Auth Placeholder - Mobile */}
          <Link
            to="/profile"
            className={cn(commonLinkClasses, inactiveLinkClasses, "w-full justify-start text-base")}
            onClick={toggleMobileMenu}
          >
            <UserCircle size={20} aria-hidden="true" />
            <span></span> 
            <span></span> 
          </Link>
          <UserProfileButton/>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;