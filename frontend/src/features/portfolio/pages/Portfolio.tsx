import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import EmptyCard from "../../../components/ui/EmptyCard";
import ErrorCard from "../../../components/ui/ErrorCard";
import LoadingCard from "../../../components/ui/LoadingCard";

import { useModal } from "../../../hooks/useModal";

import HoldingFormModal from "../components/HoldingFormModal";
import HoldingsTable from "../components/HoldingsTable";
import PortfolioAllocation from "../components/PortfolioAllocation";
import PortfolioAnalytics from "../components/PortfolioAnalytics";
import PortfolioFormModal from "../components/PortfolioFormModal";
import type { PortfolioFormValues } from "../components/PortfolioForm";
import PortfolioSummary from "../components/PortfolioSummary";

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

import AIInsightCard from "../../dashboard/components/AIInsightCard";

import "../styles/portfolio.css";

type PortfolioFormMode = "create" | "edit";

const getMutationError = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to complete the request.";
};

const getValidPortfolioId = (value: string | null): number | undefined => {
  if (!value) {
    return undefined;
  }

  const portfolioId = Number(value);

  if (!Number.isInteger(portfolioId) || portfolioId <= 0) {
    return undefined;
  }

  return portfolioId;
};

const Portfolio = () => {
  const { openModal, closeModal } = useModal();

  const [searchParams, setSearchParams] = useSearchParams();

  const portfolioIdFromUrl = getValidPortfolioId(searchParams.get("portfolio"));

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<
    number | undefined
  >(portfolioIdFromUrl);

  const [portfolioFormMode, setPortfolioFormMode] =
    useState<PortfolioFormMode>("create");

  const [editingHolding, setEditingHolding] = useState<Holding | undefined>();

  const {
    data: portfolios = [],
    isLoading: portfoliosLoading,
    isError: portfoliosError,
    error: portfoliosErrorData,
  } = usePortfolios();

  const requestedPortfolioExists = portfolios.some(
    (portfolio) => portfolio.id === portfolioIdFromUrl,
  );

  const selectedPortfolioExists = portfolios.some(
    (portfolio) => portfolio.id === selectedPortfolioId,
  );

  const activePortfolioId = requestedPortfolioExists
    ? portfolioIdFromUrl
    : selectedPortfolioExists
      ? selectedPortfolioId
      : portfolios[0]?.id;

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

  const updatePortfolioUrl = (portfolioId?: number) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);

        if (portfolioId) {
          nextParams.set("portfolio", String(portfolioId));
        } else {
          nextParams.delete("portfolio");
        }

        return nextParams;
      },
      {
        replace: true,
      },
    );
  };

  const openCreatePortfolioModal = () => {
    createPortfolioMutation.reset();
    setPortfolioFormMode("create");
    openModal("portfolio-form");
  };

  const openRenamePortfolioModal = () => {
    if (!selectedPortfolio) {
      return;
    }

    updatePortfolioMutation.reset();
    setPortfolioFormMode("edit");
    openModal("portfolio-form");
  };

  const handlePortfolioSubmit = ({
    name,
    description,
    currency,
  }: PortfolioFormValues) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    if (portfolioFormMode === "create") {
      createPortfolioMutation.mutate(
        {
          name: trimmedName,
          description,
          currency,
        },
        {
          onSuccess: (portfolio) => {
            setSelectedPortfolioId(portfolio.id);
            updatePortfolioUrl(portfolio.id);
            closeModal();
          },
        },
      );

      return;
    }

    if (!selectedPortfolio) {
      return;
    }

    updatePortfolioMutation.mutate(
      {
        portfolioId: selectedPortfolio.id,
        payload: {
          name: trimmedName,
          description,
          currency,
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
    if (!selectedPortfolio) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${selectedPortfolio.name}" and all of its holdings?`,
    );

    if (!confirmed) {
      return;
    }

    deletePortfolioMutation.mutate(selectedPortfolio.id, {
      onSuccess: () => {
        setSelectedPortfolioId(undefined);
        updatePortfolioUrl();
      },
    });
  };

  const handlePortfolioChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const portfolioId = Number(event.target.value);

    if (!Number.isInteger(portfolioId) || portfolioId <= 0) {
      return;
    }

    setSelectedPortfolioId(portfolioId);
    setEditingHolding(undefined);
    updatePortfolioUrl(portfolioId);
  };

  const openAddHoldingModal = () => {
    if (!activePortfolioId) {
      return;
    }

    createHoldingMutation.reset();
    updateHoldingMutation.reset();
    setEditingHolding(undefined);
    openModal("holding-form");
  };

  const openEditHoldingModal = (holding: Holding) => {
    if (!activePortfolioId) {
      return;
    }

    createHoldingMutation.reset();
    updateHoldingMutation.reset();
    setEditingHolding(holding);
    openModal("holding-form");
  };

  const handleHoldingSubmit = (payload: CreateHoldingPayload) => {
    if (!activePortfolioId) {
      return;
    }

    if (editingHolding) {
      updateHoldingMutation.mutate(
        {
          holdingId: editingHolding.id,
          payload: {
            shares: payload.shares,
            average_buy_price: payload.average_buy_price,
            purchase_currency: payload.purchase_currency,
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
    if (!activePortfolioId) {
      return;
    }

    const confirmed = window.confirm(
      `Remove ${holding.symbol} from "${selectedPortfolio?.name}"?`,
    );

    if (!confirmed) {
      return;
    }

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
                  onChange={handlePortfolioChange}
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
                <PortfolioSummary
                  portfolio={selectedPortfolio}
                  holdings={holdings}
                  isLoading={holdingsLoading}
                />

                <PortfolioAnalytics
                  holdings={holdings}
                  isLoading={holdingsLoading}
                />

                <section
                  className="portfolio-overview-grid"
                  aria-label={`${selectedPortfolio.name} portfolio overview`}
                >
                  <PortfolioAllocation
                    holdings={holdings}
                    portfolioCurrency={selectedPortfolio.currency}
                    isLoading={holdingsLoading}
                  />

                  <AIInsightCard
                    portfolioId={selectedPortfolio.id}
                    portfolioLoading={holdingsLoading}
                  />
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
        initialDescription={
          portfolioFormMode === "edit" ? selectedPortfolio?.description : ""
        }
        initialCurrency={
          portfolioFormMode === "edit" ? selectedPortfolio?.currency : "USD"
        }
        isSubmitting={
          createPortfolioMutation.isPending || updatePortfolioMutation.isPending
        }
        mutationError={
          portfolioFormMode === "create"
            ? createPortfolioMutation.isError
              ? getMutationError(createPortfolioMutation.error)
              : undefined
            : updatePortfolioMutation.isError
              ? getMutationError(updatePortfolioMutation.error)
              : undefined
        }
        onSubmit={handlePortfolioSubmit}
      />

      <HoldingFormModal
        holding={editingHolding}
        defaultCurrency={selectedPortfolio?.currency ?? "USD"}
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
