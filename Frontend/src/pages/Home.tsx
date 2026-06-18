import { dashboardData } from "../data/dashboardData";

const Home = () => {
  return (
    <section className="home h-screen">
      {dashboardData.keyMetrics.map((metric) => (
        <article key={metric.id} className="metric-card">
          <p>{metric.label}</p>
          <h2>${metric.value.toLocaleString()}</h2>
        </article>
      ))}

      <article className="hold-card">
        <h2>Holdings</h2>

        {dashboardData.holdings.map((holding) => (
          <div key={holding.id}>
            <p>{holding.symbol}</p>
            <p>{holding.shares}</p>
          </div>
        ))}
      </article>

      <article className="list-card">
        <h2>Watchlist</h2>

        {dashboardData.watchlist.map((stock) => (
          <div key={stock.id}>
            <p>{stock.symbol}</p>
            <p>${stock.currentPrice}</p>
          </div>
        ))}
      </article>

      <article className="insight-card">
        <h2>AI Insights</h2>

        {dashboardData.aiInsights.map((insight) => (
          <div key={insight.id}>
            <p>{insight.title}</p>
          </div>
        ))}
      </article>

      <article className="message-card">
        <h2>Ask FinSight</h2>

        {dashboardData.askFinSightMessages.map((message) => (
          <div key={message.id}>
            <p>{message.content}</p>
          </div>
        ))}
      </article>
    </section>
  );
};

export default Home;
