import { useState, useEffect } from 'react';
import { useModalStack } from '@/contexts/ModalStackContext';

export function useStackedModal(baseId?: string, externalIsOpen?: boolean) {
  const { registerModal, unregisterModal, getZIndex } = useModalStack();
  const [modalId] = useState(() => baseId || `modal-${Date.now()}-${Math.random()}`);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  useEffect(() => {
    if (isOpen) {
      registerModal(modalId);
    } else {
      unregisterModal(modalId);
    }
    return () => unregisterModal(modalId);
  }, [isOpen, modalId, registerModal, unregisterModal]);

  const zIndex = getZIndex(modalId);

  return {
    modalId,
    isOpen,
    setIsOpen: setInternalIsOpen,
    zIndex,
    open: () => setInternalIsOpen(true),
    close: () => setInternalIsOpen(false),
    toggle: () => setInternalIsOpen(prev => !prev)
  };
}