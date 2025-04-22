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
import { Search, Menu, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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

  const isActive = (path: string) => location === path;
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'it' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold text-[#222236] font-medium">
                Betting <span className="text-primary">SRL</span>
              </span>
            </Link>
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
                  Casino Games
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
                  Promotions
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
                  Sports
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
                    Casinos
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
                    Promo Codes
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search, Language, and Mobile Menu Toggle */}
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-[#222236] hover:text-primary">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="py-4 flex flex-col space-y-4">
                  <Link href="/" className="text-[#222236] hover:text-primary font-semibold py-2">
                    Home
                  </Link>
                  <div className="py-2">
                    <h3 className="font-semibold mb-2">Casino Games</h3>
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
                    <h3 className="font-semibold mb-2">Promotions</h3>
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
                    <h3 className="font-semibold mb-2">Sports</h3>
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
                    Casinos
                  </Link>
                  <Link href="/promos" className="text-[#222236] hover:text-primary font-semibold py-2">
                    Promo Codes
                  </Link>
                  <Link href="/sports" className="text-[#222236] hover:text-primary font-semibold py-2">
                    Sports
                  </Link>
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
