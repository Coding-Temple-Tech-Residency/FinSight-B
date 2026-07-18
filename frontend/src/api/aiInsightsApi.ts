import { apiClient } from "./apiClient";

import type {
  AIInsight,
  CreateAIInsightPayload,
  UpdateAIInsightVariables,
} from "../features/insights/types/ai";

import type {
  AIChatPayload,
  AIChatResponse,
} from "../features/chat/types/chat";

const AI_INSIGHTS_URL = "/api/ai-insights";

export const getAIInsights = () => {
  return apiClient<AIInsight[]>(AI_INSIGHTS_URL);
};

export const getAIInsight = (insightId: number) => {
  return apiClient<AIInsight>(`${AI_INSIGHTS_URL}/${insightId}`);
};

export const createAIInsight = (payload: CreateAIInsightPayload) => {
  return apiClient<AIInsight>(AI_INSIGHTS_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateAIInsight = ({
  insightId,
  payload,
}: UpdateAIInsightVariables) => {
  return apiClient<AIInsight>(`${AI_INSIGHTS_URL}/${insightId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteAIInsight = (insightId: number) => {
  return apiClient<void>(`${AI_INSIGHTS_URL}/${insightId}`, {
    method: "DELETE",
  });
};

export const sendAIChatMessage = (payload: AIChatPayload) => {
  return apiClient<AIChatResponse>("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      message: payload.message.trim(),
      symbol: payload.symbol ? payload.symbol.trim().toUpperCase() : undefined,
    }),
  });
};
