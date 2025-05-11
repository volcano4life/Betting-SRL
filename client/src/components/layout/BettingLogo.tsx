import React from 'react';
import bettingSrlLogo from '@/assets/betting-srl-logo.png';

interface LogoProps {
  className?: string;
}

const BettingLogo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <img 
      src={bettingSrlLogo} 
      alt="Betting SRL" 
      className={className}
    />
  );
};

export default BettingLogo;