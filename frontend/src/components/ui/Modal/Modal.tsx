import { useEffect } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

const Modal = ({ isOpen, title, children, onClose }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="modal-panel"
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
    </div>
  );
};

export default Modal;
