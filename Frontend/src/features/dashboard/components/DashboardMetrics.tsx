import type { StockQuote } from "../../market/types/stock";
import type { Portfolio } from "../../portfolio/types/portfolio";

import MetricCard from "./MetricCard";

type DashboardMetricsProps = {
  symbol: string;
  quote?: StockQuote;
  quoteLoading: boolean;
  quoteError: boolean;
  portfolios?: Portfolio[];
  portfolioLoading: boolean;
  portfolioError: boolean;
};


const DashboardMetrics = ({
  symbol,
  quote,
  quoteLoading,
  quoteError,
  portfolios = [],
  portfolioLoading,
  portfolioError,
}: DashboardMetricsProps) => {
  const primaryPortfolio = portfolios[0];

  const portfolioCountValue = portfolioLoading
    ? "Loading..."
    : portfolioError
      ? "Unavailable"
      : String(portfolios.length);

  const primaryPortfolioValue = portfolioLoading
    ? "Loading..."
    : portfolioError
      ? "Unavailable"
      : (primaryPortfolio?.name ?? "None");

  const currencyValue = portfolioLoading
    ? "Loading..."
    : portfolioError
      ? "Unavailable"
      : (primaryPortfolio?.currency ?? "N/A");

  const quoteValue = quoteLoading
    ? "Loading..."
    : quoteError
      ? "Unavailable"
      : quote?.latest_price !== undefined
        ? `$${Number(quote.latest_price).toFixed(2)}`
        : "Unavailable";

  return (
    <>
      <MetricCard label="Portfolios" value={portfolioCountValue} />

      <MetricCard label="Primary Portfolio" value={primaryPortfolioValue} />

      <MetricCard label={`${symbol} Price`} value={quoteValue} />

      <MetricCard label="Portfolio Currency" value={currencyValue} />
    </>
  );
};

export default DashboardMetrics;
