type PortfolioHeaderProps = {
  isCreating: boolean;
  onCreatePortfolio: () => void;
};

const PortfolioHeader = ({
  isCreating,
  onCreatePortfolio,
}: PortfolioHeaderProps) => {
  return (
    <header className="portfolio-page-header">
      <div>
        <p className="page-eyebrow">Investments</p>

        <h1>Portfolio</h1>

        <p>Create and manage your investment portfolios and holdings.</p>
      </div>

      <button type="button" onClick={onCreatePortfolio} disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Portfolio"}
      </button>
    </header>
  );
};

export default PortfolioHeader;
