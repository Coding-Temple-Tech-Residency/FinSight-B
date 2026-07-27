import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import SearchResultItem from "./SearchResultItem";

describe("SearchResultItem", () => {
  it("renders the title", () => {
    render(<SearchResultItem id="1" title="Apple" onClick={vi.fn()} />);

    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(
      <SearchResultItem
        id="1"
        title="Apple"
        subtitle="NASDAQ"
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText("NASDAQ")).toBeInTheDocument();
  });

  it("renders the badge", () => {
    render(
      <SearchResultItem id="1" title="Apple" badge="Stock" onClick={vi.fn()} />,
    );

    expect(screen.getByText("Stock")).toBeInTheDocument();
  });

  it("renders the trailing content", () => {
    render(
      <SearchResultItem
        id="1"
        title="Apple"
        trailing="$210.50"
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText("$210.50")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<SearchResultItem id="1" title="Apple" onClick={onClick} />);

    await user.click(screen.getByRole("option"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders the image when provided", () => {
    render(
      <SearchResultItem
        id="1"
        title="Apple"
        image="/apple.png"
        imageAlt="Apple logo"
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByAltText("Apple logo")).toBeInTheDocument();
  });

  it("marks the item as selected", () => {
    render(
      <SearchResultItem id="1" title="Apple" selected onClick={vi.fn()} />,
    );

    expect(screen.getByRole("option")).toHaveAttribute("aria-selected", "true");
  });
});
