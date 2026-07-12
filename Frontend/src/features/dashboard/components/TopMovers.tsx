const TopMovers = () => {
  return (
    <article className="list-card">
      <div className="card-header">
        <h2>Top Movers</h2>
      </div>

      <div className="dashboard-unavailable-state">
        <h3>Market movers unavailable</h3>

        <p>
          Top market movers will appear when the backend provides a market
          movers endpoint.
        </p>
      </div>
    </article>
  );
};

export default TopMovers;
