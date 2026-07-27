import { describe, expect, it } from "vitest";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

import { searchPlatform } from "./searchPlatform";
import type { SearchItem } from "../types/search";

describe("searchPlatform", () => {
  const items: SearchItem[] = [
    {
      id: "portfolio",
      title: "Portfolio",
      description: "Manage your investments",
      path: "/dashboard/portfolio",
      category: "portfolio",
      keywords: ["stocks", "investments"],
      icon: faChartLine,
    },
    {
      id: "watchlist",
      title: "Watchlist",
      description: "Track your favorite stocks",
      path: "/dashboard/watchlist",
      category: "watchlist",
      keywords: ["favorites", "tracking"],
      icon: faChartLine,
    },
  ];

  it("returns an empty array for an empty query", () => {
    expect(searchPlatform(items, "")).toEqual([]);
  });

  it("finds matching items", () => {
    const results = searchPlatform(items, "portfolio");

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Portfolio");
  });

  it("matches keywords", () => {
    const results = searchPlatform(items, "investments");

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Portfolio");
  });

  it("matches descriptions", () => {
    const results = searchPlatform(items, "favorite");

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Watchlist");
  });

  it("sorts results by score", () => {
    const results = searchPlatform(items, "stocks");

    expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
  });

  it("returns no results when nothing matches", () => {
    expect(searchPlatform(items, "bitcoin")).toEqual([]);
  });
});
