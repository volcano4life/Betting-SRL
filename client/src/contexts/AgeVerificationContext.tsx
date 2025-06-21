import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AgeVerificationContextType {
  isAgeVerified: boolean;
  setAgeVerified: (verified: boolean) => void;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

export function AgeVerificationProvider({ children }: { children: ReactNode }) {
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  const setAgeVerified = (verified: boolean) => {
    setIsAgeVerified(verified);
  };

  return (
    <AgeVerificationContext.Provider
      value={{
        isAgeVerified,
        setAgeVerified,
      }}
    >
      {children}
    </AgeVerificationContext.Provider>
  );
}

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext);
  if (!context) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider');
  }
  return context;
}