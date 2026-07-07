import { usePortfolio } from "../../portfolio/hooks/usePortfolio";
import { useMarketHistory } from "../../market/hooks/useMarketHistory";
import { useStockQuote } from "../../market/hooks/useStockQuote";

import DashboardHeader from "../components/DashboardHeader";
import DashboardMetrics from "../components/DashboardMetrics";
import PortfolioChart from "../components/PortfolioChart";
import AIInsightCard from "../components/AIInsightCard";
import HoldingsAllocation from "../components/HoldingsAllocation";
import TopMovers from "../components/TopMovers";
import WatchlistPreview from "../components/WatchlistPreview";

import { useDashboard } from "../hooks/useDashboard";

const Dashboard = () => {
  const { symbol } = useDashboard();

  const {
    data: quote,
    isLoading: quoteLoading,
    isError: quoteError,
  } = useStockQuote(symbol);

  const {
    data: history,
    isLoading: historyLoading,
    isError: historyError,
  } = useMarketHistory(symbol);

  const {
    data: portfolios,
    isLoading: portfolioLoading,
    isError: portfolioError,
  } = usePortfolio();

  return (
    <section className="dashboard">
      <DashboardHeader />

      <DashboardMetrics
        symbol={symbol}
        quote={quote}
        quoteLoading={quoteLoading}
        quoteError={quoteError}
        portfolios={portfolios}
        portfolioLoading={portfolioLoading}
        portfolioError={portfolioError}
      />

      <PortfolioChart
        symbol={symbol}
        history={history}
        isLoading={historyLoading}
        isError={historyError}
      />

      <AIInsightCard />
      <HoldingsAllocation />
      <TopMovers />
      <WatchlistPreview />
    </section>
  );
};

export default Dashboard;
