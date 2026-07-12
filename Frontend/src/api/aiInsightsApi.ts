import { apiClient } from "./apiClient";
import type { AIInsight } from "../features/insights/types/ai";

export const getInsights = () => {
  return apiClient<AIInsight[]>("/api/insights");
};

export const getInsight = (id: number) => {
  return apiClient<AIInsight>(`/api/insights/${id}`);
};
