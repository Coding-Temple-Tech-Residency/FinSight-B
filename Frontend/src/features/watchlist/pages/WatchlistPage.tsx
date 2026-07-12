const WatchlistPage = () => {
  return (
    <div className="flex flex-col w-full mt-4">
      <div className="mt-4 mb-4">
        <div className="flex w-full items-center justify-between">
          <h1>Watchlist</h1>
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black">
            + Add
          </button>
        </div>
        {/* WatchList Table */}
        <div className="overflow-x-auto mt-2">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Price</th>
                <th>Change</th>
                <th>Chart (7D)</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>AAPL</td>
                <td>$1.96.39</td>
                <td className="portfolio-positive">+2.3%</td>
                <td>--</td>
              </tr>

              <tr>
                <td>TSLA</td>
                <td>$178.52</td>
                <td className="portfolio-negative">-1.2%</td>
                <td>--</td>
              </tr>

              <tr>
                <td>NVDA</td>
                <td>%1,034.86</td>
                <td className="portfolio-positive">+3.2%</td>
                <td>--</td>
              </tr>

              <tr>
                <td>GOOGL</td>
                <td>%170.50</td>
                <td className="portfolio-positive">+0.2%</td>
                <td>--</td>
              </tr>

              <tr>
                <td>META</td>
                <td>%459.54</td>
                <td className="portfolio-negative">-0.8%</td>
                <td>--</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;
