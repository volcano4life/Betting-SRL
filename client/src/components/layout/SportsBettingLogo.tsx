import React from 'react';

interface LogoProps {
  className?: string;
}

const SportsBettingLogo: React.FC<LogoProps> = ({ className = "" }) => {
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
        <linearGradient id="darkBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* Stadium Background */}
      <rect x="1" y="1" width="40" height="40" rx="5" fill="#059669" filter="url(#shadow)" />
      
      {/* Field Lines */}
      <circle cx="21" cy="21" r="15" stroke="white" strokeWidth="0.5" fill="none" />
      <rect x="16" y="4" width="10" height="6" stroke="white" strokeWidth="0.5" fill="none" />
      <rect x="16" y="32" width="10" height="6" stroke="white" strokeWidth="0.5" fill="none" />
      <line x1="1" y1="21" x2="41" y2="21" stroke="white" strokeWidth="0.5" />
      
      {/* B Logo (Sports Jersey) */}
      <g transform="translate(13, 13)">
        <path d="M0,0 h16 v16 h-16 z" fill="url(#darkBlueGradient)" />
        
        {/* Jersey Number */}
        <path 
          d="M3.5 2.5h5c1.1 0 2 0.2 2.6 0.7 0.6 0.5 1 1.1 1 2 0 0.6-0.2 1.1-0.5 1.5-0.3 0.4-0.7 0.7-1.2 0.8v0.1c0.6 0.1 1.1 0.4 1.4 0.9 0.3 0.5 0.5 1 0.5 1.7 0 1-0.3 1.8-1 2.3-0.7 0.5-1.7 0.8-2.9 0.8H3.5V2.5zm4.5 4.5c0.5 0 0.9-0.1 1.1-0.3 0.3-0.2 0.4-0.5 0.4-0.9s-0.1-0.7-0.4-0.9C8.9 4.7 8.5 4.6 8 4.6H6v2.5h2zm0.3 5c0.6 0 1-0.1 1.3-0.3 0.3-0.2 0.4-0.6 0.4-1s-0.1-0.8-0.4-1c-0.3-0.2-0.7-0.3-1.3-0.3H6v2.6h2.3z"
          fill="white"
        />
      </g>
      
      {/* Sports Elements */}
      <g transform="translate(28, 8)">
        <circle cx="0" cy="0" r="5" fill="url(#redGradient)" stroke="white" strokeWidth="0.5" />
        <path d="M-3,0 h6 M0,-3 v6" stroke="white" strokeWidth="0.7" />
        <path d="M-2.1,-2.1 l4.2,4.2 M-2.1,2.1 l4.2,-4.2" stroke="white" strokeWidth="0.7" />
      </g>
      
      {/* Trophy */}
      <g transform="translate(29, 30)">
        <path d="M-3,-5 h6 v1 h1 v3 h-1 c0,1.5 -1.3,3 -3,3 v1 h2 v1 h-4 v-1 h2 v-1 c-1.7,0 -3,-1.5 -3,-3 h-1 v-3 h1 z" 
          fill="url(#goldGradient)" stroke="#fbbf24" strokeWidth="0.3" />
      </g>
      
      {/* Score Display */}
      <g transform="translate(10, 32)">
        <rect x="0" y="0" width="7" height="5" rx="1" fill="#000000" fillOpacity="0.6" />
        <text x="1" y="3.5" fill="white" fontSize="3" fontWeight="bold">2-1</text>
      </g>
    </svg>
  );
};

export default SportsBettingLogo;