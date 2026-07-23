import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

import { createPortal } from "react-dom";

import "./Modal.css";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  panelClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
};

const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable]",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  panelClassName = "",
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) => {
  const titleId = useId();

  const panelRef = useRef<HTMLElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current;

      if (!panel) {
        return;
      }

      const firstFocusableElement =
        panel.querySelector<HTMLElement>(focusableSelector);

      if (firstFocusableElement) {
        firstFocusableElement.focus();
        return;
      }

      panel.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);

      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;

      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) {
      return;
    }

    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLElement>): void => {
    if (event.key === "Escape") {
      event.stopPropagation();

      if (closeOnEscape) {
        onClose();
      }

      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const focusableElements = Array.from(
      panel.querySelectorAll<HTMLElement>(focusableSelector),
    ).filter((element) => {
      return (
        !element.hasAttribute("disabled") &&
        element.getAttribute("aria-hidden") !== "true"
      );
    });

    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstFocusableElement) {
      event.preventDefault();
      lastFocusableElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastFocusableElement) {
      event.preventDefault();
      firstFocusableElement.focus();
    }
  };

  const modalContent = (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={handleOverlayMouseDown}
    >
      <section
        ref={panelRef}
        className={["modal-panel", panelClassName].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handlePanelKeyDown}
      >
        <header className="modal-header">
          <h2 id={titleId}>{title}</h2>

          <button
            type="button"
            className="modal-close-button"
            aria-label={`Close ${title}`}
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="modal-content">{children}</div>
      </section>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
