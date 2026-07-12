export type Holding = {
  id: number;
  portfolio_id: number;
  stock_id?: number;
  symbol: string;
  quantity: number | string;
  average_price: number | string;
  current_price?: number | string;
  created_at?: string;
  updated_at?: string;
};

export type CreateHoldingPayload = {
  symbol: string;
  quantity: number;
  average_price: number;
};

export type UpdateHoldingPayload = {
  quantity?: number;
  average_price?: number;
};
