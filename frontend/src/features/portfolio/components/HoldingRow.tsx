import type { Holding } from "../types/holdings";

type HoldingRowProps = {
  holding: Holding;
  isUpdating: boolean;
  isDeleting: boolean;
  onEdit: (holding: Holding) => void;
  onDelete: (holding: Holding) => void;
};

const formatCurrency = (value: number | null) => {
  if (value === null || !Number.isFinite(value)) {
    return "Unavailable";
  }

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
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
  if (!value) return "Not provided";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return date.toLocaleDateString();
};

const HoldingRow = ({
  holding,
  isUpdating,
  isDeleting,
  onEdit,
  onDelete,
}: HoldingRowProps) => {
  const shares = Number(holding.shares);

  const averageBuyPrice = Number(holding.average_buy_price);

  const latestPrice =
    holding.latest_price === null ? null : Number(holding.latest_price);

  const costBasis =
    Number.isFinite(shares) && Number.isFinite(averageBuyPrice)
      ? shares * averageBuyPrice
      : null;

  const marketValue =
    latestPrice !== null &&
    Number.isFinite(latestPrice) &&
    Number.isFinite(shares)
      ? shares * latestPrice
      : null;

  const gainLoss =
    marketValue !== null && costBasis !== null ? marketValue - costBasis : null;

  return (
    <tr>
      <td>
        <div className="holding-asset-cell">
          <strong>{holding.symbol}</strong>
          <span>{holding.company_name}</span>
        </div>
      </td>

      <td>{formatShares(holding.shares)}</td>

      <td>{formatCurrency(averageBuyPrice)}</td>

      <td>{formatCurrency(latestPrice)}</td>

      <td>{formatCurrency(marketValue)}</td>

      <td>
        {gainLoss === null ? (
          "Unavailable"
        ) : (
          <span
            className={
              gainLoss >= 0 ? "portfolio-positive" : "portfolio-negative"
            }
          >
            {gainLoss >= 0 ? "+" : ""}
            {formatCurrency(gainLoss)}
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
            Edit
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
