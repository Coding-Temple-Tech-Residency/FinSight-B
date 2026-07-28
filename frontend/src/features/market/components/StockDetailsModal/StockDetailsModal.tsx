import Modal from "../../../../components/ui/Modal";

import type { StockSearchResult } from "../../types/stock";

import CompanyOverviewCard from "../CompanyOverviewCard";
import { useStockQuote } from "../../hooks/useStockQuote";

import "./StockDetailsModal.css";

type StockDetailsModalProps = {
  stock: StockSearchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onViewMarket: (symbol: string) => void;
};

const StockDetailsModal = ({
  stock,
  isOpen,
  onClose,
  onViewMarket,
}: StockDetailsModalProps) => {
  const symbol = stock?.symbol.trim().toUpperCase() ?? "";
  const quoteQuery = useStockQuote(symbol);

  if (!stock) {
    return null;
  }

  const companyName = stock.company_name || stock.symbol;
  const title = `${companyName} (${stock.symbol})`;

  const handleViewMarket = () => {
    onViewMarket(stock.symbol);
  };

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      <article className="stock-details-modal">
        <CompanyOverviewCard
          quote={quoteQuery.data}
          loading={quoteQuery.isLoading}
          isError={quoteQuery.isError}
        />

        {quoteQuery.isError && (
          <p className="negative" role="alert">
            {quoteQuery.error instanceof Error
              ? quoteQuery.error.message
              : "Unable to load company information."}
          </p>
        )}

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
            onClick={handleViewMarket}
          >
            View full market data
          </button>
        </footer>
      </article>
    </Modal>
  );
};

export default StockDetailsModal;
