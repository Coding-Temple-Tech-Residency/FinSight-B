const watchlist = [
  "AAPL $196.30",
  "TSLA $178.52",
  "NVDA $1,034.86",
  "MSFT $415.75",
];

const WatchlistPreview = () => {
  return (
    <article className="list-card">
      <div className="card-header">
        <h2>Watchlist</h2>
        <button>View all</button>
      </div>

      {watchlist.map((stock) => {
        const [symbol, price] = stock.split(" ");

        return (
          <div key={stock} className="stock-row">
            <span>{symbol}</span>
            <span>{price}</span>
          </div>
        );
      })}
    </article>
  );
};

export default WatchlistPreview;
