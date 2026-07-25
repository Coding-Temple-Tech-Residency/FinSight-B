import Modal from "../../../../components/ui/Modal";

import type { StockSearchResult } from "../../types/stock";

import "./StockDetailsModal.css";

type StockDetailsModalProps = {
  stock: StockSearchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onViewMarket: (symbol: string) => void;
};

const formatCurrency = (value: number | null, currency: string | null) => {
  if (value === null || !Number.isFinite(value)) {
    return "Price unavailable";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency || "USD"} ${value.toFixed(2)}`;
  }
};

const StockDetailsModal = ({
  stock,
  isOpen,
  onClose,
  onViewMarket,
}: StockDetailsModalProps) => {
  if (!stock) {
    return null;
  }

  const companyName = stock.company_name || stock.name || stock.symbol;
  const logoUrl = stock.company_logo_url || stock.logo_url;
  const title = `${companyName} (${stock.symbol})`;

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      <article className="stock-details-modal">
        <header className="stock-details-modal__summary">
          <div className="stock-details-modal__identity">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${companyName} logo`}
                className="stock-details-modal__logo"
              />
            ) : (
              <div className="stock-details-modal__logo-placeholder" aria-hidden="true">
                {stock.symbol.slice(0, 2)}
              </div>
            )}

            <div>
              <p className="stock-details-modal__symbol">{stock.symbol}</p>
              <h3>{companyName}</h3>
              <p className="stock-details-modal__exchange">
                {[stock.exchange, stock.currency].filter(Boolean).join(" · ") ||
                  "Market details unavailable"}
              </p>
            </div>
          </div>

          <div className="stock-details-modal__price">
            <span>Latest price</span>
            <strong>
              {formatCurrency(stock.latest_price, stock.currency)}
            </strong>
          </div>
        </header>

        <dl className="stock-details-modal__details">
          <div>
            <dt>Sector</dt>
            <dd>{stock.sector || "Not available"}</dd>
          </div>

          <div>
            <dt>Industry</dt>
            <dd>{stock.industry || "Not available"}</dd>
          </div>

          <div>
            <dt>Exchange</dt>
            <dd>{stock.exchange || "Not available"}</dd>
          </div>

          <div>
            <dt>Currency</dt>
            <dd>{stock.currency || "USD"}</dd>
          </div>
        </dl>

        <footer className="stock-details-modal__actions">
          <button
            type="button"
            className="stock-details-modal__secondary-action"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="button"
            className="stock-details-modal__primary-action"
            onClick={() => onViewMarket(stock.symbol)}
          >
            View full market data
          </button>
        </footer>
      </article>
    </Modal>
  );
};

export default StockDetailsModal;
