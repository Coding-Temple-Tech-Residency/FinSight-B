import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ModalContext } from "../context/ModalContext";
import type { ModalName } from "../types/modals";

type ModalProviderProps = {
  children: ReactNode;
};

type ModalHistoryState = {
  modalOpen?: boolean;
  modalName?: Exclude<ModalName, null>;
};

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [activeModal, setActiveModal] = useState<ModalName>(null);

  const activeModalRef = useRef<ModalName>(null);
  const previousBodyOverflowRef = useRef("");
  const previousBodyPaddingRightRef = useRef("");

  useEffect(() => {
    activeModalRef.current = activeModal;
  }, [activeModal]);

  const openModal = useCallback((modal: Exclude<ModalName, null>) => {
    if (activeModalRef.current === modal) {
      return;
    }

    const currentState =
      (window.history.state as ModalHistoryState | null) ?? {};

    window.history.pushState(
      {
        ...currentState,
        modalOpen: true,
        modalName: modal,
      },
      "",
      window.location.href,
    );

    activeModalRef.current = modal;
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    if (!activeModalRef.current) {
      return;
    }

    activeModalRef.current = null;
    setActiveModal(null);

    const historyState = window.history.state as ModalHistoryState | null;

    if (historyState?.modalOpen) {
      window.history.back();
    }
  }, []);

  const isModalOpen = useCallback(
    (modal: Exclude<ModalName, null>) => {
      return activeModal === modal;
    },
    [activeModal],
  );

  useEffect(() => {
    const handlePopState = () => {
      if (!activeModalRef.current) {
        return;
      }

      activeModalRef.current = null;
      setActiveModal(null);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!activeModal) {
      return;
    }

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    previousBodyOverflowRef.current = document.body.style.overflow;
    previousBodyPaddingRightRef.current = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight =
      scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflowRef.current;

      document.body.style.paddingRight = previousBodyPaddingRightRef.current;

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal, closeModal]);

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
