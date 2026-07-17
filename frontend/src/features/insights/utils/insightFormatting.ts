import type { InsightSentiment, InsightType } from "../types/ai";

export const getInsightTypeLabel = (insightType: InsightType): string => {
  const labels: Record<InsightType, string> = {
    market: "Market Insight",
    stock: "Stock Insight",
    portfolio: "Portfolio Insight",
    watchlist: "Watchlist Insight",
    news: "News Insight",
    earnings: "Earnings Insight",
  };

  return labels[insightType];
};

export const getSentimentLabel = (
  sentiment: InsightSentiment | null,
): string => {
  if (!sentiment) {
    return "Not available";
  }

  const labels: Record<InsightSentiment, string> = {
    bullish: "Bullish",
    bearish: "Bearish",
    neutral: "Neutral",
  };

  return labels[sentiment];
};

export const formatInsightDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const isInsightExpired = (expiresAt: string | null): boolean => {
  if (!expiresAt) {
    return false;
  }

  const expirationDate = new Date(expiresAt);

  if (Number.isNaN(expirationDate.getTime())) {
    return false;
  }

  return expirationDate.getTime() < Date.now();
};
