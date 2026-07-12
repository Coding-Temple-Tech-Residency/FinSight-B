import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHolding,
  deleteHolding,
  getHoldings,
  updateHolding,
} from "../../../api/holdingsApi";
import type {
  CreateHoldingPayload,
  UpdateHoldingPayload,
} from "../types/holdings";

export const useHoldings = (portfolioId?: number) => {
  return useQuery({
    queryKey: ["holdings", portfolioId],
    queryFn: () => getHoldings(portfolioId!),
    enabled: typeof portfolioId === "number",
    retry: false,
  });
};

export const useCreateHolding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      portfolioId,
      payload,
    }: {
      portfolioId: number;
      payload: CreateHoldingPayload;
    }) => createHolding(portfolioId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["holdings", variables.portfolioId],
      });
    },
  });
};

export const useUpdateHolding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      portfolioId,
      holdingId,
      payload,
    }: {
      portfolioId: number;
      holdingId: number;
      payload: UpdateHoldingPayload;
    }) => updateHolding(portfolioId, holdingId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["holdings", variables.portfolioId],
      });
    },
  });
};

export const useDeleteHolding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      portfolioId,
      holdingId,
    }: {
      portfolioId: number;
      holdingId: number;
    }) => deleteHolding(portfolioId, holdingId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["holdings", variables.portfolioId],
      });
    },
  });
};
