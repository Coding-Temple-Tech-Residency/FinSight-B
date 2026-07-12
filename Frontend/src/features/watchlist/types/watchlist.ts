export type WatchlistItem = {
  id: number;
  user_id: number;
  stock_id: number;
  symbol: string;
  company_name: string;
  alert_price: number | string | null;
  latest_price: number | string | null;
  created_at: string;
  updated_at: string;
};

export type AddWatchlistPayload = {
  symbol: string;
  alert_price?: number | null;
};

export type UpdateWatchlistPayload = {
  alert_price?: number | null;
};

export type WatchlistDeleteResponse = {
  message: string;
};
