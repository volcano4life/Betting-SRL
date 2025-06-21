import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, Menu, Globe, User, Settings, Shield, KeyRound, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import BettingLogo from "./BettingLogo";
import SportsBettingLogo from "./SportsBettingLogo";
import CasinoChipLogo from "./CasinoChipLogo";
import LogoSelector from "./LogoSelector";
import { useLogo } from "@/contexts/LogoContext";

// Scroll functions for navigation
const scrollToSection = (sectionId: string, navigate: (path: string) => void, currentLocation: string) => {
  console.log('Attempting to scroll to:', sectionId, 'Current location:', currentLocation);
  
  // If we're not on the home page, navigate to home first
  if (currentLocation !== '/') {
    console.log('Navigating to home page first');
    navigate('/');
    // Wait for navigation to complete, then scroll
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      console.log('Element found after navigation:', element);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  } else {
    // Already on home page, just scroll
    const element = document.getElementById(sectionId);
    console.log('Element found on home page:', element);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error('Element not found:', sectionId);
    }
  }
};

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, logoutMutation } = useAuth();
  const { selectedLogo, setSelectedLogo, customLogoUrl } = useLogo();
  
  // Scroll direction detection
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    let lastScrollTime = 0;
    const throttleTime = 100; // ms to throttle scroll events
    
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < throttleTime) return;
      lastScrollTime = now;
      
      const currentScrollY = window.scrollY;
      
      // Scrolling down - hide header
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } 
      // Scrolling up - show header immediately
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const isActive = (path: string) => location === path;
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'it' : 'en');
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const getLogo = () => {
    switch (selectedLogo) {
      case 'sports-shield':
        return <SportsBettingLogo className="w-20 h-20 mr-3" />;
      case 'casino-chip':
        return <CasinoChipLogo className="w-20 h-20 mr-3" />;
      case 'custom':
        return customLogoUrl ? 
          <img src={customLogoUrl} alt="Custom logo" className="h-14 mr-3 object-contain" style={{ maxWidth: "100%", aspectRatio: "auto" }} /> : 
          <BettingLogo className="h-14 mr-3" />;
      case 'poker-chip':
      default:
        return <BettingLogo className="h-14 mr-3" />;
    }
  };

  return (
    <header 
      ref={headerRef}
      className={`fixed w-full top-0 z-50 bg-white shadow-md transition-all duration-300 ease-in-out transform ${
        isVisible 
          ? 'translate-y-0' 
          : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link href="/" className="flex items-center">
              {getLogo()}
              <span className="text-2xl font-bold text-[#222236] font-medium ml-2 whitespace-nowrap" translate="no">
                Betting <span className="text-primary">SRL</span>
              </span>
            </Link>
            {user?.isAdmin && (
              <div className="ml-2">
                <LogoSelector />
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex mx-6">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection('outlets-section', navigate, location)}
                  className="text-[#222236] hover:text-primary font-semibold transition duration-200"
                >
                  {t('nav.outlets')}
                </Button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection('dealers-section', navigate, location)}
                  className="text-[#222236] hover:text-primary font-semibold transition duration-200"
                >
                  {t('nav.dealers')}
                </Button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection('bonuses-section', navigate, location)}
                  className="text-[#222236] hover:text-primary font-semibold transition duration-200"
                >
                  {t('nav.bonuses')}
                </Button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection('news-section', navigate, location)}
                  className="text-[#222236] hover:text-primary font-semibold transition duration-200"
                >
                  {t('nav.news')}
                </Button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  href="/chi-siamo"
                  className="text-[#222236] hover:text-primary font-semibold transition duration-200 px-4 py-2 rounded-md hover:bg-accent"
                >
                  {t('nav.aboutUs')}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search, Language, User Menu and Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="text-[#222236] hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 text-[#222236] hover:text-primary"
            >
              <Globe className="h-5 w-5" />
              <span className="hidden md:inline">{t('nav.language')}</span>
            </Button>
            
            {/* User/Admin Menu */}
            {user ? (
              <div className="relative flex items-center space-x-2">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="flex items-center gap-1 text-[#222236] hover:text-primary">
                        <User className="h-5 w-5" />
                        <span className="hidden md:inline">{user.username}</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[180px] gap-1 p-2">
                          {user.isAdmin && (
                            <li>
                              <Link 
                                href="/admin"
                                className="w-full text-left flex items-center gap-2 p-2 hover:bg-muted rounded-md hover:text-primary text-sm"
                              >
                                <Shield className="h-4 w-4" />
                                {t('nav.adminPanel')}
                              </Link>
                            </li>
                          )}
                          <li>
                            <Link 
                              href="/change-password"
                              className="w-full text-left flex items-center gap-2 p-2 hover:bg-muted rounded-md hover:text-primary text-sm"
                            >
                              <KeyRound className="h-4 w-4" />
                              {t('nav.changePassword')}
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout} 
                              className="w-full text-left flex items-center gap-2 p-2 hover:bg-muted rounded-md hover:text-primary text-sm"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              {t('nav.logout')}
                            </button>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            ) : (
              <div></div>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-[#222236] hover:text-primary">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="py-4 flex flex-col space-y-4">
                  <Link href="/" className="text-[#222236] hover:text-primary font-semibold py-2">
                    {t('nav.home')}
                  </Link>
                  
                  <Button
                    variant="ghost"
                    onClick={() => scrollToSection('outlets-section', navigate, location)}
                    className="text-[#222236] hover:text-primary font-semibold justify-start px-0"
                  >
                    {t('nav.outlets')}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => scrollToSection('dealers-section', navigate, location)}
                    className="text-[#222236] hover:text-primary font-semibold justify-start px-0"
                  >
                    {t('nav.dealers')}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => scrollToSection('bonuses-section', navigate, location)}
                    className="text-[#222236] hover:text-primary font-semibold justify-start px-0"
                  >
                    {t('nav.bonuses')}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => scrollToSection('news-section', navigate, location)}
                    className="text-[#222236] hover:text-primary font-semibold justify-start px-0"
                  >
                    {t('nav.news')}
                  </Button>

                  <Link href="/chi-siamo" className="text-[#222236] hover:text-primary font-semibold py-2">
                    {t('nav.aboutUs')}
                  </Link>
                  
                  {/* Authentication Links in Mobile Menu */}
                  {user && (
                    <>
                      {user.isAdmin && (
                        <Link 
                          href="/admin"
                          className="flex items-center text-[#222236] hover:text-primary font-semibold py-2"
                        >
                          <Shield className="h-5 w-5 mr-2" />
                          {t('nav.adminPanel')}
                        </Link>
                      )}
                      <Link 
                        href="/change-password"
                        className="flex items-center text-[#222236] hover:text-primary font-semibold py-2"
                      >
                        <KeyRound className="h-5 w-5 mr-2" />
                        {t('nav.changePassword')}
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center text-[#222236] hover:text-primary font-semibold py-2 w-full text-left"
                      >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {t('nav.logout')}
                      </button>
                    </>
                  )}
                  
                  <button 
                    onClick={toggleLanguage}
                    className="flex items-center space-x-2 text-[#222236] hover:text-primary font-semibold py-2"
                  >
                    <Globe className="h-5 w-5 mr-2" />
                    {t('nav.language')}
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-gray-100">
            <div className="flex gap-2 items-center">
              <Input 
                placeholder="Search for casinos, bonuses, sports articles..." 
                className="flex-grow"
              />
              <Button>
                Search
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
