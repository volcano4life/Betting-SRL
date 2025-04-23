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
        <linearGradient id="casinoBlackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#111827" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
        <linearGradient id="casinoRedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="vegasGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Vegas Night Background */}
      <rect x="0" y="0" width="42" height="42" rx="6" fill="url(#casinoBlackGradient)" />
      
      {/* Vegas Skyline */}
      <path d="M0,32 h42 v10 h-42 z" fill="#000" fillOpacity="0.6" />
      <path d="M2,32 v-5 h2 v-3 h2 v3 h1 v-2 h2 v-3 h2 v5 h3 v-8 h3 v-3 h2 v3 h3 v8 h2 v-6 h3 v-4 h2 v4 h1 v-2 h2 v2 h1 v-5 h2 v5 h2 v-3 h3 v11 h-42 z"
        fill="#000" fillOpacity="0.8" />
      
      {/* Neon Sign Frame */}
      <rect x="5" y="5" width="32" height="20" rx="3" 
        fill="none" 
        stroke="url(#vegasGoldGradient)" 
        strokeWidth="1.5" 
        filter="url(#neonGlow)" />
      
      {/* Vegas Style Lights */}
      <circle cx="8" cy="8" r="1" fill="#FFFFFF" filter="url(#neonGlow)" />
      <circle cx="34" cy="8" r="1" fill="#FFFFFF" filter="url(#neonGlow)" />
      <circle cx="8" cy="22" r="1" fill="#FFFFFF" filter="url(#neonGlow)" />
      <circle cx="34" cy="22" r="1" fill="#FFFFFF" filter="url(#neonGlow)" />
      
      {/* Vegas Slots Machine Symbols */}
      <g transform="translate(9, 10)">
        <circle cx="0" cy="0" r="3.5" fill="url(#casinoRedGradient)" stroke="#f9a8d4" strokeWidth="0.5" />
        <text x="0" y="1.5" 
          textAnchor="middle" 
          fontSize="5" 
          fontWeight="bold" 
          fill="#FFFFFF" 
          fontFamily="Arial, sans-serif">7</text>
      </g>
      
      <g transform="translate(21, 12)">
        <path 
          d="M-4,-4 h8 v8 h-8 z" 
          fill="url(#vegasGoldGradient)" 
          stroke="#fbbf24" 
          strokeWidth="0.5" />
        <text x="0" y="1.5" 
          textAnchor="middle" 
          fontSize="6" 
          fontWeight="bold" 
          fill="#FFFFFF" 
          fontFamily="Arial, sans-serif">B</text>
      </g>
      
      <g transform="translate(33, 10)">
        <path d="M0,-4 l2,2 l2,-2 l-2,6 l-2,-6 z" 
          fill="#FFFFFF" 
          stroke="#e5e7eb" 
          strokeWidth="0.5" />
      </g>
      
      {/* Dice */}
      <g transform="translate(15, 30) rotate(10)">
        <rect x="-4" y="-4" width="8" height="8" rx="1" 
          fill="#FFFFFF" 
          stroke="#e5e7eb" 
          strokeWidth="0.5" />
        <circle cx="-2" cy="-2" r="1" fill="#b91c1c" />
        <circle cx="2" cy="2" r="1" fill="#b91c1c" />
      </g>
      
      <g transform="translate(27, 30) rotate(-10)">
        <rect x="-4" y="-4" width="8" height="8" rx="1" 
          fill="#FFFFFF" 
          stroke="#e5e7eb" 
          strokeWidth="0.5" />
        <circle cx="-2" cy="-2" r="0.8" fill="#111827" />
        <circle cx="0" cy="0" r="0.8" fill="#111827" />
        <circle cx="2" cy="2" r="0.8" fill="#111827" />
      </g>
    </svg>
  );
};

export default CasinoChipLogo;