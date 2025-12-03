import React, { createContext, useContext, useState, useCallback } from 'react';

interface ModalStackContextType {
  registerModal: (id: string) => number;
  unregisterModal: (id: string) => void;
  getZIndex: (id: string) => number;
}

const ModalStackContext = createContext<ModalStackContextType | undefined>(undefined);

export function ModalStackProvider({ children }: { children: React.ReactNode }) {
  const [modalStack, setModalStack] = useState<string[]>([]);
  const baseZIndex = 50; // Base z-index for modals

  const registerModal = useCallback((id: string) => {
    setModalStack(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
    return baseZIndex + modalStack.length;
  }, [modalStack.length]);

  const unregisterModal = useCallback((id: string) => {
    setModalStack(prev => prev.filter(modalId => modalId !== id));
  }, []);

  const getZIndex = useCallback((id: string) => {
    const index = modalStack.indexOf(id);
    return index >= 0 ? baseZIndex + index : baseZIndex;
  }, [modalStack]);

  return (
    <ModalStackContext.Provider value={{ registerModal, unregisterModal, getZIndex }}>
      {children}
    </ModalStackContext.Provider>
  );
}

export function useModalStack() {
  const context = useContext(ModalStackContext);
  if (!context) {
    throw new Error('useModalStack must be used within a ModalStackProvider');
  }
  return context;
}