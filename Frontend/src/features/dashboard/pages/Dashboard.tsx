const Dashboard = () => {
  return (
    <section className="dashboard">
      <article className="metric-card">
        <p className="metric-label">Portfolio Value</p>
        <h2 className="metric-value">$28,560.00</h2>
        <p className="metric-change positive">+2.45% (+$682.54)</p>
      </article>

      <article className="metric-card">
        <p className="metric-label">Day Change</p>
        <h2 className="metric-value">+$682.54</h2>
        <p className="metric-change positive">+2.45%</p>
      </article>

      <article className="metric-card">
        <p className="metric-label">Buying Power</p>
        <h2 className="metric-value">$4,250.00</h2>
      </article>

      <article className="metric-card">
        <p className="metric-label">Cash Balance</p>
        <h2 className="metric-value">$2,310.00</h2>
      </article>

      <article className="chart-card">
        <div className="card-header">
          <h2>Portfolio Performance</h2>
          <span>1M</span>
        </div>

        <div className="fake-chart">
          {[35, 45, 42, 55, 60, 52, 70, 65, 75, 68, 82, 90].map(
            (height, index) => (
              <div
                key={index}
                className="chart-bar"
                style={{ height: `${height}%` }}
              />
            ),
          )}
        </div>
      </article>

      <article className="insight-card">
        <div className="card-header">
          <h2>AI Market Insight</h2>
          <span className="badge">Bullish</span>
        </div>

        <p>
          Markets are showing strength this week with tech stocks leading the
          rally. Earnings season is driving momentum.
        </p>

        <button>View Full Insight →</button>
      </article>

      <article className="hold-card">
        <div className="card-header">
          <h2>Holdings Allocation</h2>
        </div>

        <div className="donut"></div>
      </article>

      <article className="list-card">
        <div className="card-header">
          <h2>Top Movers</h2>
          <button>View all</button>
        </div>

        {["AAPL +2.35%", "NVDA +3.21%", "MSFT -0.45%", "AMZN +1.02%"].map(
          (stock) => (
            <div key={stock} className="stock-row">
              <span>{stock.split(" ")[0]}</span>
              <span>{stock.split(" ")[1]}</span>
            </div>
          ),
        )}
      </article>

      <article className="list-card">
        <div className="card-header">
          <h2>Watchlist</h2>
          <button>View all</button>
        </div>

        {["AAPL $196.30", "TSLA $178.52", "NVDA $1,034.86", "MSFT $415.75"].map(
          (stock) => (
            <div key={stock} className="stock-row">
              <span>{stock.split(" ")[0]}</span>
              <span>{stock.split(" ")[1]}</span>
            </div>
          ),
        )}
      </article>
    </section>
  );
};

export default Dashboard;
