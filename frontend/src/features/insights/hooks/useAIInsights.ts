import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAIInsight,
  deleteAIInsight,
  getAIInsight,
  getAIInsights,
  updateAIInsight,
} from "../../../api/aiInsightsApi";

import type {
  AIInsight,
  CreateAIInsightPayload,
  UpdateAIInsightVariables,
} from "../types/ai";

export const aiInsightKeys = {
  all: ["ai-insights"] as const,

  detail: (insightId: number) =>
    [...aiInsightKeys.all, "detail", insightId] as const,
};

export const useAIInsights = () => {
  return useQuery({
    queryKey: aiInsightKeys.all,
    queryFn: getAIInsights,
    staleTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useAIInsight = (insightId: number) => {
  return useQuery({
    queryKey: aiInsightKeys.detail(insightId),
    queryFn: () => getAIInsight(insightId),
    enabled: insightId > 0,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
};

export const useCreateAIInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAIInsightPayload) => createAIInsight(payload),

    onSuccess: (newInsight) => {
      queryClient.setQueryData<AIInsight[]>(
        aiInsightKeys.all,
        (current = []) => [
          newInsight,
          ...current.filter((insight) => insight.id !== newInsight.id),
        ],
      );

      queryClient.setQueryData(aiInsightKeys.detail(newInsight.id), newInsight);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: aiInsightKeys.all,
      });
    },
  });
};

export const useUpdateAIInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UpdateAIInsightVariables) =>
      updateAIInsight(variables),

    onSuccess: (updatedInsight) => {
      queryClient.setQueryData<AIInsight[]>(aiInsightKeys.all, (current = []) =>
        current.map((insight) =>
          insight.id === updatedInsight.id ? updatedInsight : insight,
        ),
      );

      queryClient.setQueryData(
        aiInsightKeys.detail(updatedInsight.id),
        updatedInsight,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: aiInsightKeys.all,
      });
    },
  });
};

export const useDeleteAIInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (insightId: number) => deleteAIInsight(insightId),

    onSuccess: (_, insightId) => {
      queryClient.setQueryData<AIInsight[]>(aiInsightKeys.all, (current = []) =>
        current.filter((insight) => insight.id !== insightId),
      );

      queryClient.removeQueries({
        queryKey: aiInsightKeys.detail(insightId),
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: aiInsightKeys.all,
      });
    },
  });
};
