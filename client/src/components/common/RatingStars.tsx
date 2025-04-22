import { cn } from "@/lib/utils";

type RatingStarsProps = {
  rating: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

export default function RatingStars({ 
  rating, 
  size = "md", 
  className 
}: RatingStarsProps) {
  // Calculate percentage for width
  const percentage = (rating / 10) * 100;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className={cn("rating-stars", sizeClasses[size], className)}>
      <span style={{ width: `${percentage}%` }}></span>
    </div>
  );
}
