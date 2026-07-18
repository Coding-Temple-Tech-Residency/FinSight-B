import { apiClient } from "./apiClient";

import type {
  CreateHoldingPayload,
  DeleteHoldingResponse,
  Holding,
  UpdateHoldingPayload,
} from "../features/portfolio/types/holdings";

const normalizeSymbol = (symbol: string) => symbol.trim().toUpperCase();

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
    body: JSON.stringify({
      ...payload,
      symbol: normalizeSymbol(payload.symbol),
      purchased_at: payload.purchased_at || null,
    }),
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
  return apiClient<DeleteHoldingResponse>(
    `/api/portfolios/${portfolioId}/holdings/${holdingId}`,
    {
      method: "DELETE",
    },
  );
};
