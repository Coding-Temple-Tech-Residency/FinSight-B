import { Link } from "react-router-dom";

import { useWatchlist } from "../../watchlist/hooks/useWatchlist";

const formatCurrency = (value: number | string | null | undefined) => {
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

const WatchlistPreview = () => {
  const { data: watchlist = [], isLoading, isError } = useWatchlist();

  return (
    <article className="list-card">
      <div className="card-header">
        <h2>Watchlist</h2>

        <Link to="/dashboard/watchlist">View all</Link>
      </div>

      {isLoading && <p>Loading watchlist...</p>}

      {isError && <p className="negative">Watchlist unavailable.</p>}

      {!isLoading && !isError && watchlist.length === 0 && (
        <p>No watchlist items yet.</p>
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
