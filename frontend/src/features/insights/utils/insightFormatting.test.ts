import { describe, expect, it, vi } from "vitest";

import {
  formatInsightDate,
  getInsightTypeLabel,
  getSentimentLabel,
  isInsightExpired,
} from "./insightFormatting";

describe("insightFormatting", () => {
  it("returns the correct insight type label", () => {
    expect(getInsightTypeLabel("general")).toBe("AI Conversation");
    expect(getInsightTypeLabel("market")).toBe("Market Insight");
    expect(getInsightTypeLabel("stock")).toBe("Stock Insight");
    expect(getInsightTypeLabel("portfolio")).toBe("Portfolio Insight");
    expect(getInsightTypeLabel("watchlist")).toBe("Watchlist Insight");
    expect(getInsightTypeLabel("news")).toBe("News Insight");
    expect(getInsightTypeLabel("earnings")).toBe("Earnings Insight");
  });

  it("returns the correct sentiment label", () => {
    expect(getSentimentLabel("bullish")).toBe("Bullish");
    expect(getSentimentLabel("bearish")).toBe("Bearish");
    expect(getSentimentLabel("neutral")).toBe("Neutral");
  });

  it("formats a valid insight date", () => {
    expect(formatInsightDate("2026-07-26T15:30:00Z")).not.toBe(
      "Date unavailable",
    );
  });

  it("returns fallback text for an invalid date", () => {
    expect(formatInsightDate("invalid-date")).toBe("Date unavailable");
  });

  it("returns false when expiration is null", () => {
    expect(isInsightExpired(null)).toBe(false);
  });

  it("returns false for an invalid expiration date", () => {
    expect(isInsightExpired("invalid-date")).toBe(false);
  });

  it("returns true when the insight has expired", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-26T12:00:00Z"));

    expect(isInsightExpired("2026-07-26T11:00:00Z")).toBe(true);

    vi.useRealTimers();
  });

  it("returns false when the insight has not expired", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-26T12:00:00Z"));

    expect(isInsightExpired("2026-07-26T13:00:00Z")).toBe(false);

    vi.useRealTimers();
  });
});
