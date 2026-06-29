// src/data/dashboardData.ts

import type {
  KeyMetric,
  Holding,
  WatchlistItem,
  AiInsight,
  ChatMessage,
} from "../types/dashboard";

export const keyMetrics: KeyMetric[] = [
  {
    id: 1,
    label: "Total Portfolio Value",
    value: 125430.5,
    change: 2584.92,
    changePercent: 2.1,
    trend: "up",
    prefix: "$",
  },
  {
    id: 2,
    label: "Day's Change",
    value: 1250.75,
    changePercent: 1.03,
    trend: "up",
    prefix: "$",
  },
  {
    id: 3,
    label: "Total Gain/Loss",
    value: 15430.5,
    changePercent: 14.02,
    trend: "up",
    prefix: "$",
  },
  {
    id: 4,
    label: "Cash Balance",
    value: 4250,
    trend: "neutral",
    prefix: "$",
  },
];

export const holdings: Holding[] = [
  {
    id: 1,
    symbol: "AAPL",
    company: "Apple Inc.",
    shares: 10,
    avgBuyPrice: 175.5,
    currentPrice: 198.34,
    marketValue: 1983.4,
    gainLoss: 228.4,
    gainLossPercent: 13.02,
  },
  // {
  //   id: 2,
  //   symbol: "NVDA",
  //   company: "NVIDIA Corp.",
  //   shares: 5,
  //   avgBuyPrice: 875,
  //   currentPrice: 1042.5,
  //   marketValue: 5212.5,
  //   gainLoss: 837.5,
  //   gainLossPercent: 19.14,
  // },
  // {
  //   id: 3,
  //   symbol: "MSFT",
  //   company: "Microsoft",
  //   shares: 8,
  //   avgBuyPrice: 310,
  //   currentPrice: 420.8,
  //   marketValue: 3366.4,
  //   gainLoss: 886.4,
  //   gainLossPercent: 35.74,
  // },
  // {
  //   id: 4,
  //   symbol: "TSLA",
  //   company: "Tesla",
  //   shares: 6,
  //   avgBuyPrice: 230,
  //   currentPrice: 205.15,
  //   marketValue: 1230.9,
  //   gainLoss: -149.1,
  //   gainLossPercent: -10.8,
  // },
];

export const watchlist: WatchlistItem[] = [
  {
    id: 1,
    symbol: "GOOGL",
    company: "Alphabet",
    currentPrice: 184.62,
    changePercent: 2.15,
  },
  // {
  //   id: 2,
  //   symbol: "META",
  //   company: "Meta",
  //   currentPrice: 542.33,
  //   changePercent: 4.37,
  // },
  // {
  //   id: 3,
  //   symbol: "NFLX",
  //   company: "Netflix",
  //   currentPrice: 695.2,
  //   changePercent: -1.83,
  // },
  // {
  //   id: 4,
  //   symbol: "AMD",
  //   company: "AMD",
  //   currentPrice: 172.45,
  //   changePercent: 3.19,
  // },
];

export const aiInsights: AiInsight[] = [
  {
    id: 1,
    title: "NVDA Momentum",
    description:
      "NVIDIA continues showing strength from AI infrastructure demand.",
    sentiment: "bullish",
  },
  // {
  //   id: 2,
  //   title: "Apple Watch",
  //   description:
  //     "Apple may see short-term volatility around upcoming product updates.",
  //   sentiment: "neutral",
  // },
  // {
  //   id: 3,
  //   title: "Tesla Pressure",
  //   description: "Tesla is under pressure after weaker delivery expectations.",
  //   sentiment: "bearish",
  // },
];

export const askFinSightMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello Alex, I’m FinSight AI. Ask me anything about your portfolio, stocks, or market trends.",
    timestamp: "09:00 AM",
  },
  // {
  //   id: 2,
  //   role: "user",
  //   content: "What is my strongest holding right now?",
  //   timestamp: "09:01 AM",
  // },
  // {
  //   id: 3,
  //   role: "assistant",
  //   content:
  //     "Based on your current holdings, Microsoft has the highest percentage gain at 35.74%.",
  //   timestamp: "09:01 AM",
  // },
];

export const dashboardData = {
  keyMetrics,
  holdings,
  watchlist,
  aiInsights,
  askFinSightMessages,
};
