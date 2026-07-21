import type { ChangeEvent } from "react";

import type { Portfolio } from "../types/portfolio";

type PortfolioSelectorProps = {
  portfolios: Portfolio[];
  selectedPortfolioId?: number;
  isUpdating: boolean;
  isDeleting: boolean;
  onSelect: (portfolioId: number) => void;
  onEdit: () => void;
  onDelete: () => void;
};

const PortfolioSelector = ({
  portfolios,
  selectedPortfolioId,
  isUpdating,
  isDeleting,
  onSelect,
  onEdit,
  onDelete,
}: PortfolioSelectorProps) => {
  const hasSelectedPortfolio =
    typeof selectedPortfolioId === "number" && selectedPortfolioId > 0;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const portfolioId = Number(event.target.value);

    if (!Number.isFinite(portfolioId) || portfolioId <= 0) {
      return;
    }

    onSelect(portfolioId);
  };

  return (
    <section className="portfolio-toolbar">
      <div className="portfolio-selector-group">
        <label htmlFor="portfolio-selector">Selected Portfolio</label>

        <select
          id="portfolio-selector"
          value={selectedPortfolioId ?? ""}
          onChange={handleChange}
          disabled={portfolios.length === 0 || isUpdating || isDeleting}
        >
          {portfolios.map((portfolio) => (
            <option key={portfolio.id} value={portfolio.id}>
              {portfolio.name}
            </option>
          ))}
        </select>
      </div>

      <div className="portfolio-toolbar-actions">
        <button
          type="button"
          onClick={onEdit}
          disabled={!hasSelectedPortfolio || isUpdating || isDeleting}
        >
          {isUpdating ? "Saving..." : "Edit"}
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={onDelete}
          disabled={!hasSelectedPortfolio || isUpdating || isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </section>
  );
};

export default PortfolioSelector;
