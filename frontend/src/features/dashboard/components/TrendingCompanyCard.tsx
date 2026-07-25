import type { TrendingStock } from "../../market/types/trending";
import { formatCurrency } from "../../portfolio/utils/currencyFormatting";

type TrendingCompanyCardProps = {
  stock: TrendingStock;
  featured?: boolean;
};

const formatPercentage = (value: number | null) => {
  if (value === null) {
    return "Unavailable";
  }

  const sign = value > 0 ? "+" : "";

  return `${sign}${value.toFixed(2)}%`;
};

const formatVolume = (value: number | null) => {
  if (value === null) {
    return "Unavailable";
  }

  return value.toLocaleString("en-US");
};

const getCategoryLabel = (stock: TrendingStock) => {
  if (stock.category === "gainer") {
    return "Top gainer";
  }

  if (stock.category === "loser") {
    return "Top loser";
  }

  return "Most active";
};

const TrendingCompanyCard = ({
  stock,
  featured = false,
}: TrendingCompanyCardProps) => {
  const companyName = stock.company_name?.trim() || stock.symbol;

  const percentageClass =
    stock.percentage_change === null
      ? ""
      : stock.percentage_change > 0
        ? "positive"
        : stock.percentage_change < 0
          ? "negative"
          : "";

  return (
    <article
      className={`trending-company-card ${
        featured ? "trending-company-card-featured" : ""
      }`}
    >
      <header className="trending-company-card-header">
        <div className="trending-company-identity">
          <div>
            <div className="trending-company-rank">
              #{stock.rank} {getCategoryLabel(stock)}
            </div>

            <h3>{companyName}</h3>

            <p>{stock.symbol}</p>
          </div>
        </div>

        <span className="trending-company-exchange">
          {getCategoryLabel(stock)}
        </span>
      </header>

      <div className="trending-company-market-data">
        <div>
          <span>Price</span>

          <strong>
            {stock.price === null
              ? "Unavailable"
              : formatCurrency(stock.price, "USD")}
          </strong>
        </div>

        <div>
          <span>Change</span>

          <strong className={percentageClass}>
            {formatPercentage(stock.percentage_change)}
          </strong>
        </div>
      </div>

      <footer className="trending-company-footer">
        <span className="trending-company-score">
          Volume: {formatVolume(stock.volume)}
        </span>

        <span className={percentageClass}>
          {stock.change_amount === null
            ? "Change unavailable"
            : `${stock.change_amount > 0 ? "+" : ""}${stock.change_amount.toFixed(
                2,
              )}`}
        </span>
      </footer>
    </article>
  );
};

export default TrendingCompanyCard;
