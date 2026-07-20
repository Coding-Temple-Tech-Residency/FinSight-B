import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import Modal from "../../../components/ui/Modal";

import type { AIInsight } from "../types/ai";

import {
  formatInsightDate,
  getInsightTypeLabel,
  getSentimentLabel,
} from "../utils/insightFormatting";

type InsightCardProps = {
  insight: AIInsight;
  isDeleting: boolean;
  onDelete: (insightId: number) => void;
};

const InsightCard = ({ insight, isDeleting, onDelete }: InsightCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const insightTypeLabel = getInsightTypeLabel(insight.insight_type);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteRequest = () => {
    if (isDeleting) {
      return;
    }

    onDelete(insight.id);
  };

  const handleModalDeleteRequest = () => {
    if (isDeleting) {
      return;
    }

    setIsModalOpen(false);
    onDelete(insight.id);
  };

  return (
    <>
      <article className="insights-card">
        <div className="card-header">
          <div>
            <p className="page-eyebrow">Artificial Intelligence</p>

            <h2>{insightTypeLabel}</h2>
          </div>

          <div className="insight-header-actions">
            {insight.sentiment && (
              <span
                className={`insight-sentiment insight-sentiment-${insight.sentiment}`}
              >
                {getSentimentLabel(insight.sentiment)}
              </span>
            )}

            <button
              type="button"
              className="insight-delete-icon-button"
              onClick={handleDeleteRequest}
              disabled={isDeleting}
              aria-label={`Delete ${insightTypeLabel}`}
              title="Delete insight"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        <div className="insight-preview">
          <p>{insight.summary}</p>
        </div>

        <button
          type="button"
          className="insight-read-more"
          onClick={openModal}
          aria-haspopup="dialog"
        >
          Read full insight
        </button>

        <div className="insight-meta">
          <span className="metric-label">
            {formatInsightDate(insight.created_at)}
          </span>

          {insight.source && (
            <span className="metric-label">Source: {insight.source}</span>
          )}
        </div>

        {isDeleting && (
          <p className="metric-label insight-generation-error" role="status">
            Deleting insight...
          </p>
        )}
      </article>

      <Modal
        isOpen={isModalOpen}
        title={insightTypeLabel}
        onClose={closeModal}
        panelClassName="insight-modal-panel"
      >
        <article className="insight-modal-body">
          <div className="insight-modal-meta">
            {insight.sentiment && (
              <span
                className={`insight-sentiment insight-sentiment-${insight.sentiment}`}
              >
                {getSentimentLabel(insight.sentiment)}
              </span>
            )}

            <span className="metric-label">{insightTypeLabel}</span>

            <span className="metric-label">
              {formatInsightDate(insight.created_at)}
            </span>
          </div>

          <div className="insight-modal-summary">
            <p>{insight.summary}</p>
          </div>

          {insight.source && (
            <p className="metric-label">Source: {insight.source}</p>
          )}

          <div className="insight-modal-actions">
            <button
              type="button"
              className="insight-delete-button"
              onClick={handleModalDeleteRequest}
              disabled={isDeleting}
            >
              <FontAwesomeIcon icon={faTrashCan} />

              {isDeleting ? "Deleting..." : "Delete insight"}
            </button>
          </div>
        </article>
      </Modal>
    </>
  );
};

export default InsightCard;
