/**
 * Site-wide configuration for consistent branding and settings
 */

export const siteConfig = {
  // Site branding
  name: "Betting SRL",
  tagline: "Best Casino Games & Sports Betting in Italy",
  
  // SEO defaults
  defaultTitle: "Betting SRL | Italian Casino Games & Sports Betting",
  defaultDescription: "Find the best casino games, sports betting options, and exclusive promotions for Italian players. Powered by Betting SRL.",
  
  // Social media
  social: {
    twitter: "@bettingsrl",
    facebook: "BettingSRL",
    instagram: "bettingsrl_official"
  },
  
  // Contact information
  contact: {
    email: "support@bettingsrl.example.com",
    phone: "+39 123 456 7890"
  },
  
  // Copyright
  copyright: `© ${new Date().getFullYear()} Betting SRL. All rights reserved.`,
  
  // Page titles
  pageTitles: {
    home: "Home",
    login: "Login",
    register: "Register",
    auth: "Login & Registration",
    admin: "Admin Dashboard",
    notFound: "Page Not Found",
    changePassword: "Change Password",
    reviewListing: "Casino Reviews",
    reviewDetail: "Casino Review"
  }
};

/**
 * Helper function to generate consistent page titles
 * @param pageTitle The specific page title or key from pageTitles
 * @param customValue Optional custom value to append to the pageTitle (e.g. for review or product titles)
 * @returns Formatted page title with brand name
 */
export function getPageTitle(pageTitle: string | keyof typeof siteConfig.pageTitles, customValue?: string): string {
  let titleText: string;
  
  // If the pageTitle is a key in pageTitles, use that value
  if (typeof pageTitle === 'string' && pageTitle in siteConfig.pageTitles) {
    titleText = siteConfig.pageTitles[pageTitle as keyof typeof siteConfig.pageTitles];
  } else {
    titleText = pageTitle as string;
  }
  
  // If a custom value is provided, append it to the title
  if (customValue && customValue.trim() !== '') {
    if (pageTitle === 'reviewDetail') {
      // For review details, use the custom value as the main title
      return `${customValue} - ${siteConfig.name}`;
    }
    titleText = `${titleText}: ${customValue}`;
  }
  
  return `${titleText} - ${siteConfig.name}`;
}