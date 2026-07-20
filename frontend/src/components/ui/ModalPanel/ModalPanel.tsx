import type { ReactNode } from "react";

import "../Modal/Modal.css";

type ModalPanelProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

const ModalPanel = ({ title, children, onClose }: ModalPanelProps) => {
  return (
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
  );
};

export default ModalPanel;
