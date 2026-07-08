import StockLineChart from "../../market/components/StockLineChart";
import type { MarketHistory } from "../../market/types/market";

type PortfolioChartProps = {
  symbol: string;
  history?: MarketHistory[];
  isLoading: boolean;
  isError: boolean;
};

const PortfolioChart = ({
  symbol,
  history,
  isLoading,
  isError,
}: PortfolioChartProps) => {
  return (
    <article className="chart-card">
      <div className="card-header">
        <h2>{symbol} Performance</h2>
        <span>Daily</span>
      </div>

      {isLoading && <p>Loading chart...</p>}

      {isError && <p>Chart data unavailable.</p>}

      {!isLoading && !isError && history && <StockLineChart data={history} />}
    </article>
  );
};

export default PortfolioChart;
