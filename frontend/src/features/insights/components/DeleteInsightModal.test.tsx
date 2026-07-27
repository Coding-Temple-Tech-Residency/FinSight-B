import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import DeleteInsightModal from "./DeleteInsightModal";

vi.mock("../../../components/ui/Modal", () => ({
  default: ({
    isOpen,
    title,
    onClose,
    children,
  }: {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div>
        <h2>{title}</h2>
        <button onClick={onClose}>Close Modal</button>
        {children}
      </div>
    ) : null,
}));

describe("DeleteInsightModal", () => {
  it("renders modal content", () => {
    render(
      <DeleteInsightModal
        isOpen
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Delete AI Insight",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Are you sure you want to delete this AI insight?"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("This action cannot be undone."),
    ).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <DeleteInsightModal
        isOpen
        isDeleting={false}
        onClose={onClose}
        onConfirm={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onConfirm when Delete insight is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <DeleteInsightModal
        isOpen
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Delete insight",
      }),
    );

    expect(onConfirm).toHaveBeenCalled();
  });

  it("disables buttons while deleting", () => {
    render(
      <DeleteInsightModal
        isOpen
        isDeleting
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Deleting...",
      }),
    ).toBeDisabled();
  });
});
