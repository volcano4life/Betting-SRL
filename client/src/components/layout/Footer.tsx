import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  MessageCircle 
} from "lucide-react";

const casinoCategories = [
  { label: "Slot Machines", href: "/casinos?category=slots" },
  { label: "Roulette", href: "/casinos?category=roulette" },
  { label: "Blackjack", href: "/casinos?category=blackjack" },
  { label: "Poker", href: "/casinos?category=poker" },
  { label: "Baccarat", href: "/casinos?category=baccarat" },
  { label: "Live Casino", href: "/casinos?category=live" },
  { label: "Bingo", href: "/casinos?category=bingo" },
];

const promoCategories = [
  { label: "Welcome Bonuses", href: "/promos?type=welcome" },
  { label: "No Deposit", href: "/promos?type=no-deposit" },
  { label: "Free Spins", href: "/promos?type=free-spins" },
  { label: "Cashback", href: "/promos?type=cashback" },
  { label: "Loyalty Programs", href: "/promos?type=loyalty" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-[#222236] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold text-white font-medium">
                Betting <span className="text-primary">SRL</span>
              </span>
            </div>
            <p className="text-sm mb-4">
              Your trusted source for Italian casino reviews, exclusive promo codes, and sports betting insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <Youtube size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Casino Games</h3>
            <ul className="space-y-2 text-sm">
              {casinoCategories.map((category) => (
                <li key={category.href}>
                  <Link href={category.href} className="hover:text-white transition duration-200">
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Promotions</h3>
            <ul className="space-y-2 text-sm">
              {promoCategories.map((promo) => (
                <li key={promo.href}>
                  <Link href={promo.href} className="hover:text-white transition duration-200">
                    {promo.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          <p>© {new Date().getFullYear()} Betting SRL. All rights reserved. All trademarks are property of their respective owners.</p>
        </div>
      </div>
    </footer>
  );
}
