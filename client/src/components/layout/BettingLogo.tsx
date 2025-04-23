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
          <stop offset="0%" stopColor="#5b21b6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="chipEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9fafb" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      
      {/* Poker Chip Base - Outer Ring */}
      <circle cx="21" cy="21" r="20" fill="url(#chipEdgeGradient)" />
      
      {/* Poker Chip Inner Ring */}
      <circle cx="21" cy="21" r="17" fill="url(#logoGradient)" />
      
      {/* Chip Decorative Pattern - White Dashes */}
      <g opacity="0.7">
        {/* Top Dash */}
        <rect x="18.5" y="3" width="5" height="2" rx="1" fill="white" />
        {/* Top Right Dash */}
        <rect x="29" y="8" width="5" height="2" rx="1" transform="rotate(45 32 9)" fill="white" />
        {/* Right Dash */}
        <rect x="37" y="18.5" width="5" height="2" rx="1" transform="rotate(90 39.5 19.5)" fill="white" />
        {/* Bottom Right Dash */}
        <rect x="29" y="30" width="5" height="2" rx="1" transform="rotate(135 32 31)" fill="white" />
        {/* Bottom Dash */}
        <rect x="18.5" y="37" width="5" height="2" rx="1" transform="rotate(180 21 38)" fill="white" />
        {/* Bottom Left Dash */}
        <rect x="8" y="30" width="5" height="2" rx="1" transform="rotate(225 11 31)" fill="white" />
        {/* Left Dash */}
        <rect x="2" y="18.5" width="5" height="2" rx="1" transform="rotate(270 4.5 19.5)" fill="white" />
        {/* Top Left Dash */}
        <rect x="8" y="8" width="5" height="2" rx="1" transform="rotate(315 11 9)" fill="white" />
      </g>
      
      {/* Letter B with Playing Card Elements */}
      <path
        d="M14.5 14h8c1.4 0 2.5 0.3 3.4 0.9 0.9 0.6 1.3 1.5 1.3 2.6 0 0.8-0.2 1.5-0.7 2.1-0.4 0.6-1 1-1.8 1.3v0.1c1 0.2 1.7 0.6 2.2 1.3 0.5 0.7 0.8 1.5 0.8 2.4 0 1.3-0.5 2.3-1.5 3-1 0.7-2.3 1.1-3.8 1.1h-7.9V14zm7.3 5.8c0.7 0 1.2-0.1 1.6-0.4 0.4-0.3 0.5-0.7 0.5-1.2 0-0.5-0.2-0.9-0.5-1.2-0.4-0.3-0.9-0.4-1.6-0.4h-4.1v3.3h4.1zm0.5 6c0.8 0 1.3-0.1 1.7-0.4 0.4-0.3 0.6-0.7 0.6-1.4 0-0.6-0.2-1-0.6-1.3-0.4-0.3-1-0.4-1.7-0.4h-4.6v3.5h4.6z"
        fill="white"
      />
      
      {/* Card Symbols */}
      <path d="M30.5 12.5l-1.5-1.5-1.5 1.5c-0.5-0.5-1-0.8-1.5-0.8-0.5 0-1 0.3-1.5 0.8l1.5 1.5-1.5 1.5c0.5 0.5 1 0.8 1.5 0.8 0.5 0 1-0.3 1.5-0.8l-1.5-1.5 1.5-1.5c0.5 0.5 1 0.8 1.5 0.8 0.5 0 1-0.3 1.5-0.8z" fill="#f9a8d4" />
      <path d="M30.5 28.5l-1.5-1.5-1.5 1.5c-0.5-0.5-1-0.8-1.5-0.8-0.5 0-1 0.3-1.5 0.8l1.5 1.5-1.5 1.5c0.5 0.5 1 0.8 1.5 0.8 0.5 0 1-0.3 1.5-0.8l-1.5-1.5 1.5-1.5c0.5 0.5 1 0.8 1.5 0.8 0.5 0 1-0.3 1.5-0.8z" fill="#f9a8d4" />
    </svg>
  );
};

export default BettingLogo;