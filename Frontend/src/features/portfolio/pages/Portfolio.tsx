import { useState } from "react";

import EmptyCard from "../../../components/ui/EmptyCard";
import ErrorCard from "../../../components/ui/ErrorCard";
import LoadingCard from "../../../components/ui/LoadingCard";

import { useModal } from "../../../hooks/useModal";

import PortfolioFormModal from "../components/PortfolioFormModal";

import {
  useCreatePortfolio,
  useDeletePortfolio,
  usePortfolios,
  useUpdatePortfolio,
} from "../hooks/usePortfolio";

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

const Portfolio = () => {
  const { openModal, closeModal } = useModal();

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<
    number | undefined
  >();

  const [portfolioFormMode, setPortfolioFormMode] =
    useState<PortfolioFormMode>("create");

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

  const createPortfolioMutation = useCreatePortfolio();
  const updatePortfolioMutation = useUpdatePortfolio();
  const deletePortfolioMutation = useDeletePortfolio();

  const openCreatePortfolioModal = () => {
    setPortfolioFormMode("create");
    openModal("portfolio-form");
  };

  const openRenamePortfolioModal = () => {
    if (!selectedPortfolio) return;

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

    const confirmed = window.confirm(`Delete "${selectedPortfolio.name}"?`);

    if (!confirmed) return;

    deletePortfolioMutation.mutate(selectedPortfolio.id, {
      onSuccess: () => {
        setSelectedPortfolioId(undefined);
      },
    });
  };

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
            <p>Create and manage your investment portfolios.</p>
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
            message={
              createPortfolioMutation.error instanceof Error
                ? createPortfolioMutation.error.message
                : "Unable to create portfolio."
            }
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
                message={
                  updatePortfolioMutation.error instanceof Error
                    ? updatePortfolioMutation.error.message
                    : "Unable to update portfolio."
                }
              />
            )}

            {deletePortfolioMutation.isError && (
              <ErrorCard
                message={
                  deletePortfolioMutation.error instanceof Error
                    ? deletePortfolioMutation.error.message
                    : "Unable to delete portfolio."
                }
              />
            )}

            {selectedPortfolio && (
              <>
                <section className="summary-cards">
                  <article className="card">
                    <p className="metric-label">Portfolio Name</p>

                    <h2 className="metric-value">{selectedPortfolio.name}</h2>
                  </article>

                  <article className="card">
                    <p className="metric-label">Currency</p>

                    <h2 className="metric-value">
                      {selectedPortfolio.currency}
                    </h2>
                  </article>

                  <article className="card">
                    <p className="metric-label">Created</p>

                    <h2 className="portfolio-detail-value">
                      {formatDate(selectedPortfolio.created_at)}
                    </h2>
                  </article>

                  <article className="card">
                    <p className="metric-label">Last Updated</p>

                    <h2 className="portfolio-detail-value">
                      {formatDate(selectedPortfolio.updated_at)}
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
                  </dl>
                </section>

                <section className="holdings-section">
                  <div className="holdings-header">
                    <div>
                      <h2>Holdings</h2>

                      <p>
                        Holdings management will appear here once the backend
                        endpoints are available.
                      </p>
                    </div>
                  </div>

                  <EmptyCard
                    title="Holdings API unavailable"
                    message="Portfolio holding creation, editing, removal, market value, and gain/loss require the backend holdings routes."
                  />
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
    </>
  );
};

export default Portfolio;
