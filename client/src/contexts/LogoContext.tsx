import React, { createContext, ReactNode, useState, useContext } from "react";

export type LogoType = 'poker-chip' | 'sports-shield' | 'casino-chip' | 'custom';

interface LogoContextType {
  selectedLogo: LogoType;
  setSelectedLogo: (logo: LogoType) => void;
  customLogoUrl: string | null;
  setCustomLogoUrl: (url: string | null) => void;
}

export const LogoContext = createContext<LogoContextType | null>(null);

export const LogoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedLogo, setSelectedLogo] = useState<LogoType>('poker-chip');
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  return (
    <LogoContext.Provider
      value={{
        selectedLogo,
        setSelectedLogo,
        customLogoUrl,
        setCustomLogoUrl,
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