export type WatchlistItem = {
  id: number;
  symbol: string;
  created_at?: string;
  stock?: {
    id: number;
    symbol: string;
    company_name: string;
    latest_price: number | string;
  };
};

export type AddWatchlistPayload = {
  symbol: string;
};
