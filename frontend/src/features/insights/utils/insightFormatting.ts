import type { InsightSentiment, InsightType } from "../types/ai";

const insightTypeLabels: Record<InsightType, string> = {
  general: "AI Conversation",
  market: "Market Insight",
  stock: "Stock Insight",
  portfolio: "Portfolio Insight",
  watchlist: "Watchlist Insight",
  news: "News Insight",
  earnings: "Earnings Insight",
};

const sentimentLabels: Record<InsightSentiment, string> = {
  bullish: "Bullish",
  bearish: "Bearish",
  neutral: "Neutral",
};

export const getInsightTypeLabel = (insightType: InsightType): string => {
  return insightTypeLabels[insightType];
};

export const getSentimentLabel = (sentiment: InsightSentiment): string => {
  return sentimentLabels[sentiment];
};

export const formatInsightDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
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
