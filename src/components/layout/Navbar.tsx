
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Book,
  PlusCircle,
  BarChart,
  MessageCircle,
  Palette,
  Menu,
  X,
  UserCircle,
  Globe,
  History,
  Calculator,
  AtomIcon,
  BookOpen,
  ScrollText,
  GraduationCap,
  Heart,
} from "lucide-react";
import { ThemeToggle } from "@/components/themes/theme-toggle";
import { Button } from "@/components/ui/button";
import UserProfileButton from "../auth/UserProfileButton";
import { useSettings } from "@/contexts/SettingsContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Define the proper type for navigation items that can include a badge
interface NavItem {
  path: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: string;
}

const Navbar = () => {
  const location = useLocation();
  const { showChat, showStats } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedAgeRange, setSelectedAgeRange] = useState("all");

  // --- Navigation Items ---
  const getNavItems = () => {
    const baseItems: NavItem[] = [
      { path: "/", icon: Home, label: "الرئيسية" },
      { path: "/stories", icon: Book, label: "القصص" },
      { path: "/create", icon: PlusCircle, label: "قصة جديدة" },
      { path: "/coloring", icon: Palette, label: "التلوين" },
    ];
    
    // Only add stats/analytics if setting is enabled
    if (showStats) {
      baseItems.push({
        path: "/analytics", 
        icon: BarChart, 
        label: "التحليلات",
      });
    }
    
    // Only add chat if setting is enabled
    if (showChat) {
      baseItems.push({ 
        path: "/chat", 
        icon: MessageCircle, 
        label: "المساعد", 
        badge: "Beta" 
      });
    }
    
    return baseItems;
  };

  // --- Activity Domains ---
  const activityDomains = [
    { id: "geography", icon: Globe, label: "الجغرافيا" },
    { id: "history", icon: History, label: "التاريخ" },
    { id: "math", icon: Calculator, label: "الرياضيات" },
    { id: "physics", icon: AtomIcon, label: "الفيزياء" },
    { id: "culture", icon: BookOpen, label: "الثقافة" },
    { id: "sports", icon: Heart, label: "الرياضة" },
  ];

  // --- Age Ranges ---
  const ageRanges = [
    { id: "3-5", label: "3-5 سنوات" },
    { id: "6-8", label: "6-8 سنوات" },
    { id: "9-12", label: "9-12 سنة" },
    { id: "13-15", label: "13-15 سنة" },
    { id: "all", label: "جميع الأعمار" },
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
    getNavItems().map((item) => (
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

  // --- Render Free Activities Menu ---
  const renderActivitiesMenu = () => (
    <NavigationMenu dir="rtl" className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={cn(
              commonLinkClasses,
              "group",
              isActive("/free-activities") ? activeLinkClasses : inactiveLinkClasses
            )}
          >
            <GraduationCap 
              size={18}
              className={cn(
                "transition-colors",
                isActive("/free-activities") ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
              )}
            />
            أنشطة تعليمية
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-background border rounded-md shadow-lg p-4 w-[450px]">
            <div className="space-y-4">
              <div className="text-sm font-medium">اختر الفئة العمرية:</div>
              
              <RadioGroup 
                defaultValue="all"
                className="grid grid-cols-3 gap-2" 
                onValueChange={setSelectedAgeRange}
              >
                {ageRanges.map((range) => (
                  <div key={range.id} className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value={range.id} id={`age-${range.id}`} />
                    <Label htmlFor={`age-${range.id}`} className="text-sm cursor-pointer">
                      {range.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="text-sm font-medium mt-4">اختر المجال:</div>
              
              <div className="grid grid-cols-2 gap-2">
                {activityDomains.map((domain) => (
                  <Link 
                    key={domain.id}
                    to={`/activities/${domain.id}?age=${selectedAgeRange}`}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent text-sm transition-colors"
                  >
                    <domain.icon size={18} className="text-primary" />
                    <span>{domain.label}</span>
                  </Link>
                ))}
              </div>
              
              <div className="pt-2 border-t">
                <Link 
                  to="/activities"
                  className="text-sm text-primary hover:underline flex items-center gap-1.5"
                >
                  <ScrollText size={14} />
                  عرض جميع الأنشطة
                </Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );

  // --- Mobile Activities Menu ---
  const renderMobileActivitiesMenu = () => (
    <div className="space-y-4 px-2">
      <div className="font-medium flex items-center gap-2 px-2">
        <GraduationCap size={20} className="text-primary" />
        أنشطة تعليمية
      </div>
      
      <div className="px-2">
        <div className="text-sm font-medium mb-2">الفئة العمرية:</div>
        <Select defaultValue="all" onValueChange={(value) => setSelectedAgeRange(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="اختر الفئة العمرية" />
          </SelectTrigger>
          <SelectContent>
            {ageRanges.map((range) => (
              <SelectItem key={range.id} value={range.id}>{range.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="px-2 space-y-2">
        <div className="text-sm font-medium">المجال:</div>
        {activityDomains.map((domain) => (
          <Link 
            key={domain.id}
            to={`/activities/${domain.id}?age=${selectedAgeRange}`}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-accent text-sm transition-colors w-full"
            onClick={toggleMobileMenu}
          >
            <domain.icon size={18} className="text-primary" />
            <span>{domain.label}</span>
          </Link>
        ))}
      </div>
    </div>
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
          {renderActivitiesMenu()}
        </nav>

        {/* --- Right Aligned Items (Theme Toggle, Auth) --- */}
        <div className="flex items-center gap-2">
          {/* User Auth Placeholder - Desktop */}
          <div className="hidden md:flex">
            <UserProfileButton />
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

          {/* Activities Menu - Mobile */}
          {renderMobileActivitiesMenu()}

          {/* Divider */}
          <div className="border-t border-border pt-4 mt-4 mx-2"></div>

          {/* User Profile Button - Mobile */}
          <div className="px-2">
            <UserProfileButton />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
