export type InsightSentiment = "bullish" | "bearish" | "neutral";

export type InsightType =
  | "market"
  | "stock"
  | "portfolio"
  | "watchlist"
  | "news"
  | "earnings";

export type AIInsight = {
  id: number;
  user_id: number;

  portfolio_id: number | null;
  stock_id: number | null;

  insight_type: InsightType;
  summary: string;
  sentiment: InsightSentiment | null;
  source: string | null;
  expires_at: string | null;

  created_at: string;
  updated_at: string;
};

export type AIChatPayload = {
  message: string;
};

export type UpdateAIInsightPayload = {
  portfolio_id?: number | null;
  stock_id?: number | null;
  insight_type?: InsightType;
  summary?: string;
  sentiment?: InsightSentiment | null;
  source?: string | null;
  expires_at?: string | null;
};

export type UpdateAIInsightVariables = {
  insightId: number;
  payload: UpdateAIInsightPayload;
};

export type GeneratePortfolioInsightVariables = {
  portfolioId: number;
};

export type GenerateStockInsightVariables = {
  symbol: string;
};
