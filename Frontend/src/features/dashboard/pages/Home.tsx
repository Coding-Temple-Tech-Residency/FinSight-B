import { dashboardData } from "../../../data/dashboardData";

const Home = () => {
  return (
    <section className="home">
      {dashboardData.keyMetrics.map((metric) => (
        <article key={metric.id} className="metric-card">
          <p className="metric-label">{metric.label}</p>

          <h2 className="metric-value">${metric.value.toLocaleString()}</h2>

          <p className="metric-change">{metric.change}</p>
        </article>
      ))}

      <article className="hold-card">
        <div className="card-header">
          <h2>Holdings</h2>
          <button>View All</button>
        </div>

        <div className="card-content">
          {dashboardData.holdings.map((holding) => (
            <div key={holding.id} className="holding-row">
              <span>{holding.symbol}</span>
              <span>{holding.shares}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="list-card">
        <div className="card-header">
          <h2>Watchlist</h2>
          <button>View All</button>
        </div>

        <div className="card-content">
          {dashboardData.watchlist.map((stock) => (
            <div key={stock.id} className="watchlist-row">
              <span>{stock.symbol}</span>
              <span>${stock.currentPrice}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="insight-card">
        <div className="card-header">
          <h2>AI Insights</h2>
        </div>

        <div className="card-content">
          {dashboardData.aiInsights.map((insight) => (
            <div key={insight.id} className="insight-row">
              <h4>{insight.title}</h4>
              <p>{insight.description}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="message-card">
        <div className="card-header">
          <h2>Ask FinSight</h2>
        </div>

        <div className="card-content">
          {dashboardData.askFinSightMessages.map((message) => (
            <div key={message.id} className="message-row">
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
};

export default Home;
