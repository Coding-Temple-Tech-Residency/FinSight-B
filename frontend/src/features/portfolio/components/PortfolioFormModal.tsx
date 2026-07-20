import Modal from "../../../components/ui/Modal";
import { useModal } from "../../../hooks/useModal";

import PortfolioForm from "./PortfolioForm";

type PortfolioFormModalProps = {
  mode: "create" | "edit";
  initialName?: string;
  isSubmitting: boolean;
  onSubmit: (name: string) => void;
};

const PortfolioFormModal = ({
  mode,
  initialName = "",
  isSubmitting,
  onSubmit,
}: PortfolioFormModalProps) => {
  const { closeModal, isModalOpen } = useModal();

  return (
    <Modal
      isOpen={isModalOpen("portfolio-form")}
      title={mode === "create" ? "Create Portfolio" : "Rename Portfolio"}
      onClose={closeModal}
    >
      <PortfolioForm
        key={`${mode}-${initialName}`}
        initialName={initialName}
        submitLabel={mode === "create" ? "Create Portfolio" : "Save Changes"}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onCancel={closeModal}
      />
    </Modal>
  );
};

export default PortfolioFormModal;
