import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import DeletePortfolioDialog from "./DeletePortfolioDialog";

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

describe("DeletePortfolioDialog", () => {
  it("renders the dialog", () => {
    render(
      <DeletePortfolioDialog
        isOpen
        portfolioName="Tech Portfolio"
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Delete Portfolio" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Are you sure you want to delete/i),
    ).toBeInTheDocument();

    expect(screen.getByText('"Tech Portfolio"')).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Delete Portfolio" }),
    ).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <DeletePortfolioDialog
        isOpen
        isDeleting={false}
        onClose={onClose}
        onConfirm={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onConfirm when Delete Portfolio is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <DeletePortfolioDialog
        isOpen
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete Portfolio" }));

    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("shows the deleting state", () => {
    render(
      <DeletePortfolioDialog
        isOpen
        isDeleting
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Deleting..." })).toBeDisabled();

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  it("renders the error message", () => {
    render(
      <DeletePortfolioDialog
        isOpen
        isDeleting={false}
        errorMessage="Something went wrong."
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Something went wrong.",
    );
  });
});
