// src/types/dashboard.ts

export type Trend = "up" | "down" | "neutral";

export type KeyMetric = {
  id: number;
  label: string;
  value: number;
  change?: number;
  changePercent?: number;
  trend: Trend;
  prefix?: string;
  suffix?: string;
};

export type Holding = {
  id: number;
  symbol: string;
  company: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercent: number;
};

export type WatchlistItem = {
  id: number;
  symbol: string;
  company: string;
  currentPrice: number;
  changePercent: number;
};

export type AiInsight = {
  id: number;
  title: string;
  description: string;
  sentiment: "bullish" | "bearish" | "neutral";
};

export type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};
