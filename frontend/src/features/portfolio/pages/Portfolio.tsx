import { useState } from "react";

import EmptyCard from "../../../components/ui/EmptyCard";
import ErrorCard from "../../../components/ui/ErrorCard";
import LoadingCard from "../../../components/ui/LoadingCard";

import { useModal } from "../../../hooks/useModal";

import DeletePortfolioDialog from "../components/DeletePortfolioDialog";
import HoldingFormModal from "../components/HoldingFormModal";
import HoldingsTable from "../components/HoldingsTable";
import PortfolioFormModal from "../components/PortfolioFormModal";
import PortfolioHeader from "../components/PortfolioHeader";
import PortfolioSelector from "../components/PortfolioSelector";
import PortfolioSummary from "../components/PortfolioSummary";

import type { PortfolioFormValues } from "../components/PortfolioForm";

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

import "../styles/portfolio.css";

type PortfolioFormMode = "create" | "edit";

const getMutationError = (error: unknown): string => {
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

  const [isDeletePortfolioDialogOpen, setIsDeletePortfolioDialogOpen] =
    useState(false);

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

  const openCreatePortfolioModal = () => {
    createPortfolioMutation.reset();
    updatePortfolioMutation.reset();

    setPortfolioFormMode("create");

    openModal("portfolio-form");
  };

  const openEditPortfolioModal = () => {
    if (!selectedPortfolio) {
      return;
    }

    createPortfolioMutation.reset();
    updatePortfolioMutation.reset();

    setPortfolioFormMode("edit");

    openModal("portfolio-form");
  };

  const handlePortfolioSubmit = ({
    name,
    description,
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

    if (!selectedPortfolio) {
      return;
    }

    updatePortfolioMutation.mutate(
      {
        portfolioId: selectedPortfolio.id,

        payload: {
          name: trimmedName,
          description,
        },
      },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  };

  const handlePortfolioSelect = (portfolioId: number) => {
    setSelectedPortfolioId(portfolioId);
    setEditingHolding(undefined);

    createHoldingMutation.reset();
    updateHoldingMutation.reset();
    deleteHoldingMutation.reset();
  };

  const openDeletePortfolioDialog = () => {
    if (!selectedPortfolio) {
      return;
    }

    deletePortfolioMutation.reset();

    setIsDeletePortfolioDialogOpen(true);
  };

  const closeDeletePortfolioDialog = () => {
    if (deletePortfolioMutation.isPending) {
      return;
    }

    deletePortfolioMutation.reset();

    setIsDeletePortfolioDialogOpen(false);
  };

  const handleDeletePortfolio = () => {
    if (!selectedPortfolio || deletePortfolioMutation.isPending) {
      return;
    }

    deletePortfolioMutation.mutate(selectedPortfolio.id, {
      onSuccess: () => {
        setSelectedPortfolioId(undefined);
        setEditingHolding(undefined);

        setIsDeletePortfolioDialogOpen(false);
      },
    });
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
    if (!activePortfolioId || deleteHoldingMutation.isPending) {
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

  const portfolioFormMutationError =
    portfolioFormMode === "create"
      ? createPortfolioMutation.isError
        ? getMutationError(createPortfolioMutation.error)
        : undefined
      : updatePortfolioMutation.isError
        ? getMutationError(updatePortfolioMutation.error)
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
        <PortfolioHeader
          isCreating={createPortfolioMutation.isPending}
          onCreatePortfolio={openCreatePortfolioModal}
        />

        {createPortfolioMutation.isError && portfolioFormMode !== "create" && (
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
            <PortfolioSelector
              portfolios={portfolios}
              selectedPortfolioId={activePortfolioId}
              isUpdating={updatePortfolioMutation.isPending}
              isDeleting={deletePortfolioMutation.isPending}
              onSelect={handlePortfolioSelect}
              onEdit={openEditPortfolioModal}
              onDelete={openDeletePortfolioDialog}
            />

            {selectedPortfolio && (
              <>
                <PortfolioSummary
                  portfolio={selectedPortfolio}
                  holdings={holdings}
                  isLoading={holdingsLoading}
                />

                <section className="holdings-section">
                  <div className="holdings-header">
                    <div>
                      <p className="page-eyebrow">Assets</p>

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
        isSubmitting={
          createPortfolioMutation.isPending || updatePortfolioMutation.isPending
        }
        mutationError={portfolioFormMutationError}
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

      <DeletePortfolioDialog
        isOpen={isDeletePortfolioDialogOpen}
        portfolioName={selectedPortfolio?.name}
        isDeleting={deletePortfolioMutation.isPending}
        errorMessage={
          deletePortfolioMutation.isError
            ? getMutationError(deletePortfolioMutation.error)
            : undefined
        }
        onClose={closeDeletePortfolioDialog}
        onConfirm={handleDeletePortfolio}
      />
    </>
  );
};

export default Portfolio;
