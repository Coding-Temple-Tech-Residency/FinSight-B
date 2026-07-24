import type { Holding } from "../types/holdings";

import {
  formatCurrency,
  normalizeCurrencyCode,
  toFiniteNumber,
} from "../utils/currencyFormatting";

type HoldingRowProps = {
  holding: Holding;
  isUpdating: boolean;
  isDeleting: boolean;
  onEdit: (holding: Holding) => void;
  onDelete: (holding: Holding) => void;
};

const formatShares = (value: number | string) => {
  const shares = Number(value);

  if (!Number.isFinite(shares)) {
    return "Unavailable";
  }

  return shares.toLocaleString("en-US", {
    maximumFractionDigits: 4,
  });
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "Not provided";
  }

  const normalizedDate = value.includes("T") ? value : `${value}T00:00:00`;

  const date = new Date(normalizedDate);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const HoldingRow = ({
  holding,
  isUpdating,
  isDeleting,
  onEdit,
  onDelete,
}: HoldingRowProps) => {
  const shares = toFiniteNumber(holding.shares);

  const averageBuyPrice = toFiniteNumber(holding.average_buy_price);

  const averageBuyPriceNative = toFiniteNumber(
    holding.average_buy_price_native,
  );

  const latestPrice = toFiniteNumber(holding.latest_price);

  const purchaseCurrency = normalizeCurrencyCode(holding.purchase_currency);

  const nativeCurrency = normalizeCurrencyCode(holding.native_currency);

  const costBasisNative =
    shares !== null && averageBuyPriceNative !== null
      ? shares * averageBuyPriceNative
      : null;

  const marketValueNative =
    shares !== null && latestPrice !== null ? shares * latestPrice : null;

  const gainLossNative =
    marketValueNative !== null && costBasisNative !== null
      ? marketValueNative - costBasisNative
      : null;

  const currenciesDiffer = purchaseCurrency !== nativeCurrency;

  return (
    <tr>
      <td>
        <div className="holding-asset-cell">
          <strong>{holding.symbol}</strong>

          <span>{holding.company_name}</span>

          <span className="metric-label">
            Market currency: {nativeCurrency}
          </span>
        </div>
      </td>

      <td>{formatShares(holding.shares)}</td>

      <td>
        <div className="holding-price-cell">
          <span>{formatCurrency(averageBuyPrice, purchaseCurrency)}</span>

          {currenciesDiffer && averageBuyPriceNative !== null && (
            <span className="metric-label">
              {formatCurrency(averageBuyPriceNative, nativeCurrency)} converted
            </span>
          )}
        </div>
      </td>

      <td>{formatCurrency(latestPrice, nativeCurrency)}</td>

      <td>{formatCurrency(marketValueNative, nativeCurrency)}</td>

      <td>
        {gainLossNative === null ? (
          "Unavailable"
        ) : (
          <span
            className={
              gainLossNative >= 0 ? "portfolio-positive" : "portfolio-negative"
            }
          >
            {gainLossNative >= 0 ? "+" : ""}
            {formatCurrency(gainLossNative, nativeCurrency)}
          </span>
        )}
      </td>

      <td>{formatDate(holding.purchased_at)}</td>

      <td>
        <div className="table-actions">
          <button
            type="button"
            disabled={isUpdating || isDeleting}
            onClick={() => onEdit(holding)}
          >
            {isUpdating ? "Saving..." : "Edit"}
          </button>

          <button
            type="button"
            className="danger-button"
            disabled={isUpdating || isDeleting}
            onClick={() => onDelete(holding)}
          >
            {isDeleting ? "Removing..." : "Remove"}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default HoldingRow;
