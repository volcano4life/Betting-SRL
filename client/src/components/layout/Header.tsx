import { useState } from "react";
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

const casinoCategories = [
  { label: "Slot Machines", href: "/casinos?category=slots" },
  { label: "Roulette", href: "/casinos?category=roulette" },
  { label: "Blackjack", href: "/casinos?category=blackjack" },
  { label: "Poker", href: "/casinos?category=poker" },
  { label: "Baccarat", href: "/casinos?category=baccarat" },
];

const promotionCategories = [
  { label: "Welcome Bonuses", href: "/promos?type=welcome" },
  { label: "No Deposit", href: "/promos?type=no-deposit" },
  { label: "Free Spins", href: "/promos?type=free-spins" },
];

const sportsCategories = [
  { label: "Football", href: "/sports?category=football" },
  { label: "Basketball", href: "/sports?category=basketball" },
  { label: "Tennis", href: "/sports?category=tennis" },
  { label: "F1", href: "/sports?category=f1" },
];

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, logoutMutation } = useAuth();
  const { selectedLogo, setSelectedLogo, customLogoUrl } = useLogo();

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
          <img src={customLogoUrl} alt="Custom logo" className="w-20 h-20 mr-3 object-contain" /> : 
          <BettingLogo className="w-20 h-20 mr-3" />;
      case 'poker-chip':
      default:
        return <BettingLogo className="w-20 h-20 mr-3" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {getLogo()}
              <span className="text-2xl font-bold text-[#222236] font-medium ml-2">
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
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    "text-[#222236] hover:text-primary font-semibold transition duration-200"
                  )}
                >
                  {t('nav.casinos')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2">
                    {casinoCategories.map((category) => (
                      <li key={category.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={category.href}
                            className="block p-2 hover:bg-muted rounded-md hover:text-primary text-sm"
                          >
                            {category.label}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    "text-[#222236] hover:text-primary font-semibold transition duration-200"
                  )}
                >
                  {t('nav.promotions')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2">
                    {promotionCategories.map((category) => (
                      <li key={category.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={category.href}
                            className="block p-2 hover:bg-muted rounded-md hover:text-primary text-sm"
                          >
                            {category.label}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    "text-[#222236] hover:text-primary font-semibold transition duration-200"
                  )}
                >
                  {t('nav.sportsBetting')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2">
                    {sportsCategories.map((category) => (
                      <li key={category.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={category.href}
                            className="block p-2 hover:bg-muted rounded-md hover:text-primary text-sm"
                          >
                            {category.label}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/casinos">
                  <NavigationMenuLink
                    className={cn(
                      "text-[#222236] hover:text-primary font-semibold transition duration-200 px-4 py-2",
                      isActive("/casinos") && "text-primary"
                    )}
                  >
                    {t('nav.casinos')}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/promos">
                  <NavigationMenuLink
                    className={cn(
                      "text-[#222236] hover:text-primary font-semibold transition duration-200 px-4 py-2",
                      isActive("/promos") && "text-primary"
                    )}
                  >
                    {t('nav.promoCodes')}
                  </NavigationMenuLink>
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
                <Button variant="ghost" size="icon" className="md:hidden text-[#222236] hover:text-primary">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="py-4 flex flex-col space-y-4">
                  <Link href="/" className="text-[#222236] hover:text-primary font-semibold py-2">
                    {t('nav.home')}
                  </Link>
                  <div className="py-2">
                    <h3 className="font-semibold mb-2">{t('nav.casinos')}</h3>
                    <div className="flex flex-col space-y-2 pl-2">
                      {casinoCategories.map((category) => (
                        <Link 
                          key={category.href} 
                          href={category.href} 
                          className="text-sm text-[#222236] hover:text-primary"
                        >
                          {category.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="py-2">
                    <h3 className="font-semibold mb-2">{t('nav.promotions')}</h3>
                    <div className="flex flex-col space-y-2 pl-2">
                      {promotionCategories.map((category) => (
                        <Link 
                          key={category.href} 
                          href={category.href} 
                          className="text-sm text-[#222236] hover:text-primary"
                        >
                          {category.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="py-2">
                    <h3 className="font-semibold mb-2">{t('nav.sportsBetting')}</h3>
                    <div className="flex flex-col space-y-2 pl-2">
                      {sportsCategories.map((category) => (
                        <Link 
                          key={category.href} 
                          href={category.href} 
                          className="text-sm text-[#222236] hover:text-primary"
                        >
                          {category.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/casinos" className="text-[#222236] hover:text-primary font-semibold py-2">
                    {t('nav.casinos')}
                  </Link>
                  <Link href="/promos" className="text-[#222236] hover:text-primary font-semibold py-2">
                    {t('nav.promoCodes')}
                  </Link>
                  <Link href="/sports" className="text-[#222236] hover:text-primary font-semibold py-2">
                    {t('nav.sportsBetting')}
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
