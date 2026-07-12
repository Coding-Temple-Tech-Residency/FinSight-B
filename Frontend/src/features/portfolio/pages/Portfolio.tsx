import { usePortfolios } from "../hooks/usePortfolio";
import {
  useHoldings,
  useCreateHolding,
  useDeleteHolding,
  useUpdateHolding,
} from "../hooks/useHoldings";

import type { Holding } from "../types/holdings";

const Portfolio = () => {
  const { data: portfolios, isLoading, isError } = usePortfolios();

  const primaryPortfolio = portfolios?.[0];
  console.log("portfolio:", portfolios);
  console.log("primary", primaryPortfolio);
  const {
    data: holdings = [],
    isLoading: holdingsLoading,
    isError: holdingsError,
  } = useHoldings(primaryPortfolio?.id);

  const { mutate: deleteHolding } = useDeleteHolding();
  const { mutate: updateHolding } = useUpdateHolding();
  const { mutate: createHolding } = useCreateHolding();

  const handleDelete = (holdingId: number) => {
    deleteHolding({
      portfolioId: primaryPortfolio!.id,
      holdingId,
    });
  };

  const handleEdit = (holding: Holding) => {
    console.log("Edit", holding);
  };

  return (
    <div className="flex flex-col w-full mt-4">
      <h1>Portfolio</h1>
      <p className="mt-3">Manage your investments and holdings.</p>

      <div className="summary-cards mt-8">
        {/* card 1 */}
        <article className="card">
          <p className="metric-label">Total Portfolio Value</p>
          <h2 className="metric-value">
            {isLoading
              ? "Loading..."
              : isError
                ? "Unavailable"
                : `$${Number(primaryPortfolio?.total_value ?? 0).toLocaleString()}`}
          </h2>
        </article>

        {/* card 2 */}
        <article className="card">
          <p className="metric-label">Buying Power</p>
          <h2 className="metric-value">
            {" "}
            {isLoading
              ? "Loading..."
              : isError
                ? "Unavailable"
                : `$${Number(primaryPortfolio?.buying_power ?? 0).toLocaleString()}`}
          </h2>
        </article>

        {/* card 3 */}
        <article className="card">
          <p className="metric-label">Cash Balance</p>
          <h2 className="metric-value">
            {" "}
            {isLoading
              ? "Loading..."
              : isError
                ? "Unavailable"
                : `$${Number(primaryPortfolio?.cash_balance ?? 0).toLocaleString()}`}
          </h2>
        </article>

        {/* card 4
        <article className="card">
          <p className="metric-label">Day's Change</p>
          <h2 className="metric-value">+$0.00</h2>
          <p className="metric-change positive">+0.00%</p>
        </article> */}
      </div>

      {/* Holdings Table */}
      <div className="mt-8 w-full">
        <div className="flex w-full items-end justify-between">
          <h2 className="mt-8 mb-1 text-2xl font-normal">My Holdings</h2>
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-black">
            + Add Holding
          </button>
        </div>
        <div className="overflow-x-auto mt-1">
          <table className="w-full">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Market Value</th>
                <th>Gain/Loss</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {holdings.map((holding) => (
                <tr key={holding.id}>
                  <td>{holding.symbol}</td>
                  <td>{holding.quantity}</td>
                  <td>{holding.average_price}</td>
                  <td>{holding.current_price}</td>
                  <td>
                    {Number(holding.current_price) -
                      Number(holding.average_price)}
                  </td>
                  <td className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(holding)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-black hover:opacity-80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(holding.id)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-black hover:opacity-80"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
