const Portfolio = () => {
  return (
    <div className="flex flex-col w-full mt-4">
      <h1>Portfolio</h1>
      <p className="mt-3">Manage your investments and holdings.</p>

      <div className="summary-cards mt-8">
        {/* card 1 */}
        <article className="card">
          <p className="metric-label">Total Portfolio Value</p>
          <h2 className="metric-value">$0.00</h2>
          <p className="metric-change">+0.00%</p>
        </article>

        {/* card 2 */}
        <article className="card">
          <p className="metric-label">Total Gain/Loss</p>
          <h2 className="metric-value">$0.00</h2>
          <p className="metric-change positive">+$0.00</p>
        </article>

        {/* card 3 */}
        <article className="card">
          <p className="metric-label">Cash Balance</p>
          <h2 className="metric-value">$0.00</h2>
          <p className="metric-change positive">$0.00</p>
        </article>

        {/* card 4 */}
        <article className="card">
          <p className="metric-label">Day's Change</p>
          <h2 className="metric-value">+$0.00</h2>
          <p className="metric-change positive">+0.00%</p>
        </article>
      </div>

      {/* Holdings Table */}
      <div className="mt-8 w-full">
        <h2 className="mt-8 mb-4 text-2xl font-normal">My Holdings</h2>

        <div className="overflow-x-auto mt-2">
          <table className="w-full">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Market Value</th>
                <th>Gain/Loss</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>AAPL</td>
                <td>10</td>
                <td>$210.50</td>
                <td>$2,105.00</td>
                <td className="portfolio-positive">+$105.00</td>
              </tr>

              <tr>
                <td>TSLA</td>
                <td>5</td>
                <td>$325.40</td>
                <td>$1,627.00</td>
                <td className="portfolio-negative">-$42.00</td>
              </tr>

              <tr>
                <td>NVDA</td>
                <td>8</td>
                <td>$145.80</td>
                <td>$1,166.40</td>
                <td className="portfolio-positive">+$86.40</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
