import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Modal from "./Modal";

const mockOnClose = vi.fn();

describe("Modal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "";
  });

  it("does not render when closed", () => {
    render(
      <Modal isOpen={false} title="Test Modal" onClose={mockOnClose}>
        Content
      </Modal>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when open", () => {
    render(
      <Modal isOpen title="Test Modal" onClose={mockOnClose}>
        Modal Content
      </Modal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen title="Test Modal" onClose={mockOnClose}>
        Content
      </Modal>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Close Test Modal",
      }),
    );

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("closes when Escape is pressed", () => {
    render(
      <Modal isOpen title="Test Modal" onClose={mockOnClose}>
        Content
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");

    fireEvent.keyDown(dialog, {
      key: "Escape",
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  it("does not close on Escape when disabled", () => {
    render(
      <Modal
        isOpen
        title="Test Modal"
        onClose={mockOnClose}
        closeOnEscape={false}
      >
        Content
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");

    fireEvent.keyDown(dialog, {
      key: "Escape",
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });
  it("closes when clicking the overlay", () => {
    render(
      <Modal isOpen title="Test Modal" onClose={mockOnClose}>
        Content
      </Modal>,
    );

    const overlay = document.querySelector(".modal-overlay");

    expect(overlay).toBeInTheDocument();

    fireEvent.mouseDown(overlay!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when overlay click is disabled", () => {
    render(
      <Modal
        isOpen
        title="Test Modal"
        onClose={mockOnClose}
        closeOnOverlayClick={false}
      >
        Content
      </Modal>,
    );

    const overlay = document.querySelector(".modal-overlay");
    expect(overlay).toBeInTheDocument();

    fireEvent.mouseDown(overlay!);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("applies a custom panel class", () => {
    render(
      <Modal
        isOpen
        title="Test Modal"
        onClose={mockOnClose}
        panelClassName="custom-panel"
      >
        Content
      </Modal>,
    );

    expect(document.querySelector(".custom-panel")).toBeInTheDocument();
  });

  it("locks body scrolling while open", () => {
    render(
      <Modal isOpen title="Test Modal" onClose={mockOnClose}>
        Content
      </Modal>,
    );

    expect(document.body.style.overflow).toBe("hidden");
  });
});
