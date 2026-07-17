import { type FormEvent, useState } from "react";

import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
} from "../hooks/useWatchlist";

const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === "") {
    return "Unavailable";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

const WatchlistPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const [symbol, setSymbol] = useState("");
  const [alertPrice, setAlertPrice] = useState("");

  const {
    data: watchlist = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useWatchlist();

  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  const resetForm = () => {
    setSymbol("");
    setAlertPrice("");
    setShowAddForm(false);
  };

  const handleAddStock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedSymbol = symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      return;
    }

    const parsedAlertPrice =
      alertPrice.trim() === "" ? undefined : Number(alertPrice);

    if (
      parsedAlertPrice !== undefined &&
      (!Number.isFinite(parsedAlertPrice) || parsedAlertPrice < 0)
    ) {
      return;
    }

    try {
      await addMutation.mutateAsync({
        symbol: normalizedSymbol,
        alert_price: parsedAlertPrice === undefined ? null : parsedAlertPrice,
      });

      resetForm();
    } catch {
      // Mutation error is displayed below the form.
    }
  };

  const handleRemoveStock = async (stockSymbol: string) => {
    const confirmed = window.confirm(
      `Remove ${stockSymbol} from your watchlist?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeMutation.mutateAsync(stockSymbol);
    } catch {
      // Mutation error is displayed in the page.
    }
  };

  const normalizedInputSymbol = symbol.trim().toUpperCase();

  const symbolAlreadyExists =
    normalizedInputSymbol.length > 0 &&
    watchlist.some(
      (item) => item.symbol.toUpperCase() === normalizedInputSymbol,
    );

  const invalidAlertPrice =
    alertPrice.trim() !== "" &&
    (!Number.isFinite(Number(alertPrice)) || Number(alertPrice) < 0);

  const addButtonDisabled =
    addMutation.isPending ||
    normalizedInputSymbol.length === 0 ||
    symbolAlreadyExists ||
    invalidAlertPrice;

  return (
    <section className="flex w-full flex-col gap-6 py-4">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1>Watchlist</h1>

          <p className="mt-1 opacity-70">Track stocks you want to monitor.</p>
        </div>

        <button
          type="button"
          className="rounded-lg bg-(--accent-primary) px-4 py-2 text-sm font-bold text-(--bg-primary)"
          onClick={() => setShowAddForm((currentValue) => !currentValue)}
        >
          {showAddForm ? "Cancel" : "+ Add Stock"}
        </button>
      </header>

      {showAddForm && (
        <form
          onSubmit={handleAddStock}
          className="rounded-2xl border border-white/10 bg-(--bg-secondary) p-5"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Stock symbol</span>

              <input
                type="text"
                value={symbol}
                onChange={(event) =>
                  setSymbol(event.target.value.toUpperCase())
                }
                placeholder="AAPL"
                autoComplete="off"
                className="rounded-lg border border-white/10 bg-(--bg-primary) px-4 py-3 uppercase outline-none focus:border-(--accent-primary)"
              />

              {symbolAlreadyExists && (
                <span className="text-sm text-red-500">
                  This stock is already in your watchlist.
                </span>
              )}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">
                Alert price
                <span className="ml-1 font-normal opacity-60">Optional</span>
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={alertPrice}
                onChange={(event) => setAlertPrice(event.target.value)}
                placeholder="200.00"
                className="rounded-lg border border-white/10 bg-(--bg-primary) px-4 py-3 outline-none focus:border-(--accent-primary)"
              />

              {invalidAlertPrice && (
                <span className="text-sm text-red-500">
                  Enter a valid alert price.
                </span>
              )}
            </label>
          </div>

          {addMutation.isError && (
            <p className="mt-4 text-sm text-red-500" role="alert">
              {getErrorMessage(addMutation.error)}
            </p>
          )}

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/10 px-4 py-2 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={addButtonDisabled}
              className="rounded-lg bg-(--accent-primary) px-5 py-2 font-bold text-(--bg-primary) disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addMutation.isPending ? "Adding..." : "Add to Watchlist"}
            </button>
          </div>
        </form>
      )}

      {removeMutation.isError && (
        <div
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-500"
          role="alert"
        >
          {getErrorMessage(removeMutation.error)}
        </div>
      )}

      {isLoading && (
        <div className="rounded-2xl bg-(--bg-secondary) p-6" role="status">
          Loading watchlist...
        </div>
      )}

      {!isLoading && isError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="font-semibold text-red-500">Watchlist unavailable</p>

          <p className="mt-2 text-sm opacity-80">{getErrorMessage(error)}</p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg border border-white/10 px-4 py-2 font-semibold"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !isError && watchlist.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-(--bg-secondary) p-8 text-center">
          <h2>Your watchlist is empty</h2>

          <p className="mt-2 opacity-70">
            Add a stock symbol to begin monitoring its latest price.
          </p>

          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-5 rounded-lg bg-(--accent-primary) px-5 py-3 font-bold text-(--bg-primary)"
          >
            Add Your First Stock
          </button>
        </div>
      )}

      {!isLoading && !isError && watchlist.length > 0 && (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-(--bg-secondary)">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2>Tracked Stocks</h2>

              <p className="text-sm opacity-70">
                {watchlist.length} {watchlist.length === 1 ? "stock" : "stocks"}
              </p>
            </div>

            {isFetching && (
              <span className="text-sm opacity-70" role="status">
                Updating...
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-175 table-auto">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-5 py-4">Symbol</th>

                  <th className="px-5 py-4">Company</th>

                  <th className="px-5 py-4">Latest Price</th>

                  <th className="px-5 py-4">Alert Price</th>

                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {watchlist.map((item) => {
                  const isRemoving =
                    removeMutation.isPending &&
                    removeMutation.variables?.trim().toUpperCase() ===
                      item.symbol.trim().toUpperCase();

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <strong>{item.symbol}</strong>
                      </td>

                      <td className="px-5 py-4">{item.company_name}</td>

                      <td className="px-5 py-4">
                        {formatCurrency(item.latest_price)}
                      </td>

                      <td className="px-5 py-4">
                        {item.alert_price === null
                          ? "Not set"
                          : formatCurrency(item.alert_price)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled={removeMutation.isPending}
                          onClick={() => handleRemoveStock(item.symbol)}
                          className="rounded-lg border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isRemoving ? "Removing..." : "Remove"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </section>
  );
};

export default WatchlistPage;
