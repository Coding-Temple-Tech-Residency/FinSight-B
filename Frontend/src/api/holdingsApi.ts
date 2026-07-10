import { apiClient } from "./apiClient";
import type {
  CreateHoldingPayload,
  Holding,
  UpdateHoldingPayload,
} from "../features/portfolio/types/holdings";

export const getHoldings = (portfolioId: number) => {
  return apiClient<Holding[]>(`/api/portfolios/${portfolioId}/holdings`);
};

export const getHoldingById = (portfolioId: number, holdingId: number) => {
  return apiClient<Holding>(
    `/api/portfolios/${portfolioId}/holdings/${holdingId}`,
  );
};

export const createHolding = (
  portfolioId: number,
  payload: CreateHoldingPayload,
) => {
  return apiClient<Holding>(`/api/portfolios/${portfolioId}/holdings`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateHolding = (
  portfolioId: number,
  holdingId: number,
  payload: UpdateHoldingPayload,
) => {
  return apiClient<Holding>(
    `/api/portfolios/${portfolioId}/holdings/${holdingId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
};

export const deleteHolding = (portfolioId: number, holdingId: number) => {
  return apiClient<void>(
    `/api/portfolios/${portfolioId}/holdings/${holdingId}`,
    {
      method: "DELETE",
    },
  );
};
