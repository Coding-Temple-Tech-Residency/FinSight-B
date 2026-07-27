import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PortfolioFormModal from "./PortfolioFormModal";

const closeModal = vi.fn();

vi.mock("../../../hooks/useModal", () => ({
  useModal: () => ({
    isModalOpen: vi.fn(() => true),
    closeModal,
  }),
}));

vi.mock("../../../components/ui/Modal", () => ({
  default: ({
    isOpen,
    title,
    children,
  }: {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div>
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
}));

vi.mock("./PortfolioForm", () => ({
  default: ({ submitLabel }: { submitLabel: string }) => (
    <div>{submitLabel}</div>
  ),
}));

describe("PortfolioFormModal", () => {
  it("renders create modal", () => {
    render(
      <PortfolioFormModal
        mode="create"
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Create Portfolio" }),
    ).toBeInTheDocument();

    expect(screen.getAllByText("Create Portfolio")).toHaveLength(2);
  });

  it("renders edit modal", () => {
    render(
      <PortfolioFormModal
        mode="edit"
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Edit Portfolio" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });
});
