import { createContext } from "react";
import type { ModalName } from "../types/modals";

export type ModalContextType = {
  activeModal: ModalName;
  openModal: (modal: Exclude<ModalName, null>) => void;
  closeModal: () => void;
  isModalOpen: (modal: Exclude<ModalName, null>) => boolean;
};

export const ModalContext = createContext<ModalContextType | null>(null);
