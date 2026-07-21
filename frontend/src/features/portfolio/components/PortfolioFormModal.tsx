import Modal from "../../../components/ui/Modal";

import { useModal } from "../../../hooks/useModal";

import PortfolioForm, { type PortfolioFormValues } from "./PortfolioForm";

type PortfolioFormModalProps = {
  mode: "create" | "edit";
  initialName?: string;
  initialDescription?: string | null;
  isSubmitting: boolean;
  mutationError?: string;
  onSubmit: (values: PortfolioFormValues) => void;
};

const PortfolioFormModal = ({
  mode,
  initialName = "",
  initialDescription = "",
  isSubmitting,
  mutationError,
  onSubmit,
}: PortfolioFormModalProps) => {
  const { closeModal, isModalOpen } = useModal();

  const isOpen = isModalOpen("portfolio-form");
  const isCreating = mode === "create";

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={isCreating ? "Create Portfolio" : "Edit Portfolio"}
      onClose={handleClose}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <PortfolioForm
        key={[mode, initialName, initialDescription ?? ""].join("-")}
        initialName={initialName}
        initialDescription={initialDescription}
        submitLabel={isCreating ? "Create Portfolio" : "Save Changes"}
        isSubmitting={isSubmitting}
        mutationError={mutationError}
        onSubmit={onSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
};

export default PortfolioFormModal;
