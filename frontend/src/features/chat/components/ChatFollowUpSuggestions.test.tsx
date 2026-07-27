import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ChatFollowUpSuggestions from "./ChatFollowUpSuggestions";

describe("ChatFollowUpSuggestions", () => {
  it("renders follow up suggestions", () => {
    render(<ChatFollowUpSuggestions symbol="AAPL" onSelect={vi.fn()} />);

    expect(screen.getByText("Continue exploring")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Analyze the diversification across all of my portfolios.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Explain how AAPL could affect my overall portfolio risk.",
      ),
    ).toBeInTheDocument();
  });

  it("calls onSelect when suggestion is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<ChatFollowUpSuggestions symbol="TSLA" onSelect={onSelect} />);

    await user.click(
      screen.getByRole("button", {
        name: "Explain how TSLA could affect my overall portfolio risk.",
      }),
    );

    expect(onSelect).toHaveBeenCalledWith(
      "Explain how TSLA could affect my overall portfolio risk.",
    );
  });

  it("disables suggestions when disabled is true", () => {
    render(
      <ChatFollowUpSuggestions symbol="AAPL" disabled onSelect={vi.fn()} />,
    );

    const buttons = screen.getAllByRole("button");

    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
