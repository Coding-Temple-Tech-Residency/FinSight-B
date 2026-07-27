import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useSearchHistory } from "./useSearchHistory";

const apple = {
  symbol: "AAPL",
  company_name: "Apple Inc.",
};

const tesla = {
  symbol: "TSLA",
  company_name: "Tesla Inc.",
};

describe("useSearchHistory", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with an empty history", () => {
    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.recentStocks).toEqual([]);
  });

  it("adds a recent stock", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addRecentStock(apple);
    });

    expect(result.current.recentStocks).toEqual([apple]);
  });

  it("removes a recent stock", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addRecentStock(apple);
      result.current.addRecentStock(tesla);
    });

    act(() => {
      result.current.removeRecentStock("AAPL");
    });

    expect(result.current.recentStocks).toEqual([tesla]);
  });

  it("clears all recent stocks", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addRecentStock(apple);
      result.current.addRecentStock(tesla);
    });

    act(() => {
      result.current.clearRecentStocks();
    });

    expect(result.current.recentStocks).toEqual([]);
  });

  it("does not add duplicate symbols", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addRecentStock(apple);
      result.current.addRecentStock(apple);
    });

    expect(result.current.recentStocks).toHaveLength(1);
    expect(result.current.recentStocks[0].symbol).toBe("AAPL");
  });
});
