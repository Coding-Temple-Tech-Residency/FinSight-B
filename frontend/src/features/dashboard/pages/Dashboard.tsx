import { useState, type ChangeEvent } from "react";

import { useMarketHistory } from "../../market/hooks/useMarketHistory";
import { useStockQuote } from "../../market/hooks/useStockQuote";

import { usePortfolios } from "../../portfolio/hooks/usePortfolio";

import AIInsightCard from "../components/AIInsightCard";
import DashboardHeader from "../components/DashboardHeader";
import DashboardMetrics from "../components/DashboardMetrics";
import DashboardModeToggle, {
  type DashboardMode,
} from "../components/DashboardModeToggle";
import HoldingsAllocation from "../components/HoldingsAllocation";
import PortfolioChart from "../components/PortfolioChart";
import TopMoversCard from "../components/TopMoversCard";
import TrendingMarketView from "../components/TrendingMarketView";
import WatchlistPreview from "../components/WatchlistPreview";

import { useDashboard } from "../hooks/useDashboard";
import { usePortfolioPerformance } from "../hooks/usePortfolioPerformance";

import "../styles/dashboard.css";

const Dashboard = () => {
  const { symbol } = useDashboard();

  const [dashboardMode, setDashboardMode] =
    useState<DashboardMode>("portfolio");

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<
    number | undefined
  >();

  const {
    data: quote,
    isLoading: quoteLoading,
    isError: quoteError,
  } = useStockQuote(symbol);

  const {
    data: history = [],
    isLoading: historyLoading,
    isError: historyError,
  } = useMarketHistory(symbol);

  const {
    data: portfolios = [],
    isLoading: portfolioLoading,
    isError: portfolioError,
  } = usePortfolios();

  const {
    displaySummary,
    isLoading: performanceLoading,
    isFetching: performanceFetching,
    isError: performanceError,
  } = usePortfolioPerformance(portfolios);

  const selectedPortfolioExists = portfolios.some(
    (portfolio) => portfolio.id === selectedPortfolioId,
  );

  const activePortfolioId = selectedPortfolioExists
    ? selectedPortfolioId
    : portfolios[0]?.id;

  const selectedPortfolio = portfolios.find(
    (portfolio) => portfolio.id === activePortfolioId,
  );

  const dashboardPerformanceLoading = portfolioLoading || performanceLoading;

  const dashboardPerformanceError = portfolioError || performanceError;

  const handlePortfolioChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const portfolioId = Number(event.target.value);

    if (!Number.isInteger(portfolioId) || portfolioId <= 0) {
      return;
    }

    setSelectedPortfolioId(portfolioId);
  };

  return (
    <section className="dashboard">
      <DashboardHeader />

      <DashboardModeToggle mode={dashboardMode} onChange={setDashboardMode} />

      {dashboardMode === "portfolio" ? (
        <>
          <section
            className="dashboard-metrics-grid"
            aria-label="Dashboard metrics"
          >
            <DashboardMetrics
              symbol={symbol}
              quote={quote}
              quoteLoading={quoteLoading}
              quoteError={quoteError}
              portfolios={portfolios}
              portfolioLoading={portfolioLoading}
              portfolioError={portfolioError}
              performance={displaySummary}
              performanceLoading={dashboardPerformanceLoading}
              performanceError={dashboardPerformanceError}
            />
          </section>

          {performanceFetching && !dashboardPerformanceLoading && (
            <p className="dashboard-refresh-status" role="status">
              Updating portfolio data...
            </p>
          )}

          <section className="dashboard-portfolio-toolbar">
            <div>
              <p className="dashboard-section-eyebrow">Portfolio overview</p>

              <h2>{selectedPortfolio?.name ?? "Portfolio"}</h2>
            </div>

            {portfolios.length > 0 && (
              <div className="dashboard-portfolio-selector">
                <label htmlFor="dashboard-portfolio-select">
                  Selected portfolio
                </label>

                <select
                  id="dashboard-portfolio-select"
                  value={activePortfolioId ?? ""}
                  onChange={handlePortfolioChange}
                  disabled={portfolioLoading}
                >
                  {portfolios.map((portfolio) => (
                    <option key={portfolio.id} value={portfolio.id}>
                      {portfolio.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>

          <section
            className="dashboard-primary-grid"
            aria-label="Market performance and portfolio insight"
          >
            <PortfolioChart
              symbol={symbol}
              history={history}
              isLoading={historyLoading}
              isError={historyError}
            />

            <AIInsightCard
              portfolioId={activePortfolioId}
              portfolioLoading={portfolioLoading}
            />
          </section>

          <section
            className="dashboard-secondary-grid"
            aria-label="Portfolio allocation, movers, and watchlist"
          >
            <HoldingsAllocation
              portfolioId={activePortfolioId}
              portfolioLoading={portfolioLoading}
              portfolioError={portfolioError}
            />

            <TopMoversCard
              portfolioId={activePortfolioId}
              portfolioName={selectedPortfolio?.name}
              portfolioLoading={portfolioLoading}
              portfolioError={portfolioError}
            />

            <WatchlistPreview />
          </section>
        </>
      ) : (
        <TrendingMarketView />
      )}
    </section>
  );
};

export default Dashboard;
