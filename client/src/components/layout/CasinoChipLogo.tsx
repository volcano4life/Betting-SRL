import React from 'react';

interface LogoProps {
  className?: string;
}

const CasinoChipLogo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <svg 
      width="42" 
      height="42" 
      viewBox="0 0 42 42" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="chipMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5b21b6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="chipEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3f4f6" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>
        <radialGradient id="chipSurfaceGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#5b21b6" />
        </radialGradient>
      </defs>
      
      {/* Outer Ring */}
      <circle cx="21" cy="21" r="20" fill="url(#chipEdgeGradient)" />
      
      {/* Chip Base */}
      <circle cx="21" cy="21" r="16" fill="url(#chipSurfaceGradient)" />
      
      {/* Edge Decorations */}
      <path d="M21 2A19 19 0 1 0 21 40 19 19 0 1 0 21 2Z" fill="none" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="3,2" />
      
      {/* Inner Circle */}
      <circle cx="21" cy="21" r="12" fill="url(#chipMainGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      
      {/* B Shape */}
      <path d="M15 14h6c1.4 0 2.5 0.3 3.3 0.9 0.8 0.6 1.2 1.4 1.2 2.5 0 0.8-0.2 1.4-0.7 2-0.4 0.5-1 0.9-1.7 1.1v0.1c0.9 0.2 1.6 0.6 2 1.2 0.5 0.6 0.7 1.3 0.7 2.2 0 1.2-0.4 2.2-1.3 2.8-0.9 0.6-2.1 1-3.6 1h-6V14zm5.5 5.5c0.6 0 1.1-0.1 1.4-0.4 0.3-0.2 0.5-0.6 0.5-1 0-0.5-0.2-0.8-0.5-1-0.3-0.2-0.8-0.4-1.4-0.4h-2.3v2.8h2.3zm0.3 5.5c0.7 0 1.2-0.1 1.6-0.4 0.4-0.3 0.5-0.7 0.5-1.2 0-0.5-0.2-0.9-0.5-1.1-0.4-0.3-0.9-0.4-1.6-0.4h-2.6v3.1h2.6z"
        fill="white" />
      
      {/* Card Suits */}
      <g fill="#f3f4f6" opacity="0.6">
        {/* Club */}
        <circle cx="29" cy="12" r="1" />
        <circle cx="27.5" cy="13.5" r="1" />
        <circle cx="30.5" cy="13.5" r="1" />
        <rect x="29" y="13" width="1" height="2" transform="rotate(45 29.5 14)" />
        
        {/* Diamond */}
        <path d="M30 26l-1.5-1.5-1.5 1.5 1.5 1.5z" />
        
        {/* Heart */}
        <circle cx="27.5" cy="31" r="1" />
        <circle cx="30.5" cy="31" r="1" />
        <path d="M29 33l-2-2h4z" />
      </g>
    </svg>
  );
};

export default CasinoChipLogo;