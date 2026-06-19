import { useEffect, useState, type ReactNode } from "react";
import type { ModalName } from "../types/modals";
import { ModalContext } from "../context/ModalContext";

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
    document.body.style.overflow = activeModal ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
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
