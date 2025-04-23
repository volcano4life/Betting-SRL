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
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="cardShineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.2" />
        </filter>
      </defs>
      
      {/* Playing Card Table Background */}
      <rect x="1" y="1" width="40" height="40" rx="4" 
        fill="url(#cardGradient)" 
        filter="url(#shadow)" />
      
      {/* Table Texture */}
      <rect x="3" y="3" width="36" height="36" rx="3" 
        fill="url(#cardGradient)" 
        stroke="#FFFFFF" 
        strokeOpacity="0.1" 
        strokeWidth="0.5" />
        
      {/* Card Shine */}
      <rect x="3" y="3" width="36" height="10" rx="2" 
        fill="url(#cardShineGradient)" 
        opacity="0.2" />
      
      {/* Playing Cards */}
      <g transform="translate(7, 7) rotate(-5)">
        <rect x="0" y="0" width="16" height="22" rx="2" 
          fill="white" 
          stroke="#e5e7eb" 
          strokeWidth="0.5" />
        
        {/* Card Pattern */}
        <rect x="2" y="2" width="12" height="18" rx="1" 
          stroke="#e11d48" 
          strokeWidth="0.5" 
          fill="none" 
          strokeDasharray="0.5,0.5" />
          
        {/* Card Symbols */}
        <circle cx="4" cy="4" r="1.5" fill="#e11d48" />
        <circle cx="12" cy="18" r="1.5" fill="#e11d48" />
        
        {/* Letter B on the Card */}
        <path
          d="M6 8h3c0.6 0 1 0.1 1.4 0.4 0.3 0.3 0.5 0.6 0.5 1 0 0.3-0.1 0.6-0.3 0.8-0.2 0.2-0.4 0.4-0.7 0.5v0.1c0.4 0.1 0.6 0.2 0.8 0.5 0.2 0.3 0.3 0.6 0.3 0.9 0 0.5-0.2 0.9-0.6 1.2-0.4 0.3-0.9 0.4-1.5 0.4H6V8zm2.9 2.3c0.3 0 0.5-0.1 0.6-0.2 0.1-0.1 0.2-0.3 0.2-0.5 0-0.2-0.1-0.3-0.2-0.4-0.1-0.1-0.3-0.2-0.6-0.2H7.5v1.2h1.4zm0.2 2.4c0.3 0 0.5 0 0.7-0.2 0.2-0.1 0.2-0.3 0.2-0.5s-0.1-0.4-0.2-0.5c-0.2-0.1-0.4-0.2-0.7-0.2H7.5v1.4h1.6z"
          fill="#e11d48"
        />
      </g>
      
      {/* Second Card (Bottom) */}
      <g transform="translate(15, 12) rotate(8)">
        <rect x="0" y="0" width="16" height="22" rx="2" 
          fill="white" 
          stroke="#e5e7eb" 
          strokeWidth="0.5" />
          
        {/* Card Pattern */}
        <rect x="2" y="2" width="12" height="18" rx="1" 
          stroke="#1e40af" 
          strokeWidth="0.5" 
          fill="none" 
          strokeDasharray="0.5,0.5" />
          
        {/* Card Symbols */}
        <path d="M4 4l1.5 1.5L4 7l1.5 1.5L4 10" 
          stroke="#1e40af" strokeWidth="0.8" fill="none" />
        <path d="M12 12l-1.5 1.5L12 15l-1.5 1.5L12 18" 
          stroke="#1e40af" strokeWidth="0.8" fill="none" />
      </g>
      
      {/* Poker Chips */}
      <circle cx="30" cy="12" r="5" fill="url(#goldGradient)" stroke="#FFF" strokeWidth="0.5" />
      <circle cx="30" cy="12" r="3" fill="#FFFFFF" fillOpacity="0.2" />
      <circle cx="30" cy="12" r="1" fill="#FFFFFF" fillOpacity="0.3" />
      
      <circle cx="28" cy="30" r="5" fill="#e11d48" stroke="#FFF" strokeWidth="0.5" />
      <circle cx="28" cy="30" r="3" fill="#FFFFFF" fillOpacity="0.2" />
      <circle cx="28" cy="30" r="1" fill="#FFFFFF" fillOpacity="0.3" />
      
      {/* B mark */}
      <text x="18" y="26" 
        fontFamily="Arial" 
        fontSize="16" 
        fontWeight="bold" 
        fill="#FFFFFF" 
        textAnchor="middle">B</text>
    </svg>
  );
};

export default BettingLogo;