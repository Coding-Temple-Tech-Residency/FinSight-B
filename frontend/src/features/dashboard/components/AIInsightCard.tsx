import { useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import Modal from "../../../components/ui/Modal";
import DeleteInsightModal from "../../insights/components/DeleteInsightModal";

import {
  useAIInsights,
  useDeleteAIInsight,
  useGeneratePortfolioAIInsight,
} from "../../insights/hooks/useAIInsights";

import {
  formatInsightDate,
  getInsightTypeLabel,
  getSentimentLabel,
} from "../../insights/utils/insightFormatting";

interface AIInsightCardProps {
  portfolioId?: number;
  portfolioLoading?: boolean;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to complete the AI insight request.";
};

const AIInsightCard = ({
  portfolioId,
  portfolioLoading = false,
}: AIInsightCardProps) => {
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: insights = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useAIInsights();

  const generateMutation = useGeneratePortfolioAIInsight();
  const deleteMutation = useDeleteAIInsight();

  const latestInsight = insights.find(
    (insight) =>
      insight.insight_type === "portfolio" &&
      insight.portfolio_id === portfolioId,
  );

  const hasValidPortfolio = typeof portfolioId === "number" && portfolioId > 0;

  const isGenerating = generateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const handleGenerateInsight = async () => {
    if (!hasValidPortfolio || isGenerating || isDeleting) {
      return;
    }

    try {
      await generateMutation.mutateAsync({
        portfolioId,
      });
    } catch (generationError) {
      console.error("Failed to generate portfolio insight:", generationError);
    }
  };

  const openInsightModal = () => {
    if (!latestInsight) {
      return;
    }

    setIsInsightModalOpen(true);
  };

  const closeInsightModal = () => {
    setIsInsightModalOpen(false);
  };

  const openDeleteModal = () => {
    if (!latestInsight || isDeleting) {
      return;
    }

    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
  };

  const openDeleteModalFromInsightModal = () => {
    if (!latestInsight || isDeleting) {
      return;
    }

    setIsInsightModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteInsight = async () => {
    if (!latestInsight || isDeleting) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(latestInsight.id);

      setIsDeleteModalOpen(false);
      setIsInsightModalOpen(false);
    } catch (deleteError) {
      console.error("Failed to delete AI insight:", deleteError);
    }
  };

  return (
    <>
      <article className="insight-card">
        <div className="card-header">
          <div>
            <h2>Portfolio AI Insight</h2>

            {isFetching && !isLoading && (
              <p className="metric-label">Updating...</p>
            )}
          </div>

          <div className="insight-header-actions">
            {latestInsight?.sentiment && (
              <span
                className={`insight-sentiment insight-sentiment-${latestInsight.sentiment}`}
              >
                {getSentimentLabel(latestInsight.sentiment)}
              </span>
            )}

            {latestInsight && (
              <button
                type="button"
                className="insight-delete-icon-button"
                onClick={openDeleteModal}
                disabled={isDeleting}
                aria-label="Delete current portfolio insight"
                title="Delete insight"
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            )}
          </div>
        </div>

        {isLoading && <p role="status">Loading portfolio insight...</p>}

        {!isLoading && isError && (
          <p className="negative" role="alert">
            {error instanceof Error
              ? error.message
              : "Unable to load AI insights."}
          </p>
        )}

        {!isLoading && !isError && !latestInsight && (
          <p>
            Generate an AI analysis for the selected portfolio to see its latest
            insight.
          </p>
        )}

        {!isLoading && !isError && latestInsight && (
          <>
            <div className="insight-preview">
              <p>{latestInsight.summary}</p>
            </div>

            <button
              type="button"
              className="insight-read-more"
              onClick={openInsightModal}
              aria-haspopup="dialog"
            >
              Read full insight
            </button>

            <div className="insight-meta">
              <span className="metric-label">
                Type:{" "}
                <strong>
                  {getInsightTypeLabel(latestInsight.insight_type)}
                </strong>
              </span>

              <span className="metric-label">
                {formatInsightDate(latestInsight.created_at)}
              </span>
            </div>

            {latestInsight.source && (
              <p className="metric-label insight-source">
                Source: {latestInsight.source}
              </p>
            )}
          </>
        )}

        {generateMutation.isError && (
          <p className="negative insight-generation-error" role="alert">
            {getErrorMessage(generateMutation.error)}
          </p>
        )}

        {deleteMutation.isError && (
          <p className="negative insight-generation-error" role="alert">
            {getErrorMessage(deleteMutation.error)}
          </p>
        )}

        <div className="insight-actions">
          <button
            type="button"
            onClick={handleGenerateInsight}
            disabled={
              !hasValidPortfolio ||
              portfolioLoading ||
              isGenerating ||
              isDeleting
            }
          >
            {isGenerating
              ? "Generating insight..."
              : latestInsight
                ? "Generate new insight"
                : "Generate portfolio insight"}
          </button>

          <Link to="/dashboard/insights">View saved insights</Link>
        </div>
      </article>

      <Modal
        isOpen={isInsightModalOpen}
        title="Portfolio AI Insight"
        onClose={closeInsightModal}
        panelClassName="insight-modal-panel"
      >
        {latestInsight && (
          <article className="insight-modal-body">
            <div className="insight-modal-meta">
              {latestInsight.sentiment && (
                <span
                  className={`insight-sentiment insight-sentiment-${latestInsight.sentiment}`}
                >
                  {getSentimentLabel(latestInsight.sentiment)}
                </span>
              )}

              <span className="metric-label">
                {getInsightTypeLabel(latestInsight.insight_type)}
              </span>

              <span className="metric-label">
                {formatInsightDate(latestInsight.created_at)}
              </span>
            </div>

            <div className="insight-modal-summary">
              <p>{latestInsight.summary}</p>
            </div>

            {latestInsight.source && (
              <p className="metric-label">Source: {latestInsight.source}</p>
            )}

            <div className="insight-modal-actions">
              <button
                type="button"
                className="insight-delete-button"
                onClick={openDeleteModalFromInsightModal}
                disabled={isDeleting}
              >
                <FontAwesomeIcon icon={faTrashCan} />

                {isDeleting ? "Deleting..." : "Delete insight"}
              </button>
            </div>
          </article>
        )}
      </Modal>

      <DeleteInsightModal
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteInsight}
      />
    </>
  );
};

export default AIInsightCard;
