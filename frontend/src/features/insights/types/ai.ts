export type InsightSentiment = "bullish" | "bearish" | "neutral";

export type RiskLevel = "low" | "moderate" | "high";

export type AIInsight = {
  id: number;
  symbol: string;
  summary: string;
  sentiment: InsightSentiment;
  risk_level: RiskLevel | null;
  key_points: string[];
  created_at: string;
};

export type GenerateInsightPayload = {
  symbol: string;
  analysis_type?: "market" | "portfolio";
};
