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
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5b21b6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="ballGradient" x1="30%" y1="30%" x2="70%" y2="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      
      {/* Shield Background */}
      <path d="M21 2L4 9.5V21c0 9.1 7.2 17.6 17 20.8 9.8-3.2 17-11.7 17-20.8V9.5L21 2z" 
        fill="url(#logoGradient)" />
      
      {/* Shield Border */}
      <path d="M21 5L6 11.5V21c0 8 6.1 15.5 15 18.5 8.9-3 15-10.5 15-18.5V11.5L21 5z" 
        fill="url(#logoGradient)" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
        
      {/* Letter B */}
      <path d="M15 12h7c1.5 0 2.7 0.3 3.6 1 0.9 0.7 1.4 1.7 1.4 3 0 0.8-0.2 1.5-0.6 2.1-0.4 0.6-0.9 1-1.5 1.2v0.2c0.7 0.2 1.4 0.6 1.8 1.3 0.5 0.6 0.7 1.4 0.7 2.3 0 1.4-0.5 2.5-1.5 3.3-1 0.8-2.3 1.2-4 1.2h-6.9V12zm6.3 7c0.6 0 1.1-0.1 1.5-0.4 0.3-0.3 0.5-0.7 0.5-1.2s-0.2-0.9-0.5-1.1c-0.3-0.3-0.8-0.4-1.5-0.4h-3.1v3.1h3.1zm0.4 7c0.7 0 1.2-0.2 1.6-0.5 0.4-0.3 0.6-0.8 0.6-1.4 0-0.6-0.2-1-0.6-1.3-0.4-0.3-0.9-0.5-1.6-0.5h-3.5v3.7h3.5z" 
        fill="white" />
      
      {/* Sports Ball Icon */}
      <circle cx="28" cy="14" r="4.5" fill="url(#ballGradient)" stroke="#333" strokeWidth="0.5" />
      <path d="M28 9.5v9M23.5 14h9" stroke="#333" strokeWidth="0.5" />
      <path d="M24.5 10.5l7 7M24.5 17.5l7-7" stroke="#333" strokeWidth="0.5" />
      
      {/* Betting Odds */}
      <rect x="22" y="26" width="14" height="6" rx="1" fill="white" fillOpacity="0.2" />
      <text x="24" y="30.5" fontSize="4" fontWeight="bold" fill="white">+150</text>
    </svg>
  );
};

export default SportsBettingLogo;