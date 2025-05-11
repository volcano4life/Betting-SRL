import React, { createContext, ReactNode, useState, useContext } from "react";

export type LogoType = 'poker-chip' | 'sports-shield' | 'casino-chip';

interface LogoContextType {
  selectedLogo: LogoType;
  setSelectedLogo: (logo: LogoType) => void;
}

export const LogoContext = createContext<LogoContextType | null>(null);

export const LogoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedLogo, setSelectedLogo] = useState<LogoType>('poker-chip');

  return (
    <LogoContext.Provider
      value={{
        selectedLogo,
        setSelectedLogo,
      }}
    >
      {children}
    </LogoContext.Provider>
  );
};

export function useLogo(): LogoContextType {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
}