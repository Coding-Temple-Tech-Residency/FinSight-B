import { useState, type ReactNode } from "react";

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
