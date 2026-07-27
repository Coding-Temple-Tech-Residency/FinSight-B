import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HoldingFormModal from "./HoldingFormModal";

const mockCloseModal = vi.fn();
const mockIsModalOpen = vi.fn();

vi.mock("../../../hooks/useModal", () => ({
  useModal: () => ({
    closeModal: mockCloseModal,
    isModalOpen: mockIsModalOpen,
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
        <h1>{title}</h1>
        {children}
      </div>
    ) : null,
}));

vi.mock("./HoldingForm", () => ({
  default: () => <div>Holding Form</div>,
}));

describe("HoldingFormModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsModalOpen.mockReturnValue(true);
  });

  it("renders add holding modal", () => {
    render(<HoldingFormModal isSubmitting={false} onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Add Holding" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Holding Form")).toBeInTheDocument();
  });

  it("renders edit holding modal", () => {
    render(
      <HoldingFormModal
        holding={
          {
            id: "1",
            symbol: "AAPL",
          } as never
        }
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Edit AAPL" }),
    ).toBeInTheDocument();
  });

  it("does not render when the modal is closed", () => {
    mockIsModalOpen.mockReturnValue(false);

    render(<HoldingFormModal isSubmitting={false} onSubmit={vi.fn()} />);

    expect(screen.queryByText("Holding Form")).not.toBeInTheDocument();
  });
});
