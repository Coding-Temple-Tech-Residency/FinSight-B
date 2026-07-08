const topMovers = ["AAPL +2.35%", "NVDA +3.21%", "MSFT -0.45%", "AMZN +1.02%"];

const TopMovers = () => {
  return (
    <article className="list-card">
      <div className="card-header">
        <h2>Top Movers</h2>
        <button>View all</button>
      </div>

      {topMovers.map((stock) => {
        const [symbol, change] = stock.split(" ");

        return (
          <div key={stock} className="stock-row">
            <span>{symbol}</span>
            <span className={change.startsWith("+") ? "positive" : "negative"}>
              {change}
            </span>
          </div>
        );
      })}
    </article>
  );
};

export default TopMovers;
