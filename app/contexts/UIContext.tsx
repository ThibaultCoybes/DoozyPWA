'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UIContextType {
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <UIContext.Provider value={{ isModalOpen, setModalOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
