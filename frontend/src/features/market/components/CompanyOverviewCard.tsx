import type { StockQuote } from "../types/stock";

type CompanyOverviewCardProps = {
  quote?: StockQuote;
  loading: boolean;
  isError?: boolean;
};

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-US");
};

const CompanyOverviewCard = ({
  quote,
  loading,
  isError = false,
}: CompanyOverviewCardProps) => {
  if (loading) {
    return (
      <article className="company-overview-card" aria-busy="true">
        <div className="company-overview-card__loading">
          <div className="company-overview-card__skeleton company-overview-card__skeleton--title" />
          <div className="company-overview-card__skeleton" />
          <div className="company-overview-card__skeleton" />
        </div>
      </article>
    );
  }

  if (isError || !quote) {
    return (
      <article className="company-overview-card">
        <h2>Company overview</h2>
        <p className="company-overview-card__empty">
          Company information is currently unavailable.
        </p>
      </article>
    );
  }

  const companyName = quote.company_name || quote.symbol;

  return (
    <article className="company-overview-card">
      <header className="company-overview-card__header">
        <div className="company-overview-card__identity">
          {quote.company_logo_url ? (
            <img
              src={quote.company_logo_url}
              alt={`${companyName} logo`}
              className="company-overview-card__logo"
            />
          ) : (
            <div
              className="company-overview-card__logo-placeholder"
              aria-hidden="true"
            >
              {quote.symbol.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div>
            <p className="company-overview-card__symbol">{quote.symbol}</p>
            <h2>{companyName}</h2>
          </div>
        </div>
      </header>

      <dl className="company-overview-card__details">
        <div>
          <dt>Industry</dt>
          <dd>{quote.industry || "Not available"}</dd>
        </div>

        <div>
          <dt>Exchange</dt>
          <dd>{quote.exchange || "Not available"}</dd>
        </div>

        <div>
          <dt>Currency</dt>
          <dd>{quote.currency || "USD"}</dd>
        </div>

        <div>
          <dt>Last updated</dt>
          <dd>{formatDate(quote.last_refreshed_at)}</dd>
        </div>
      </dl>
    </article>
  );
};

export default CompanyOverviewCard;
