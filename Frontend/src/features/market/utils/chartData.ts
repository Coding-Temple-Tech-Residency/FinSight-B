import type { MarketHistory } from "../types/market";

export function formatChartData(history: MarketHistory[]) {
  return history
    .map((item) => ({
      date: new Date(item.price_timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      close: Number(item.close_price),
    }))
    .reverse();
}
