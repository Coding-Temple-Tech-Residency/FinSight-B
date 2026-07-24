export type Holding = {
  id: number;
  portfolio_id: number;
  stock_id: number;

  symbol: string;
  company_name: string;

  native_currency: string;

  shares: number | string;

  average_buy_price: number | string;
  purchase_currency: string;

  exchange_rate_at_purchase: number | string;
  average_buy_price_native: number | string;

  latest_price: number | string | null;

  purchased_at: string | null;
  created_at: string;
};

export type CreateHoldingPayload = {
  symbol: string;
  shares: number;
  average_buy_price: number;
  purchase_currency: string;
  purchased_at?: string | null;
};

export type UpdateHoldingPayload = {
  shares?: number;
  average_buy_price?: number;
  purchase_currency?: string;
  purchased_at?: string | null;
};

export type DeleteHoldingResponse = {
  message: string;
};
