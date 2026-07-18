export type Holding = {
  id: number;
  portfolio_id: number;
  stock_id: number;
  symbol: string;
  company_name: string;

  shares: number | string;
  average_buy_price: number | string;
  latest_price: number | string | null;

  purchased_at: string | null;

  created_at: string;
};

export type CreateHoldingPayload = {
  symbol: string;
  shares: number;
  average_buy_price: number;
  purchased_at?: string | null;
};

export type UpdateHoldingPayload = {
  shares?: number;
  average_buy_price?: number;
  purchased_at?: string | null;
};

export type DeleteHoldingResponse = {
  message: string;
};
