import { useState } from "react";

import type { StockSearchResult } from "../../market/types/stock";

import EmptyCard from "../../../components/ui/EmptyCard";
import ErrorCard from "../../../components/ui/ErrorCard";
import LoadingCard from "../../../components/ui/LoadingCard";

import StockSearchInput from "../../search/components/StockSearchInput";

import { usePortfolios } from "../../portfolio/hooks/usePortfolio";

import DeleteInsightModal from "../components/DeleteInsightModal";
import InsightCard from "../components/InsightCard";

import {
  useAIInsights,
  useDeleteAIInsight,
  useGeneratePortfolioAIInsight,
  useGenerateStockAIInsight,
} from "../hooks/useAIInsights";

import "../styles/insights.css";

type InsightGenerationMode = "portfolio" | "stock";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
};

const Insights = () => {
  const [insightIdToDelete, setInsightIdToDelete] = useState<number | null>(
    null,
  );

  const [generationMode, setGenerationMode] =
    useState<InsightGenerationMode>("portfolio");

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | "">(
    "",
  );

  const [selectedStockSymbol, setSelectedStockSymbol] = useState("");
  const [selectedStockName, setSelectedStockName] = useState("");

  const [generationSuccessMessage, setGenerationSuccessMessage] = useState("");

  const {
    data: insights = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAIInsights();

  const {
    data: portfolios = [],
    isLoading: portfoliosLoading,
    isError: portfoliosError,
    error: portfoliosErrorData,
  } = usePortfolios();

  const deleteMutation = useDeleteAIInsight();
  const portfolioGenerateMutation = useGeneratePortfolioAIInsight();
  const stockGenerateMutation = useGenerateStockAIInsight();

  const activePortfolioId = selectedPortfolioId || portfolios[0]?.id || "";

  const selectedPortfolio = portfolios.find(
    (portfolio) => portfolio.id === activePortfolioId,
  );

  const isGeneratingPortfolio = portfolioGenerateMutation.isPending;
  const isGeneratingStock = stockGenerateMutation.isPending;

  const isGenerating = isGeneratingPortfolio || isGeneratingStock;

  const generationError =
    generationMode === "portfolio"
      ? portfolioGenerateMutation.error
      : stockGenerateMutation.error;

  const hasGenerationError =
    generationMode === "portfolio"
      ? portfolioGenerateMutation.isError
      : stockGenerateMutation.isError;

  const canGeneratePortfolioInsight =
    typeof activePortfolioId === "number" &&
    activePortfolioId > 0 &&
    !portfoliosLoading;

  const canGenerateStockInsight = selectedStockSymbol.trim().length > 0;

  const canGenerate =
    generationMode === "portfolio"
      ? canGeneratePortfolioInsight
      : canGenerateStockInsight;

  const handleGenerationModeChange = (mode: InsightGenerationMode) => {
    if (isGenerating) {
      return;
    }

    setGenerationMode(mode);
    setGenerationSuccessMessage("");

    portfolioGenerateMutation.reset();
    stockGenerateMutation.reset();
  };

  const handlePortfolioChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const portfolioId = Number(event.target.value);

    setSelectedPortfolioId(
      Number.isInteger(portfolioId) && portfolioId > 0 ? portfolioId : "",
    );

    setGenerationSuccessMessage("");
    portfolioGenerateMutation.reset();
  };

  const handleStockSelect = (stock: StockSearchResult) => {
    const symbol = stock.symbol.trim().toUpperCase();

    setSelectedStockSymbol(symbol);
    setSelectedStockName(stock.company_name);
    setGenerationSuccessMessage("");

    stockGenerateMutation.reset();
  };

  const handleStockSymbolSubmit = (symbol: string) => {
    const normalizedSymbol = symbol.trim().toUpperCase();

    setSelectedStockSymbol(normalizedSymbol);
    setSelectedStockName("");
    setGenerationSuccessMessage("");

    stockGenerateMutation.reset();
  };

  const handleGenerateInsight = async () => {
    if (!canGenerate || isGenerating) {
      return;
    }

    setGenerationSuccessMessage("");

    try {
      if (generationMode === "portfolio") {
        if (typeof activePortfolioId !== "number") {
          return;
        }

        await portfolioGenerateMutation.mutateAsync({
          portfolioId: activePortfolioId,
        });

        setGenerationSuccessMessage(
          `${selectedPortfolio?.name ?? "Portfolio"} insight generated successfully.`,
        );

        return;
      }

      const symbol = selectedStockSymbol.trim().toUpperCase();

      if (!symbol) {
        return;
      }

      await stockGenerateMutation.mutateAsync({
        symbol,
      });

      setGenerationSuccessMessage(`${symbol} insight generated successfully.`);
    } catch (generationError) {
      console.error("Failed to generate AI insight:", generationError);
    }
  };

  const handleDeleteRequest = (insightId: number) => {
    if (deleteMutation.isPending) {
      return;
    }

    setInsightIdToDelete(insightId);
  };

  const handleCloseDeleteModal = () => {
    if (deleteMutation.isPending) {
      return;
    }

    setInsightIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (insightIdToDelete === null || deleteMutation.isPending) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(insightIdToDelete);

      setInsightIdToDelete(null);
    } catch (deleteError) {
      console.error("Failed to delete AI insight:", deleteError);
    }
  };

  return (
    <section className="insights-page">
      <header className="insights-header">
        <div>
          <p className="page-eyebrow">Artificial Intelligence</p>

          <h1>AI Insights</h1>

          <p className="insights-description">
            Generate and review general, market, stock, portfolio, watchlist,
            news, and earnings insights.
          </p>
        </div>

        {isFetching && !isLoading && (
          <span className="insights-updating" role="status">
            Updating insights...
          </span>
        )}
      </header>

      <article
        className="
          flex
          w-full
          min-w-0
          flex-col
          gap-5
          rounded-[18px]
          border
          border-white/10
          bg-(--bg-primary)
          p-4
        "
      >
        <div>
          <p className="page-eyebrow">Generate Analysis</p>

          <h2 className="mt-1 text-xl font-extrabold text-(--text-primary)">
            Generate AI Insight
          </h2>

          <p className="mt-2 max-w-3xl leading-6 text-(--text-secondary)">
            Choose a portfolio or stock and generate a new AI-powered analysis.
            Generated insights are saved automatically.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-2
            rounded-xl
            bg-(--bg-secondary)
            p-1
            sm:w-fit
            sm:min-w-80
          "
          role="tablist"
          aria-label="AI insight type"
        >
          <button
            type="button"
            role="tab"
            aria-selected={generationMode === "portfolio"}
            className={
              generationMode === "portfolio"
                ? "bg-(--accent-primary) text-white"
                : "bg-transparent text-(--text-secondary)"
            }
            disabled={isGenerating}
            onClick={() => handleGenerationModeChange("portfolio")}
          >
            Portfolio
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={generationMode === "stock"}
            className={
              generationMode === "stock"
                ? "bg-(--accent-primary) text-white"
                : "bg-transparent text-(--text-secondary)"
            }
            disabled={isGenerating}
            onClick={() => handleGenerationModeChange("stock")}
          >
            Stock
          </button>
        </div>

        {generationMode === "portfolio" && (
          <div className="flex max-w-xl flex-col gap-2">
            <label
              htmlFor="insight-portfolio"
              className="font-bold text-(--text-primary)"
            >
              Portfolio
            </label>

            {portfoliosLoading && (
              <p className="metric-label" role="status">
                Loading portfolios...
              </p>
            )}

            {!portfoliosLoading && portfoliosError && (
              <p className="negative" role="alert">
                {getErrorMessage(portfoliosErrorData)}
              </p>
            )}

            {!portfoliosLoading &&
              !portfoliosError &&
              portfolios.length === 0 && (
                <p className="text-(--text-secondary)">
                  Create a portfolio before generating a portfolio insight.
                </p>
              )}

            {!portfoliosLoading &&
              !portfoliosError &&
              portfolios.length > 0 && (
                <select
                  id="insight-portfolio"
                  value={activePortfolioId}
                  disabled={isGenerating}
                  onChange={handlePortfolioChange}
                  className="
                    min-h-11
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-(--bg-secondary)
                    px-3
                    text-(--text-primary)
                    outline-none
                    focus:border-(--accent-primary)
                  "
                >
                  {portfolios.map((portfolio) => (
                    <option key={portfolio.id} value={portfolio.id}>
                      {portfolio.name} ({portfolio.currency})
                    </option>
                  ))}
                </select>
              )}
          </div>
        )}

        {generationMode === "stock" && (
          <div className="flex max-w-2xl flex-col gap-3">
            <div>
              <p className="font-bold text-(--text-primary)">Stock</p>

              <p className="mt-1 text-sm text-(--text-secondary)">
                Search by company name or ticker symbol.
              </p>
            </div>

            <StockSearchInput
              placeholder="Search Apple, Microsoft, AAPL..."
              onSelect={handleStockSelect}
              onSymbolSubmit={handleStockSymbolSubmit}
            />

            {selectedStockSymbol && (
              <div
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-(--bg-secondary)
                  px-4
                  py-3
                "
              >
                <p className="text-sm text-(--text-secondary)">
                  Selected stock
                </p>

                <p className="font-bold text-(--text-primary)">
                  {selectedStockSymbol}
                  {selectedStockName ? ` — ${selectedStockName}` : ""}
                </p>
              </div>
            )}
          </div>
        )}

        {hasGenerationError && (
          <p className="negative" role="alert">
            {getErrorMessage(generationError)}
          </p>
        )}

        {generationSuccessMessage && (
          <p className="positive" role="status">
            {generationSuccessMessage}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!canGenerate || isGenerating}
            onClick={handleGenerateInsight}
          >
            {isGenerating
              ? "Generating insight..."
              : generationMode === "portfolio"
                ? "Generate portfolio insight"
                : "Generate stock insight"}
          </button>

          {generationMode === "stock" && !selectedStockSymbol && (
            <span className="metric-label">
              Select or enter a stock before generating.
            </span>
          )}
        </div>
      </article>

      {isLoading && <LoadingCard title="Loading insights..." />}

      {!isLoading && isError && (
        <div className="insights-error-state">
          <ErrorCard message={getErrorMessage(error)} />

          <button
            type="button"
            onClick={() => refetch()}
            className="insights-retry-button"
          >
            Try Again
          </button>
        </div>
      )}

      {deleteMutation.isError && (
        <ErrorCard message={getErrorMessage(deleteMutation.error)} />
      )}

      {!isLoading && !isError && insights.length === 0 && (
        <EmptyCard
          title="No AI insights"
          message="Generate a portfolio or stock insight to get started."
        />
      )}

      {!isLoading && !isError && insights.length > 0 && (
        <div className="insights-grid">
          {insights.map((insight) => {
            const isDeleting =
              deleteMutation.isPending &&
              deleteMutation.variables === insight.id;

            return (
              <InsightCard
                key={insight.id}
                insight={insight}
                isDeleting={isDeleting}
                onDelete={handleDeleteRequest}
              />
            );
          })}
        </div>
      )}

      <p className="ai-disclaimer">
        AI-generated information is for educational purposes only and is not
        financial advice.
      </p>

      <DeleteInsightModal
        isOpen={insightIdToDelete !== null}
        isDeleting={deleteMutation.isPending}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
};

export default Insights;
