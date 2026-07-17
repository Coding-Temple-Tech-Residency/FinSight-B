import { Link } from "react-router-dom";

import { usePortfolios } from "../../portfolio/hooks/usePortfolio";
import { usePortfolioPerformance } from "../../dashboard/hooks/usePortfolioPerformance";

import LoadingCard from "../../../components/ui/LoadingCard";
import ErrorCard from "../../../components/ui/ErrorCard";
import EmptyCard from "../../../components/ui/EmptyCard";

import HomePreviewChart from "./HomePreviewChart";

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value: number) => {
  const prefix = value > 0 ? "+" : "";

  return `${prefix}${value.toFixed(2)}%`;
};

const AuthenticatedHomePreview = () => {
  const {
    data: portfolios = [],
    isLoading: portfoliosLoading,
    isError: portfoliosError,
  } = usePortfolios();

  const {
    summary,
    isLoading: performanceLoading,
    isFetching: performanceFetching,
    isError: performanceError,
  } = usePortfolioPerformance(portfolios);

  const isLoading =
    portfoliosLoading || performanceLoading || performanceFetching;

  const isError = portfoliosError || performanceError;

  if (isLoading) {
    return <LoadingCard title="Loading your portfolio overview..." />;
  }

  if (isError) {
    return (
      <ErrorCard message="Your portfolio overview is currently unavailable." />
    );
  }

  if (portfolios.length === 0) {
    return (
      <EmptyCard
        title="No portfolios yet"
        message="Create your first portfolio to start tracking your investments."
      />
    );
  }

  const currency = summary.currency ?? "USD";

  const canDisplayTotals =
    !summary.hasMixedCurrencies && Boolean(summary.currency);

  const totalValue = canDisplayTotals
    ? formatCurrency(summary.totalMarketValue, currency)
    : "Multiple currencies";

  const totalGainLoss = canDisplayTotals
    ? formatCurrency(summary.totalGainLoss, currency)
    : "Unavailable";

  const totalGainLossPercent = canDisplayTotals
    ? formatPercent(summary.totalGainLossPercent)
    : undefined;

  const isPositive = summary.totalGainLoss >= 0;

  return (
    <div className="dashboard-mockup rounded-3xl bg-(--bg-secondary) border border-white/10 p-5 shadow-2xl">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-bold">Your Dashboard</h3>
          <p className="text-sm opacity-70">
            Live data from all your portfolios
          </p>
        </div>

        <Link
          to="/dashboard"
          className="text-(--accent-primary) text-sm font-semibold"
        >
          Open Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl bg-(--bg-primary) p-4">
          <p className="text-sm opacity-70">Total Portfolio Value</p>

          <h4 className="text-2xl font-bold">{totalValue}</h4>

          {totalGainLossPercent && (
            <p
              className={`text-sm ${
                isPositive ? "text-(--accent-primary)" : "text-red-500"
              }`}
            >
              {totalGainLossPercent}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-(--bg-primary) p-4">
          <p className="text-sm opacity-70">Total Profit / Loss</p>

          <h4
            className={`text-2xl font-bold ${
              isPositive ? "text-(--accent-primary)" : "text-red-500"
            }`}
          >
            {totalGainLoss}
          </h4>

          <p className="text-sm opacity-70">
            {summary.unpricedHoldings > 0
              ? `${summary.unpricedHoldings} holding${
                  summary.unpricedHoldings === 1 ? "" : "s"
                } missing prices`
              : "All priced holdings"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-(--bg-primary) p-4 mb-4">
        <div className="flex justify-between mb-3">
          <div>
            <p className="font-semibold">Portfolio Overview</p>
            <p className="text-xs opacity-60">
              Chart remains demo data until performance history is available
            </p>
          </div>

          <span className="text-(--accent-primary)">Demo</span>
        </div>

        <HomePreviewChart />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-(--bg-primary) p-4">
          <p className="text-sm opacity-70">Portfolios</p>
          <h4 className="text-2xl font-bold">{portfolios.length}</h4>
        </div>

        <div className="rounded-2xl bg-(--bg-primary) p-4">
          <p className="text-sm opacity-70">Holdings</p>
          <h4 className="text-2xl font-bold">{summary.totalHoldings}</h4>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedHomePreview;
