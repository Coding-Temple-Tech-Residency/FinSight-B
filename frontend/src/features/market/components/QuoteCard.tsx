import type { StockQuote } from "../types/stock";

type QuoteCardProps = {
  quote?: StockQuote;
  loading: boolean;
  isError?: boolean;
};

const formatPrice = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) {
    return "Unavailable";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Unavailable";
  }

  return numericValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "Unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return date.toLocaleString();
};

const QuoteCard = ({ quote, loading, isError = false }: QuoteCardProps) => {
  if (loading) {
    return (
      <article className="metric-card">
        <p>Loading quote...</p>
      </article>
    );
  }

  if (isError || !quote) {
    return (
      <article className="metric-card">
        <p className="metric-label">Stock Quote</p>
        <h2 className="metric-value">Unavailable</h2>
      </article>
    );
  }

  return (
    <article className="metric-card">
      <p className="metric-label">
        {quote.symbol}
        {quote.company_name ? ` · ${quote.company_name}` : ""}
      </p>

      <h2 className="metric-value">{formatPrice(quote.latest_price)}</h2>

      <p className="metric-change">Last updated</p>

      <small>{formatDate(quote.last_refreshed_at)}</small>
    </article>
  );
};

export default QuoteCard;
