import type { MarketHistory } from "../types/market";

export function formatChartData(history: MarketHistory[]) {
  return history
    .map((item) => {
      const timestamp = new Date(item.price_timestamp);
      const close = Number(item.close_price);

      return {
        timestamp: timestamp.getTime(),
        date: timestamp.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        close,
      };
    })
    .filter(
      (item) => Number.isFinite(item.timestamp) && Number.isFinite(item.close),
    )
    .sort((first, second) => first.timestamp - second.timestamp);
}
