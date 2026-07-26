import { Link } from "react-router-dom";

import { useHoldings } from "../../portfolio/hooks/useHoldings";
import { calculatePortfolioPerformance } from "../../portfolio/utils/portfolioCalculations";

type TopMoversCardProps = {
  portfolioId?: number;
  portfolioName?: string;
  portfolioLoading?: boolean;
  portfolioError?: boolean;
};

const formatPercent = (value: number): string => {
  const prefix = value > 0 ? "+" : "";

  return `${prefix}${value.toFixed(2)}%`;
};

const TopMoversCard = ({
  portfolioId,
  portfolioName,
  portfolioLoading = false,
  portfolioError = false,
}: TopMoversCardProps) => {
  const {
    data: holdings = [],
    isLoading: holdingsLoading,
    isError: holdingsError,
    error: holdingsErrorData,
  } = useHoldings(portfolioId);

  const isLoading = portfolioLoading || holdingsLoading;
  const isError = portfolioError || holdingsError;

  const performance = calculatePortfolioPerformance([], holdings);
  console.log("holdings", holdings);
  console.log("performance", performance);
  console.log("holdingPerformance", performance.holdingPerformance);

  const sortedPerformance = [...performance.holdingPerformance].sort(
    (firstHolding, secondHolding) =>
      secondHolding.gainLossPercent - firstHolding.gainLossPercent,
  );

  const gainers = sortedPerformance
    .filter((holding) => holding.gainLossPercent > 0)
    .slice(0, 3);

  const losers = [...sortedPerformance]
    .reverse()
    .filter((holding) => holding.gainLossPercent < 0)
    .slice(0, 3);

  const hasMovers = gainers.length > 0 || losers.length > 0;

  return (
    <article className="top-movers-card">
      <div className="card-header">
        <div>
          <h2>Top Movers</h2>

          {portfolioName && <p className="metric-label">{portfolioName}</p>}
        </div>

        {portfolioId && (
          <Link to={`/dashboard/portfolio?portfolio=${portfolioId}`}>
            View portfolio
          </Link>
        )}
      </div>

      {isLoading && (
        <div className="dashboard-unavailable-state" role="status">
          <p>Loading portfolio movers...</p>
        </div>
      )}

      {!isLoading && isError && (
        <div className="dashboard-unavailable-state">
          <h3>Unable to load movers</h3>

          <p>
            {holdingsErrorData instanceof Error
              ? holdingsErrorData.message
              : "Portfolio holdings are currently unavailable."}
          </p>
        </div>
      )}

      {!isLoading && !isError && !portfolioId && (
        <div className="dashboard-unavailable-state">
          <h3>No portfolio available</h3>

          <p>Create a portfolio to track its top movers.</p>
        </div>
      )}

      {!isLoading &&
        !isError &&
        Boolean(portfolioId) &&
        holdings.length === 0 && (
          <div className="dashboard-unavailable-state">
            <h3>No holdings yet</h3>

            <p>
              Add holdings to this portfolio to see its strongest and weakest
              performers.
            </p>
          </div>
        )}

      {!isLoading &&
        !isError &&
        holdings.length > 0 &&
        performance.pricedHoldings === 0 && (
          <div className="dashboard-unavailable-state">
            <h3>Performance unavailable</h3>

            <p>
              Current prices are required before portfolio movers can be
              calculated.
            </p>
          </div>
        )}

      {!isLoading &&
        !isError &&
        performance.pricedHoldings > 0 &&
        !hasMovers && (
          <div className="dashboard-unavailable-state">
            <h3>No movement yet</h3>

            <p>
              The priced holdings currently have no gain or loss relative to
              their cost basis.
            </p>
          </div>
        )}

      {!isLoading && !isError && hasMovers && (
        <div className="top-movers-content">
          <section className="top-movers-group">
            <div className="top-movers-group-header">
              <h3>Top Gainers</h3>

              <span className="top-movers-count">{gainers.length}</span>
            </div>

            {gainers.length > 0 ? (
              <div className="top-movers-list">
                {gainers.map((item) => {
                  const companyName =
                    item.holding.company_name?.trim() || item.holding.symbol;

                  return (
                    <div key={item.holding.id} className="top-mover-row">
                      <div className="top-mover-asset">
                        <strong>{companyName}</strong>

                        <span>{item.holding.symbol}</span>
                      </div>

                      <div className="top-mover-result">
                        <strong className="portfolio-positive">
                          {formatPercent(item.gainLossPercent)}
                        </strong>

                        <span className="metric-label">
                          {item.shares.toLocaleString("en-US")} shares
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="top-movers-empty">
                No holdings are currently above cost basis.
              </p>
            )}
          </section>

          <section className="top-movers-group">
            <div className="top-movers-group-header">
              <h3>Top Losers</h3>

              <span className="top-movers-count">{losers.length}</span>
            </div>

            {losers.length > 0 ? (
              <div className="top-movers-list">
                {losers.map((item) => {
                  const companyName =
                    item.holding.company_name?.trim() || item.holding.symbol;

                  return (
                    <div key={item.holding.id} className="top-mover-row">
                      <div className="top-mover-asset">
                        <strong>{companyName}</strong>

                        <span>{item.holding.symbol}</span>
                      </div>

                      <div className="top-mover-result">
                        <strong className="portfolio-negative">
                          {formatPercent(item.gainLossPercent)}
                        </strong>

                        <span className="metric-label">
                          {item.shares.toLocaleString("en-US")} shares
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="top-movers-empty">
                No holdings are currently below cost basis.
              </p>
            )}
          </section>
        </div>
      )}
    </article>
  );
};

export default TopMoversCard;
