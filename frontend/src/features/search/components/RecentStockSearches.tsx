import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import type { StockSearchResult } from "../../market/types/stock";

interface RecentStockSearchesProps {
  stocks: StockSearchResult[];
  activeIndex: number;
  onSelect: (stock: StockSearchResult) => void;
  onRemove: (symbol: string) => void;
  onClear: () => void;
}

const RecentStockSearches = ({
  stocks,
  activeIndex,
  onSelect,
  onRemove,
  onClear,
}: RecentStockSearchesProps) => {
  if (stocks.length === 0) {
    return (
      <div className="px-4 py-5 text-(--text-primary)">
        <strong className="text-sm">No recent stock searches</strong>

        <p className="mt-1 text-xs leading-5 opacity-65">
          Stocks you select will appear here for faster access.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-white/10
          px-4
          py-3
          text-(--text-primary)
        "
      >
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faClockRotateLeft}
            aria-hidden="true"
            className="text-xs opacity-60"
          />

          <strong className="text-xs uppercase tracking-wide opacity-70">
            Recent
          </strong>
        </div>

        <button
          type="button"
          className="
            flex
            items-center
            gap-1.5
            rounded-lg
            bg-transparent
            px-2
            py-1
            text-xs
            text-(--text-primary)
            opacity-60
            transition
            hover:bg-(--bg-secondary)
            hover:opacity-100
          "
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={onClear}
        >
          <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
          Clear
        </button>
      </div>

      <div
        role="listbox"
        aria-label="Recent stock searches"
        className="flex flex-col gap-1 p-2"
      >
        {stocks.map((stock, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={stock.symbol}
              className={`
                flex
                items-center
                gap-1
                rounded-xl
                transition
                ${
                  isActive ? "bg-(--bg-secondary)" : "hover:bg-(--bg-secondary)"
                }
              `}
            >
              <button
                id={`recent-stock-result-${stock.symbol}`}
                type="button"
                role="option"
                aria-selected={isActive}
                className="
                  flex
                  min-w-0
                  flex-1
                  items-center
                  gap-3
                  bg-transparent
                  px-3
                  py-3
                  text-left
                  text-(--text-primary)
                "
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  onSelect(stock);
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm">{stock.symbol}</strong>

                    {stock.exchange && (
                      <span
                        className="
                          rounded-full
                          bg-(--bg-primary)
                          px-2
                          py-0.5
                          text-[0.65rem]
                          font-bold
                          uppercase
                          opacity-65
                        "
                      >
                        {stock.exchange}
                      </span>
                    )}
                  </div>

                  <span className="mt-0.5 block truncate text-xs opacity-65">
                    {stock.company_name}
                  </span>
                </div>
              </button>

              <button
                type="button"
                aria-label={`Remove ${stock.symbol} from recent searches`}
                className="
                  mr-2
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-transparent
                  text-(--text-primary)
                  opacity-40
                  transition
                  hover:bg-(--bg-primary)
                  hover:opacity-100
                "
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  onRemove(stock.symbol);
                }}
              >
                <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentStockSearches;
