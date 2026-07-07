import type { StockQuote } from "../types/stock";

type QuoteCardProps = {
  quote?: StockQuote;
  loading: boolean;
};

const QuoteCard = ({ quote, loading }: QuoteCardProps) => {
  if (loading) {
    return (
      <article className="metric-card">
        <p>Loading quote...</p>
      </article>
    );
  }

  return (
    <article className="metric-card">
      <p className="metric-label">{quote?.symbol}</p>

      <h2 className="metric-value">
        ${Number(quote?.latest_price ?? 0).toFixed(2)}
      </h2>

      <p className="metric-change">Last Updated</p>

      <small>
        {quote?.last_refreshed_at
          ? new Date(quote.last_refreshed_at).toLocaleString()
          : "--"}
      </small>
    </article>
  );
};

export default QuoteCard;
