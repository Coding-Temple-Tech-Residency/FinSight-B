import { useMemo, useState } from "react";

import EmptyCard from "../../../components/ui/EmptyCard";
import ErrorCard from "../../../components/ui/ErrorCard";
import LoadingCard from "../../../components/ui/LoadingCard";

import { useModal } from "../../../hooks/useModal";

import HoldingFormModal from "../components/HoldingFormModal";
import HoldingsTable from "../components/HoldingsTable";
import PortfolioFormModal from "../components/PortfolioFormModal";

import {
  useCreateHolding,
  useDeleteHolding,
  useHoldings,
  useUpdateHolding,
} from "../hooks/useHoldings";

import {
  useCreatePortfolio,
  useDeletePortfolio,
  usePortfolios,
  useUpdatePortfolio,
} from "../hooks/usePortfolio";

import type { CreateHoldingPayload, Holding } from "../types/holdings";

type PortfolioFormMode = "create" | "edit";

const formatDate = (date: string | undefined) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatCurrency = (value: number | null, currency = "USD") => {
  if (value === null || !Number.isFinite(value)) {
    return "Unavailable";
  }

  return value.toLocaleString("en-US", {
    style: "currency",
    currency,
  });
};

const getMutationError = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to complete the request.";
};

const Portfolio = () => {
  const { openModal, closeModal } = useModal();

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<
    number | undefined
  >();

  const [portfolioFormMode, setPortfolioFormMode] =
    useState<PortfolioFormMode>("create");

  const [editingHolding, setEditingHolding] = useState<Holding | undefined>();

  const {
    data: portfolios = [],
    isLoading: portfoliosLoading,
    isError: portfoliosError,
    error: portfoliosErrorData,
  } = usePortfolios();

  const activePortfolioId = selectedPortfolioId ?? portfolios[0]?.id;

  const selectedPortfolio = portfolios.find(
    (portfolio) => portfolio.id === activePortfolioId,
  );

  const {
    data: holdings = [],
    isLoading: holdingsLoading,
    isError: holdingsError,
    error: holdingsErrorData,
  } = useHoldings(activePortfolioId);

  const createPortfolioMutation = useCreatePortfolio();
  const updatePortfolioMutation = useUpdatePortfolio();
  const deletePortfolioMutation = useDeletePortfolio();

  const createHoldingMutation = useCreateHolding(activePortfolioId);
  const updateHoldingMutation = useUpdateHolding(activePortfolioId);
  const deleteHoldingMutation = useDeleteHolding(activePortfolioId);

  const totals = useMemo(() => {
    return holdings.reduce(
      (summary, holding) => {
        const shares = Number(holding.shares);
        const averageBuyPrice = Number(holding.average_buy_price);

        const latestPrice =
          holding.latest_price === null ? null : Number(holding.latest_price);

        const hasValidShares = Number.isFinite(shares);
        const hasValidAveragePrice = Number.isFinite(averageBuyPrice);
        const hasValidLatestPrice =
          latestPrice !== null && Number.isFinite(latestPrice);

        const costBasis =
          hasValidShares && hasValidAveragePrice ? shares * averageBuyPrice : 0;

        const marketValue =
          hasValidShares && hasValidLatestPrice && latestPrice !== null
            ? shares * latestPrice
            : null;

        const gainLoss = marketValue === null ? null : marketValue - costBasis;

        return {
          costBasis: summary.costBasis + costBasis,

          marketValue:
            marketValue === null
              ? summary.marketValue
              : summary.marketValue + marketValue,

          gainLoss:
            gainLoss === null ? summary.gainLoss : summary.gainLoss + gainLoss,

          pricedHoldings:
            marketValue === null
              ? summary.pricedHoldings
              : summary.pricedHoldings + 1,
        };
      },
      {
        costBasis: 0,
        marketValue: 0,
        gainLoss: 0,
        pricedHoldings: 0,
      },
    );
  }, [holdings]);

  const allHoldingsHavePrices =
    holdings.length > 0 && totals.pricedHoldings === holdings.length;

  const gainLossPercent =
    allHoldingsHavePrices && totals.costBasis > 0
      ? (totals.gainLoss / totals.costBasis) * 100
      : null;

  const openCreatePortfolioModal = () => {
    createPortfolioMutation.reset();
    setPortfolioFormMode("create");
    openModal("portfolio-form");
  };

  const openRenamePortfolioModal = () => {
    if (!selectedPortfolio) return;

    updatePortfolioMutation.reset();
    setPortfolioFormMode("edit");
    openModal("portfolio-form");
  };

  const handlePortfolioSubmit = (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    if (portfolioFormMode === "create") {
      createPortfolioMutation.mutate(
        {
          name: trimmedName,
          currency: "USD",
        },
        {
          onSuccess: (portfolio) => {
            setSelectedPortfolioId(portfolio.id);
            closeModal();
          },
        },
      );

      return;
    }

    if (!selectedPortfolio) return;

    updatePortfolioMutation.mutate(
      {
        portfolioId: selectedPortfolio.id,
        payload: {
          name: trimmedName,
        },
      },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  };

  const handleDeletePortfolio = () => {
    if (!selectedPortfolio) return;

    const confirmed = window.confirm(
      `Delete "${selectedPortfolio.name}" and all of its holdings?`,
    );

    if (!confirmed) return;

    deletePortfolioMutation.mutate(selectedPortfolio.id, {
      onSuccess: () => {
        setSelectedPortfolioId(undefined);
      },
    });
  };

  const openAddHoldingModal = () => {
    if (!activePortfolioId) return;

    createHoldingMutation.reset();
    updateHoldingMutation.reset();
    setEditingHolding(undefined);
    openModal("holding-form");
  };

  const openEditHoldingModal = (holding: Holding) => {
    if (!activePortfolioId) return;

    createHoldingMutation.reset();
    updateHoldingMutation.reset();
    setEditingHolding(holding);
    openModal("holding-form");
  };

  const handleHoldingSubmit = (payload: CreateHoldingPayload) => {
    if (!activePortfolioId) return;

    if (editingHolding) {
      updateHoldingMutation.mutate(
        {
          holdingId: editingHolding.id,
          payload: {
            shares: payload.shares,
            average_buy_price: payload.average_buy_price,
            purchased_at: payload.purchased_at,
          },
        },
        {
          onSuccess: () => {
            setEditingHolding(undefined);
            closeModal();
          },
        },
      );

      return;
    }

    createHoldingMutation.mutate(payload, {
      onSuccess: () => {
        setEditingHolding(undefined);
        closeModal();
      },
    });
  };

  const handleCloseHoldingModal = () => {
    if (createHoldingMutation.isPending || updateHoldingMutation.isPending) {
      return;
    }

    setEditingHolding(undefined);
    createHoldingMutation.reset();
    updateHoldingMutation.reset();
    closeModal();
  };

  const handleDeleteHolding = (holding: Holding) => {
    if (!activePortfolioId) return;

    const confirmed = window.confirm(
      `Remove ${holding.symbol} from "${selectedPortfolio?.name}"?`,
    );

    if (!confirmed) return;

    deleteHoldingMutation.mutate(holding.id);
  };

  const holdingMutationError = editingHolding
    ? updateHoldingMutation.isError
      ? getMutationError(updateHoldingMutation.error)
      : undefined
    : createHoldingMutation.isError
      ? getMutationError(createHoldingMutation.error)
      : undefined;

  const updatingHoldingId = updateHoldingMutation.isPending
    ? updateHoldingMutation.variables?.holdingId
    : undefined;

  const deletingHoldingId = deleteHoldingMutation.isPending
    ? deleteHoldingMutation.variables
    : undefined;

  const portfolioCurrency = selectedPortfolio?.currency ?? "USD";

  if (portfoliosLoading) {
    return <LoadingCard title="Loading portfolios..." />;
  }

  if (portfoliosError) {
    return (
      <ErrorCard
        message={
          portfoliosErrorData instanceof Error
            ? portfoliosErrorData.message
            : "Unable to load portfolios."
        }
      />
    );
  }

  return (
    <>
      <section className="portfolio-page">
        <header className="portfolio-page-header">
          <div>
            <h1>Portfolio</h1>
            <p>Create and manage your investment portfolios and holdings.</p>
          </div>

          <button
            type="button"
            onClick={openCreatePortfolioModal}
            disabled={createPortfolioMutation.isPending}
          >
            {createPortfolioMutation.isPending
              ? "Creating..."
              : "Create Portfolio"}
          </button>
        </header>

        {createPortfolioMutation.isError && (
          <ErrorCard
            message={getMutationError(createPortfolioMutation.error)}
          />
        )}

        {portfolios.length === 0 ? (
          <EmptyCard
            title="No portfolios yet"
            message="Create your first portfolio to begin organizing your investments."
            action={
              <button
                type="button"
                onClick={openCreatePortfolioModal}
                disabled={createPortfolioMutation.isPending}
              >
                Create Portfolio
              </button>
            }
          />
        ) : (
          <>
            <section className="portfolio-toolbar">
              <div className="portfolio-selector-group">
                <label htmlFor="portfolio-selector">Portfolio</label>

                <select
                  id="portfolio-selector"
                  value={activePortfolioId ?? ""}
                  onChange={(event) => {
                    const portfolioId = Number(event.target.value);

                    setSelectedPortfolioId(portfolioId);
                    setEditingHolding(undefined);
                  }}
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
                  onClick={openRenamePortfolioModal}
                  disabled={
                    !selectedPortfolio || updatePortfolioMutation.isPending
                  }
                >
                  {updatePortfolioMutation.isPending ? "Saving..." : "Rename"}
                </button>

                <button
                  type="button"
                  className="danger-button"
                  onClick={handleDeletePortfolio}
                  disabled={
                    !selectedPortfolio || deletePortfolioMutation.isPending
                  }
                >
                  {deletePortfolioMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </section>

            {updatePortfolioMutation.isError && (
              <ErrorCard
                message={getMutationError(updatePortfolioMutation.error)}
              />
            )}

            {deletePortfolioMutation.isError && (
              <ErrorCard
                message={getMutationError(deletePortfolioMutation.error)}
              />
            )}

            {selectedPortfolio && (
              <>
                <section className="summary-cards">
                  <article className="card">
                    <p className="metric-label">Portfolio Value</p>

                    <h2 className="metric-value">
                      {holdingsLoading
                        ? "Loading..."
                        : allHoldingsHavePrices
                          ? formatCurrency(
                              totals.marketValue,
                              portfolioCurrency,
                            )
                          : holdings.length === 0
                            ? formatCurrency(0, portfolioCurrency)
                            : "Unavailable"}
                    </h2>

                    {!holdingsLoading &&
                      holdings.length > 0 &&
                      !allHoldingsHavePrices && (
                        <p className="metric-label">
                          One or more holdings are missing a latest price.
                        </p>
                      )}
                  </article>

                  <article className="card">
                    <p className="metric-label">Total Cost Basis</p>

                    <h2 className="metric-value">
                      {holdingsLoading
                        ? "Loading..."
                        : formatCurrency(totals.costBasis, portfolioCurrency)}
                    </h2>
                  </article>

                  <article className="card">
                    <p className="metric-label">Total Gain/Loss</p>

                    <h2
                      className={`metric-value ${
                        gainLossPercent === null
                          ? ""
                          : totals.gainLoss >= 0
                            ? "portfolio-positive"
                            : "portfolio-negative"
                      }`}
                    >
                      {holdingsLoading
                        ? "Loading..."
                        : allHoldingsHavePrices
                          ? formatCurrency(totals.gainLoss, portfolioCurrency)
                          : holdings.length === 0
                            ? formatCurrency(0, portfolioCurrency)
                            : "Unavailable"}
                    </h2>

                    {gainLossPercent !== null && (
                      <p
                        className={
                          gainLossPercent >= 0
                            ? "portfolio-positive"
                            : "portfolio-negative"
                        }
                      >
                        {gainLossPercent >= 0 ? "+" : ""}
                        {gainLossPercent.toFixed(2)}%
                      </p>
                    )}
                  </article>

                  <article className="card">
                    <p className="metric-label">Holdings</p>

                    <h2 className="metric-value">
                      {holdingsLoading ? "Loading..." : holdings.length}
                    </h2>
                  </article>
                </section>

                <section className="portfolio-details-card">
                  <div className="card-header">
                    <h2>Portfolio Details</h2>
                  </div>

                  <dl className="portfolio-details-list">
                    <div>
                      <dt>Name</dt>
                      <dd>{selectedPortfolio.name}</dd>
                    </div>

                    <div>
                      <dt>Description</dt>
                      <dd>
                        {selectedPortfolio.description ||
                          "No description has been added."}
                      </dd>
                    </div>

                    <div>
                      <dt>Currency</dt>
                      <dd>{selectedPortfolio.currency}</dd>
                    </div>

                    <div>
                      <dt>Created</dt>
                      <dd>{formatDate(selectedPortfolio.created_at)}</dd>
                    </div>

                    <div>
                      <dt>Last updated</dt>
                      <dd>{formatDate(selectedPortfolio.updated_at)}</dd>
                    </div>
                  </dl>
                </section>

                <section className="holdings-section">
                  <div className="holdings-header">
                    <div>
                      <h2>Holdings</h2>

                      <p>Track the stocks held in {selectedPortfolio.name}.</p>
                    </div>

                    <button
                      type="button"
                      onClick={openAddHoldingModal}
                      disabled={
                        !activePortfolioId || createHoldingMutation.isPending
                      }
                    >
                      {createHoldingMutation.isPending
                        ? "Adding..."
                        : "Add Holding"}
                    </button>
                  </div>

                  {holdingsLoading && (
                    <LoadingCard title="Loading holdings..." />
                  )}

                  {holdingsError && (
                    <ErrorCard
                      message={
                        holdingsErrorData instanceof Error
                          ? holdingsErrorData.message
                          : "Unable to load holdings."
                      }
                    />
                  )}

                  {deleteHoldingMutation.isError && (
                    <ErrorCard
                      message={getMutationError(deleteHoldingMutation.error)}
                    />
                  )}

                  {!holdingsLoading &&
                    !holdingsError &&
                    holdings.length === 0 && (
                      <EmptyCard
                        title="No holdings yet"
                        message="Add your first stock holding to begin tracking this portfolio."
                        action={
                          <button
                            type="button"
                            onClick={openAddHoldingModal}
                            disabled={createHoldingMutation.isPending}
                          >
                            Add Holding
                          </button>
                        }
                      />
                    )}

                  {!holdingsLoading &&
                    !holdingsError &&
                    holdings.length > 0 && (
                      <HoldingsTable
                        holdings={holdings}
                        updatingHoldingId={updatingHoldingId}
                        deletingHoldingId={deletingHoldingId}
                        onEdit={openEditHoldingModal}
                        onDelete={handleDeleteHolding}
                      />
                    )}
                </section>
              </>
            )}
          </>
        )}
      </section>

      <PortfolioFormModal
        mode={portfolioFormMode}
        initialName={
          portfolioFormMode === "edit" ? selectedPortfolio?.name : ""
        }
        isSubmitting={
          createPortfolioMutation.isPending || updatePortfolioMutation.isPending
        }
        onSubmit={handlePortfolioSubmit}
      />

      <HoldingFormModal
        holding={editingHolding}
        isSubmitting={
          createHoldingMutation.isPending || updateHoldingMutation.isPending
        }
        mutationError={holdingMutationError}
        onSubmit={handleHoldingSubmit}
        onClose={handleCloseHoldingModal}
      />
    </>
  );
};

export default Portfolio;
