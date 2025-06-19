import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale: string = 'en'): string {
  let dateObj: Date;
  
  if (typeof date === "string") {
    // Handle ISO string dates properly
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  
  // Ensure we have a valid date
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const localeString = locale === 'it' ? 'it-IT' : 'en-US';
  
  try {
    return dateObj.toLocaleDateString(localeString, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    // Fallback to simple formatting if locale formatting fails
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    
    if (locale === 'it') {
      const monthNames = [
        'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
        'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
      ];
      return `${day} ${monthNames[dateObj.getMonth()]} ${year}`;
    } else {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${monthNames[dateObj.getMonth()]} ${day}, ${year}`;
    }
  }
}

export function shortenText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPlatformLabel(platform: string): string {
  switch (platform.toLowerCase()) {
    case "pc":
      return "PC";
    case "ps5":
    case "playstation 5":
      return "PlayStation 5";
    case "ps4":
    case "playstation 4":
      return "PlayStation 4";
    case "xsx":
    case "xbox series x":
      return "Xbox Series X";
    case "xbo":
    case "xbox one":
      return "Xbox One";
    case "switch":
    case "nintendo switch":
      return "Nintendo Switch";
    default:
      return platform;
  }
}

export function getRatingText(rating: number): string {
  if (rating >= 9.5) return "Exceptional";
  if (rating >= 8.5) return "Excellent";
  if (rating >= 7.5) return "Great";
  if (rating >= 6.5) return "Good";
  if (rating >= 5.5) return "Average";
  if (rating >= 4.5) return "Below Average";
  if (rating >= 3.5) return "Poor";
  if (rating >= 2.5) return "Bad";
  if (rating >= 1.5) return "Terrible";
  return "Abysmal";
}

export function getRatingColor(rating: number): string {
  if (rating >= 8.5) return "text-success";
  if (rating >= 7.0) return "text-accent";
  if (rating >= 5.0) return "text-yellow-500";
  if (rating >= 3.5) return "text-orange-500";
  return "text-destructive";
}
