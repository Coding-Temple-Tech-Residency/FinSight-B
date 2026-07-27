import { describe, expect, it } from "vitest";

import { formatChartData } from "./chartData";
import type { MarketHistory } from "../types/market";

describe("formatChartData", () => {
  it("formats valid market history", () => {
    const history: MarketHistory[] = [
      {
        id: 1,
        stock_id: 1,
        timeframe: "1D",
        open_price: 198,
        high_price: 202,
        low_price: 197,
        close_price: 200,
        volume: 1000000,
        price_timestamp: "2026-07-26T00:00:00Z",
        created_at: "2026-07-26T00:00:00Z",
      },
    ];

    const result = formatChartData(history);

    expect(result).toHaveLength(1);
    expect(result[0].close).toBe(200);
    expect(result[0].date).toBeTruthy();
    expect(result[0].timestamp).toBeGreaterThan(0);
  });

  it("filters invalid dates", () => {
    const history: MarketHistory[] = [
      {
        id: 1,
        stock_id: 1,
        timeframe: "1D",
        open_price: 198,
        high_price: 202,
        low_price: 197,
        close_price: 200,
        volume: 1000000,
        price_timestamp: "invalid-date",
        created_at: "2026-07-26T00:00:00Z",
      },
    ];

    expect(formatChartData(history)).toEqual([]);
  });

  it("filters invalid close prices", () => {
    const history: MarketHistory[] = [
      {
        id: 1,
        stock_id: 1,
        timeframe: "1D",
        open_price: 198,
        high_price: 202,
        low_price: 197,
        close_price: "invalid",
        volume: 1000000,
        price_timestamp: "2026-07-26T00:00:00Z",
        created_at: "2026-07-26T00:00:00Z",
      },
    ];

    expect(formatChartData(history)).toEqual([]);
  });

  it("sorts data by timestamp", () => {
    const history: MarketHistory[] = [
      {
        id: 2,
        stock_id: 1,
        timeframe: "1D",
        open_price: 205,
        high_price: 206,
        low_price: 204,
        close_price: 205,
        volume: 1000000,
        price_timestamp: "2026-07-27T00:00:00Z",
        created_at: "2026-07-27T00:00:00Z",
      },
      {
        id: 1,
        stock_id: 1,
        timeframe: "1D",
        open_price: 198,
        high_price: 202,
        low_price: 197,
        close_price: 200,
        volume: 1000000,
        price_timestamp: "2026-07-26T00:00:00Z",
        created_at: "2026-07-26T00:00:00Z",
      },
    ];

    const result = formatChartData(history);

    expect(result[0].close).toBe(200);
    expect(result[1].close).toBe(205);
  });
});
