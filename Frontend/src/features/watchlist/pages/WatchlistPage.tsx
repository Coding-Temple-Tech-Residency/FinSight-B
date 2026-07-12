import {
  // useAddToWatchlist,
  // useRemoveFromWatchlist,
  useWatchlist,
} from "../hooks/useWatchlist";
const WatchlistPage = () => {
  const { data: watchlist = [], isLoading, isError } = useWatchlist();
  // const { mutate: addToWatchlist } = useAddToWatchlist();
  // const { mutate: removeFromWatchlist } = useRemoveFromWatchlist();
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
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5}>Loading...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5}>Unable to load watchlist.</td>
                </tr>
              ) : watchlist.length === 0 ? (
                <tr>
                  <td colSpan={5}>No watchlist items.</td>
                </tr>
              ) : (
                watchlist.map((item) => (
                  <tr key={item.id}>
                    <td>{item.symbol}</td>
                    <td>${Number(item.stock?.latest_price ?? 0).toFixed(2)}</td>
                    <td>--</td>
                    <td>
                      <button className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-black hover:opacity-80">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;
