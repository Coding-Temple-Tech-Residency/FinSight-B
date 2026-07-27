import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import PortfolioForm from "./PortfolioForm";

describe("PortfolioForm", () => {
  it("renders form fields", () => {
    render(
      <PortfolioForm
        submitLabel="Create Portfolio"
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Portfolio name")).toBeInTheDocument();
    expect(screen.getByLabelText("Display currency")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Portfolio" }),
    ).toBeInTheDocument();
  });

  it("calls onSubmit with form values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <PortfolioForm
        submitLabel="Create Portfolio"
        isSubmitting={false}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByLabelText("Portfolio name"), "My Portfolio");
    await user.type(
      screen.getByLabelText("Description"),
      "Long term investing",
    );

    await user.click(screen.getByRole("button", { name: "Create Portfolio" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "My Portfolio",
      description: "Long term investing",
      currency: "USD",
    });
  });

  it("shows validation error when name is empty", async () => {
    const user = userEvent.setup();

    render(
      <PortfolioForm
        submitLabel="Create Portfolio"
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    );

    const nameInput = screen.getByLabelText("Portfolio name");

    await user.type(nameInput, " ");
    await user.clear(nameInput);

    expect(
      screen.getByRole("button", { name: "Create Portfolio" }),
    ).toBeDisabled();
  });

  it("calls onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <PortfolioForm
        submitLabel="Create Portfolio"
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalled();
  });

  it("shows saving state", () => {
    render(
      <PortfolioForm
        submitLabel="Create Portfolio"
        isSubmitting
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
  });
});
