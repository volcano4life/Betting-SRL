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
import { Search, Menu } from "lucide-react";

const pcGamesCategories = [
  { label: "Action", href: "/reviews?platform=pc&category=action" },
  { label: "Adventure", href: "/reviews?platform=pc&category=adventure" },
  { label: "RPG", href: "/reviews?platform=pc&category=rpg" },
  { label: "Strategy", href: "/reviews?platform=pc&category=strategy" },
  { label: "Simulation", href: "/reviews?platform=pc&category=simulation" },
];

const consoleGamesCategories = [
  { label: "PlayStation", href: "/reviews?platform=playstation" },
  { label: "Xbox", href: "/reviews?platform=xbox" },
  { label: "Nintendo Switch", href: "/reviews?platform=nintendo-switch" },
];

const mobileGamesCategories = [
  { label: "iOS", href: "/reviews?platform=ios" },
  { label: "Android", href: "/reviews?platform=android" },
  { label: "Cross-Platform", href: "/reviews?platform=cross-platform-mobile" },
];

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-xl font-bold text-[#222236] font-medium">
                Game<span className="text-primary">Reviews</span>
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
                  PC Games
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2">
                    {pcGamesCategories.map((category) => (
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
                  Console Games
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2">
                    {consoleGamesCategories.map((category) => (
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
                  Mobile Games
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2">
                    {mobileGamesCategories.map((category) => (
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
                <Link href="/reviews">
                  <NavigationMenuLink
                    className={cn(
                      "text-[#222236] hover:text-primary font-semibold transition duration-200 px-4 py-2",
                      isActive("/reviews") && "text-primary"
                    )}
                  >
                    Reviews
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/news">
                  <NavigationMenuLink
                    className={cn(
                      "text-[#222236] hover:text-primary font-semibold transition duration-200 px-4 py-2",
                      isActive("/news") && "text-primary"
                    )}
                  >
                    News
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search and Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="text-[#222236] hover:text-primary"
            >
              <Search className="h-5 w-5" />
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
                    <h3 className="font-semibold mb-2">PC Games</h3>
                    <div className="flex flex-col space-y-2 pl-2">
                      {pcGamesCategories.map((category) => (
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
                    <h3 className="font-semibold mb-2">Console Games</h3>
                    <div className="flex flex-col space-y-2 pl-2">
                      {consoleGamesCategories.map((category) => (
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
                    <h3 className="font-semibold mb-2">Mobile Games</h3>
                    <div className="flex flex-col space-y-2 pl-2">
                      {mobileGamesCategories.map((category) => (
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
                  <Link href="/reviews" className="text-[#222236] hover:text-primary font-semibold py-2">
                    Reviews
                  </Link>
                  <Link href="/news" className="text-[#222236] hover:text-primary font-semibold py-2">
                    News
                  </Link>
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
                placeholder="Search for games, reviews, news..." 
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
