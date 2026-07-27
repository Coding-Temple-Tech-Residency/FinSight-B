import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ChatMessageContent from "./ChatMessageContent";

describe("ChatMessageContent", () => {
  it("renders plain text content", () => {
    render(<ChatMessageContent content="Hello FinSight" />);

    expect(screen.getByText("Hello FinSight")).toBeInTheDocument();
  });

  it("renders markdown content", () => {
    render(<ChatMessageContent content="## Portfolio Analysis" />);

    expect(
      screen.getByRole("heading", {
        name: "Portfolio Analysis",
      }),
    ).toBeInTheDocument();
  });

  it("renders markdown links with target blank", () => {
    render(<ChatMessageContent content="[OpenAI](https://openai.com)" />);

    const link = screen.getByRole("link", {
      name: "OpenAI",
    });

    expect(link).toHaveAttribute("target", "_blank");

    expect(link).toHaveAttribute("rel", "noreferrer");
  });
});
