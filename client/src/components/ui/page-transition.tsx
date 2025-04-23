import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type TransitionType = 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideDown' | 'none';

interface PageTransitionProps {
  children: ReactNode;
  location: string;
  type?: TransitionType;
  duration?: number;
}

// Different page transition variants
const fadeVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
};

const slideVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
};

const scaleVariants = {
  initial: { opacity: 0, scale: 0.9 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.1 }
};

const slideUpVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const slideDownVariants = {
  initial: { opacity: 0, y: -20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: 20 }
};

const getVariants = (type: TransitionType) => {
  switch(type) {
    case 'fade': return fadeVariants;
    case 'slide': return slideVariants;
    case 'scale': return scaleVariants;
    case 'slideUp': return slideUpVariants;
    case 'slideDown': return slideDownVariants;
    case 'none': return {};
    default: return slideUpVariants;
  }
};

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  location, 
  type = 'slideUp',
  duration = 0.3
}) => {
  const pageVariants = getVariants(type);
  
  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration
  };

  // If transition is none, just return children
  if (type === 'none') {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;