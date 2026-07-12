import { apiClient } from "./apiClient";

import type {
  AIInsight,
  GenerateInsightPayload,
} from "../features/insights/types/ai";

import type {
  AIChatPayload,
  AIChatResponse,
} from "../features/chat/types/chat";

export const getAIInsights = () => {
  return apiClient<AIInsight[]>("/api/ai/insights");
};

export const generateAIInsight = (payload: GenerateInsightPayload) => {
  return apiClient<AIInsight>("/api/ai/insights", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      symbol: payload.symbol.trim().toUpperCase(),
    }),
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
