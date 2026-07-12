export type MarketHistory = {
  id: number;
  stock_id: number;
  timeframe: string;

  open_price: number | string;
  high_price: number | string;
  low_price: number | string;
  close_price: number | string;

  volume: number;
  price_timestamp: string;
  created_at: string;
};
