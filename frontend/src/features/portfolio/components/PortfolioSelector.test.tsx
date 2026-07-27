import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import PortfolioSelector from "./PortfolioSelector";

describe("PortfolioSelector", () => {
  const portfolios = [
    { id: 1, name: "Growth Portfolio" },
    { id: 2, name: "Income Portfolio" },
  ] as never;

  it("renders portfolio selector", () => {
    render(
      <PortfolioSelector
        portfolios={portfolios}
        selectedPortfolioId={1}
        isUpdating={false}
        isDeleting={false}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Selected Portfolio")).toBeInTheDocument();

    expect(screen.getByText("Growth Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Income Portfolio")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls onSelect when a portfolio is selected", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <PortfolioSelector
        portfolios={portfolios}
        selectedPortfolioId={1}
        isUpdating={false}
        isDeleting={false}
        onSelect={onSelect}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await user.selectOptions(screen.getByLabelText("Selected Portfolio"), "2");

    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it("calls onEdit and onDelete", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <PortfolioSelector
        portfolios={portfolios}
        selectedPortfolioId={1}
        isUpdating={false}
        isDeleting={false}
        onSelect={vi.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onEdit).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalled();
  });

  it("shows loading button labels", () => {
    render(
      <PortfolioSelector
        portfolios={portfolios}
        selectedPortfolioId={1}
        isUpdating
        isDeleting
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();

    expect(screen.getByRole("button", { name: "Deleting..." })).toBeDisabled();
  });
});
