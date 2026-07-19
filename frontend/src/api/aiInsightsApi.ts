import { apiClient } from "./apiClient";

import type {
  AIChatPayload,
  AIInsight,
  UpdateAIInsightVariables,
} from "../features/insights/types/ai";

const AI_INSIGHTS_URL = "/api/ai-insights";

export const getAIInsights = (): Promise<AIInsight[]> => {
  return apiClient<AIInsight[]>(AI_INSIGHTS_URL);
};

export const getAIInsight = (insightId: number): Promise<AIInsight> => {
  return apiClient<AIInsight>(`${AI_INSIGHTS_URL}/${insightId}`);
};

/**
 * Sends a general financial question.
 *
 * The backend stores the generated response as an AI insight.
 * This can eventually be moved to aiChatApi.ts when the chat
 * feature is separated from the insights feature.
 */
export const generateGeneralAIInsight = (
  payload: AIChatPayload,
): Promise<AIInsight> => {
  return apiClient<AIInsight>(AI_INSIGHTS_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const generatePortfolioAIInsight = (
  portfolioId: number,
): Promise<AIInsight> => {
  return apiClient<AIInsight>(
    `${AI_INSIGHTS_URL}/generate/portfolio/${portfolioId}`,
    {
      method: "POST",
    },
  );
};

export const generateStockAIInsight = (symbol: string): Promise<AIInsight> => {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    throw new Error("A stock symbol is required.");
  }

  return apiClient<AIInsight>(
    `${AI_INSIGHTS_URL}/generate/stock/${encodeURIComponent(normalizedSymbol)}`,
    {
      method: "POST",
    },
  );
};

export const updateAIInsight = ({
  insightId,
  payload,
}: UpdateAIInsightVariables): Promise<AIInsight> => {
  return apiClient<AIInsight>(`${AI_INSIGHTS_URL}/${insightId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteAIInsight = (insightId: number): Promise<void> => {
  return apiClient<void>(`${AI_INSIGHTS_URL}/${insightId}`, {
    method: "DELETE",
  });
};
