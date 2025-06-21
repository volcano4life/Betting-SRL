import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AgeVerificationContextType {
  isAgeVerified: boolean;
  setAgeVerified: (verified: boolean) => void;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

export function AgeVerificationProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available
  const [isAgeVerified, setIsAgeVerifiedState] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ageVerified');
      return stored === 'true';
    }
    return false;
  });

  const setAgeVerified = (verified: boolean) => {
    setIsAgeVerifiedState(verified);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ageVerified', verified.toString());
    }
  };

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ageVerified' && e.newValue !== null) {
        setIsAgeVerifiedState(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
    // Return a fallback instead of throwing error to prevent crashes
    console.warn('useAgeVerification must be used within an AgeVerificationProvider');
    return {
      isAgeVerified: false,
      setAgeVerified: () => {}
    };
  }
  return context;
}