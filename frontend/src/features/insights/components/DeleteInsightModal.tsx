import Modal from "../../../components/ui/Modal";

type DeleteInsightModalProps = {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteInsightModal = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteInsightModalProps) => {
  const handleClose = () => {
    if (isDeleting) {
      return;
    }

    onClose();
  };

  const handleConfirm = () => {
    if (isDeleting) {
      return;
    }

    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Delete AI Insight"
      onClose={handleClose}
      panelClassName="delete-insight-modal-panel"
    >
      <div className="delete-insight-modal">
        <p>Are you sure you want to delete this AI insight?</p>

        <p className="metric-label">This action cannot be undone.</p>

        <div className="delete-insight-actions">
          <button
            type="button"
            className="delete-insight-cancel"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-insight-confirm"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete insight"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteInsightModal;
