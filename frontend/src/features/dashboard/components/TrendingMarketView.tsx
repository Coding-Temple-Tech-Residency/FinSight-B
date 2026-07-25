import { useState } from "react";

import { useTrendingStocks } from "../../market/hooks/useTrendingStocks";

import TrendingCompanyCard from "./TrendingCompanyCard";

const INITIAL_VISIBLE_COUNT = 20;
const SHOW_MORE_INCREMENT = 10;

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load trending market data.";
};

const TrendingMarketView = () => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useTrendingStocks();

  const trendingStocks = data
    ? [...data.topGainers, ...data.topLosers, ...data.mostActive]
    : [];

  const visibleStocks = trendingStocks.slice(0, visibleCount);

  const numberOneTrending =
    data?.topGainers[0] ?? data?.mostActive[0] ?? data?.topLosers[0];

  const hasMore = visibleCount < trendingStocks.length;

  const handleShowMore = () => {
    setVisibleCount((currentCount) =>
      Math.min(currentCount + SHOW_MORE_INCREMENT, trendingStocks.length),
    );
  };

  return (
    <section
      className="trending-market-view"
      aria-labelledby="trending-market-title"
    >
      <header className="trending-market-header">
        <div>
          <p className="dashboard-section-eyebrow">Market activity</p>

          <h2 id="trending-market-title">Trending companies</h2>

          <p>
            Explore the stocks currently receiving the most market attention.
          </p>

          {data?.lastUpdated && (
            <p className="trending-last-updated">
              Last updated: {new Date(data.lastUpdated).toLocaleString("en-US")}
            </p>
          )}
        </div>

        {isFetching && !isLoading && (
          <span className="trending-refresh-status" role="status">
            Updating...
          </span>
        )}
      </header>

      {isLoading ? (
        <div className="trending-market-state" role="status" aria-live="polite">
          <h3>Loading trending companies</h3>

          <p>Fetching current market activity...</p>
        </div>
      ) : isError ? (
        <div className="trending-market-state" role="alert">
          <h3>Trending data unavailable</h3>

          <p>{getErrorMessage(error)}</p>

          <button type="button" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : trendingStocks.length === 0 ? (
        <div className="trending-market-state">
          <h3>No trending companies found</h3>

          <p>There is no trending market data available right now.</p>
        </div>
      ) : (
        <>
          {numberOneTrending && (
            <section
              className="trending-featured-section"
              aria-labelledby="top-trending-company"
            >
              <div className="trending-section-heading">
                <div>
                  <p className="dashboard-section-eyebrow">Market leader</p>

                  <h3 id="top-trending-company">Number-one trending company</h3>
                </div>
              </div>

              <TrendingCompanyCard stock={numberOneTrending} featured />
            </section>
          )}

          <section
            className="trending-list-section"
            aria-labelledby="trending-list-title"
          >
            <div className="trending-section-heading">
              <div>
                <p className="dashboard-section-eyebrow">Trending list</p>

                <h3 id="trending-list-title">Top trending stocks</h3>
              </div>

              <span>
                Showing {visibleStocks.length} of {trendingStocks.length}
              </span>
            </div>

            <div className="trending-company-grid">
              {visibleStocks.map((stock) => (
                <TrendingCompanyCard
                  key={`${stock.category}-${stock.rank}-${stock.symbol}`}
                  stock={stock}
                />
              ))}
            </div>

            {hasMore && (
              <div className="trending-show-more-container">
                <button
                  type="button"
                  className="trending-show-more-button"
                  onClick={handleShowMore}
                >
                  Show more
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
};

export default TrendingMarketView;
