import { Link } from "react-router-dom";

import { useWatchlist } from "../../watchlist/hooks/useWatchlist";

const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === "") {
    return "Unavailable";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const WatchlistPreview = () => {
  const {
    data: watchlist = [],
    isLoading,
    isFetching,
    isError,
  } = useWatchlist();

  return (
    <article className="list-card">
      <div className="card-header">
        <div>
          <h2>Watchlist</h2>

          {isFetching && !isLoading && (
            <p className="metric-label">Updating...</p>
          )}
        </div>

        <Link to="/dashboard/watchlist">View all</Link>
      </div>

      {isLoading && <p role="status">Loading watchlist...</p>}

      {!isLoading && isError && (
        <p className="negative" role="alert">
          Watchlist unavailable.
        </p>
      )}

      {!isLoading && !isError && watchlist.length === 0 && (
        <div>
          <p>No watchlist items yet.</p>

          <Link
            to="/dashboard/watchlist"
            className="mt-3 inline-block font-semibold text-(--accent-primary)"
          >
            Add a stock
          </Link>
        </div>
      )}

      {!isLoading &&
        !isError &&
        watchlist.slice(0, 4).map((item) => (
          <div key={item.id} className="stock-row">
            <div>
              <strong>{item.symbol}</strong>

              <p className="metric-label">{item.company_name}</p>
            </div>

            <span>{formatCurrency(item.latest_price)}</span>
          </div>
        ))}
    </article>
  );
};

export default WatchlistPreview;
