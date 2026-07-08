import type { Portfolio } from "../../../api/portfolioApi";
import type { StockQuote } from "../../market/types/stock";
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
  portfolios,
  portfolioLoading,
  portfolioError,
}: DashboardMetricsProps) => {
  const primaryPortfolio = portfolios?.[0];

  return (
    <>
      <MetricCard
        label="Portfolio Value"
        value={
          portfolioLoading
            ? "Loading..."
            : portfolioError
              ? "Unavailable"
              : `$${Number(primaryPortfolio?.total_value ?? 0).toLocaleString()}`
        }
      />

      <MetricCard
        label="Buying Power"
        value={
          portfolioLoading
            ? "Loading..."
            : portfolioError
              ? "Unavailable"
              : `$${Number(primaryPortfolio?.buying_power ?? 0).toLocaleString()}`
        }
      />

      <MetricCard
        label={`${symbol} Price`}
        value={
          quoteLoading
            ? "Loading..."
            : quoteError
              ? "Unavailable"
              : `$${Number(quote?.latest_price ?? 0).toFixed(2)}`
        }
      />

      <MetricCard
        label="Cash Balance"
        value={
          portfolioLoading
            ? "Loading..."
            : portfolioError
              ? "Unavailable"
              : `$${Number(primaryPortfolio?.cash_balance ?? 0).toLocaleString()}`
        }
      />
    </>
  );
};

export default DashboardMetrics;
