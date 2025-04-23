import React from 'react';

interface LogoProps {
  className?: string;
}

const BettingLogo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <svg 
      width="42" 
      height="42" 
      viewBox="0 0 42 42" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* Background Circle */}
      <circle cx="21" cy="21" r="20" fill="url(#logoGradient)" filter="url(#shadow)" />
      
      {/* Letter B */}
      <path
        d="M14.5 11h7.2c1.6 0 3 0.4 4.2 1.2 1.2 0.8 2.1 1.8 2.7 3.1 0.6 1.3 0.9 2.7 0.9 4.2 0 1.5-0.3 2.9-0.9 4.2-0.6 1.3-1.5 2.3-2.7 3.1-1.2 0.8-2.6 1.2-4.2 1.2h-4.2v4h-3V11zm3 3v7h4.2c1.2 0 2.1-0.4 2.7-1.1 0.6-0.7 0.9-1.7 0.9-3 0-1.2-0.3-2.2-0.9-3-0.6-0.7-1.5-1.1-2.7-1.1h-4.2zm0 10h4.2c1.2 0 2.1 0.4 2.7 1.1 0.6 0.7 0.9 1.7 0.9 3 0 1.2-0.3 2.2-0.9 3-0.6 0.7-1.5 1.1-2.7 1.1h-4.2v-8.2z"
        fill="white"
      />
      
      {/* Dice Icon */}
      <rect x="26" y="8" width="8" height="8" rx="1" fill="white" opacity="0.9" />
      <circle cx="28" cy="10" r="1" fill="#6d28d9" />
      <circle cx="32" cy="10" r="1" fill="#6d28d9" />
      <circle cx="28" cy="14" r="1" fill="#6d28d9" />
      <circle cx="32" cy="14" r="1" fill="#6d28d9" />
      <circle cx="30" cy="12" r="1" fill="#6d28d9" />
    </svg>
  );
};

export default BettingLogo;