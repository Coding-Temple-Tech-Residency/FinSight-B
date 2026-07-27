import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import SearchResultCard from "./SearchResultCard";

vi.mock("../utils/getSearchResultIcon", () => ({
  getSearchResultIcon: () => ({}),
}));

vi.mock("../utils/getSearchResultColor", () => ({
  getSearchResultColor: () => "text-blue-500",
}));

const baseResult = {
  id: "1",
  type: "stock" as const,
  title: "Apple Inc.",
  subtitle: "AAPL",
  badge: "NASDAQ",
  trailing: "$210.55",
  href: "/dashboard/market?symbol=AAPL",
};

describe("SearchResultCard", () => {
  it("renders the result information", () => {
    render(
      <MemoryRouter>
        <SearchResultCard result={baseResult} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("NASDAQ")).toBeInTheDocument();
    expect(screen.getByText("$210.55")).toBeInTheDocument();
  });

  it("renders a link when href exists", () => {
    render(
      <MemoryRouter>
        <SearchResultCard result={baseResult} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/dashboard/market?symbol=AAPL",
    );
  });

  it("calls onClick when provided", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <MemoryRouter>
        <SearchResultCard result={baseResult} onClick={onClick} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders without a link when href is missing", () => {
    render(
      <MemoryRouter>
        <SearchResultCard
          result={{
            ...baseResult,
            href: undefined,
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the image when provided", () => {
    render(
      <MemoryRouter>
        <SearchResultCard
          result={{
            ...baseResult,
            image: "/logo.png",
          }}
        />
      </MemoryRouter>,
    );

    const image = document.querySelector(
      'img[src="/logo.png"]',
    ) as HTMLImageElement;

    expect(image).not.toBeNull();
    expect(image.src).toContain("/logo.png");
  });
});
