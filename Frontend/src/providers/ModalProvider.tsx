import { useEffect, useState, type ReactNode } from "react";

import { ModalContext } from "../context/ModalContext";
import type { ModalName } from "../types/modals";

type ModalProviderProps = {
  children: ReactNode;
};

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [activeModal, setActiveModal] = useState<ModalName>(null);

  const openModal = (modal: Exclude<ModalName, null>) => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const isModalOpen = (modal: Exclude<ModalName, null>) => {
    return activeModal === modal;
  };

  useEffect(() => {
    if (!activeModal) return;

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeModal]);

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        openModal,
        closeModal,
        isModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
