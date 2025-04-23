import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';

// Animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 30 }
  }
};

export const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Add hover animations
export const hoverScale: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  tap: { scale: 0.97 }
};

export const hoverElevate: Variants = {
  initial: { 
    scale: 1, 
    boxShadow: "0 0 0 rgba(0, 0, 0, 0)" 
  },
  hover: { 
    scale: 1.02, 
    y: -5,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  tap: { 
    scale: 0.98, 
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" 
  }
};

export const hoverBrightness: Variants = {
  initial: { filter: "brightness(1)" },
  hover: { 
    filter: "brightness(1.1)",
    transition: { duration: 0.2 }
  }
};

export const hoverRotate: Variants = {
  initial: { rotate: 0 },
  hover: { 
    rotate: 5,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

export type AnimationType = 
  | 'fade'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'zoom'
  | 'none';

export type HoverAnimationType =
  | 'scale'
  | 'elevate'
  | 'brightness'
  | 'rotate'
  | 'none';

interface AnimatedWrapperProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  animation?: AnimationType;
  hoverAnimation?: HoverAnimationType;
  delay?: number;
  className?: string;
  duration?: number;
  once?: boolean;
  threshold?: number;
  margin?: string;
  staggerDelay?: number;
  staggerChildren?: boolean;
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  animation = 'fade',
  hoverAnimation = 'none',
  delay = 0,
  className,
  duration = 0.5,
  once = true,
  threshold = 0.1,
  margin = "0px",
  staggerDelay = 0.1,
  staggerChildren = false,
  ...props
}) => {
  // Select the appropriate animation variant
  const getAnimationVariant = (): Variants => {
    switch (animation) {
      case 'fade': return fadeIn;
      case 'slideUp': return slideUp;
      case 'slideDown': return slideDown;
      case 'slideLeft': return slideInLeft;
      case 'slideRight': return slideInRight;
      case 'zoom': return zoomIn;
      case 'none': return {};
      default: return fadeIn;
    }
  };
  
  // Select the appropriate hover animation
  const getHoverVariant = (): Variants => {
    switch (hoverAnimation) {
      case 'scale': return hoverScale;
      case 'elevate': return hoverElevate;
      case 'brightness': return hoverBrightness;
      case 'rotate': return hoverRotate;
      case 'none': return {};
      default: return {};
    }
  };

  // If no animations are needed, just return the children
  if (animation === 'none' && hoverAnimation === 'none') {
    return <div className={className}>{children}</div>;
  }
  
  // Create combined variants if we have both entry and hover animations
  const combinedVariants = {
    ...getAnimationVariant(),
    ...getHoverVariant()
  };
  
  // Modify the variants for staggered children if needed
  if (staggerChildren) {
    combinedVariants.visible = {
      ...combinedVariants.visible,
      transition: {
        ...combinedVariants.visible?.transition,
        staggerChildren: staggerDelay
      }
    };
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      whileHover={hoverAnimation !== 'none' ? "hover" : undefined}
      whileTap={hoverAnimation !== 'none' ? "tap" : undefined}
      viewport={{ 
        once, 
        threshold,
        margin
      }}
      variants={combinedVariants}
      transition={{ 
        duration, 
        delay, 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper;