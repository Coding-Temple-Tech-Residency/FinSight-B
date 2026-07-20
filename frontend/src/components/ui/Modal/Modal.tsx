import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

import "./Modal.css";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  panelClassName?: string;
};

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  panelClassName = "",
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className={`modal-panel ${panelClassName}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>

          <button
            type="button"
            className="modal-close-button"
            aria-label="Close modal"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="modal-content">{children}</div>
      </section>
    </div>,
    document.body,
  );
};

export default Modal;
