import Modal from "../../../components/ui/Modal";

type DeletePortfolioDialogProps = {
  isOpen: boolean;
  portfolioName?: string;
  isDeleting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onConfirm: () => void;
};

const DeletePortfolioDialog = ({
  isOpen,
  portfolioName,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeletePortfolioDialogProps) => {
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
      title="Delete Portfolio"
      onClose={handleClose}
      panelClassName="delete-portfolio-modal-panel"
    >
      <div className="delete-portfolio-dialog">
        <div className="delete-portfolio-warning">
          <p>
            Are you sure you want to delete{" "}
            <strong>
              {portfolioName ? `"${portfolioName}"` : "this portfolio"}
            </strong>
            ?
          </p>

          <p className="metric-label">
            The portfolio and all holdings connected to it will be permanently
            removed. This action cannot be undone.
          </p>
        </div>

        {errorMessage && (
          <p className="negative" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="delete-portfolio-dialog-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Portfolio"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeletePortfolioDialog;
