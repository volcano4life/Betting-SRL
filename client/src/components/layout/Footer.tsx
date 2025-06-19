import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  MessageCircle,
  Target,
  Shield,
  Gamepad2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLogo } from "@/contexts/LogoContext";

export default function Footer() {
  const { t } = useLanguage();
  const { selectedLogo, customLogoUrl } = useLogo();

  const companyLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Responsible Gaming', href: '/responsible-gaming' },
    { label: 'Contact', href: '/contact' }
  ];

  const getLogo = () => {
    switch (selectedLogo) {
      case 'poker-chip':
        return <Target className="w-8 h-8 text-primary" />;
      case 'sports-shield':
        return <Shield className="w-8 h-8 text-primary" />;
      case 'casino-chip':
        return <Gamepad2 className="w-8 h-8 text-primary" />;
      case 'custom':
        if (customLogoUrl) {
          return (
            <img 
              src={customLogoUrl} 
              alt="Custom Logo" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                console.error('Failed to load custom logo, falling back to default');
                e.currentTarget.style.display = 'none';
              }}
            />
          );
        }
        return <Target className="w-8 h-8 text-primary" />;
      default:
        return <Target className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <footer className="bg-[#222236] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center mb-4">
              {getLogo()}
              <span className="text-2xl font-bold text-white font-medium ml-2">
                Betting <span className="text-primary">SRL</span>
              </span>
            </div>
            <p className="text-sm mb-4">
              {t('footer.tagline')}
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
            <h3 className="text-white font-bold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition duration-200">
                    {t(`footer.links.${link.label.toLowerCase().replace(/ /g, '')}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          <p dangerouslySetInnerHTML={{ 
            __html: t('footer.copyright')
              .replace('{year}', new Date().getFullYear().toString())
              // This makes "Betting SRL" non-translatable
              .replace('Betting SRL', '<span translate="no">Betting SRL</span>')
          }} />
        </div>
      </div>
    </footer>
  );
}