export type MarketHistory = {
  id: number;
  stock_id: number;
  timeframe: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number;
  price_timestamp: string;
};
