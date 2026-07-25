import Modal from "../../../components/ui/Modal";
import { useModal } from "../../../hooks/useModal";

import HoldingForm from "./HoldingForm";

import type { CreateHoldingPayload, Holding } from "../types/holdings";

type HoldingFormModalProps = {
  holding?: Holding;
  defaultCurrency?: string;
  isSubmitting: boolean;
  mutationError?: string;
  onSubmit: (payload: CreateHoldingPayload) => void;
  onClose?: () => void;
};

const HoldingFormModal = ({
  holding,
  defaultCurrency = "USD",
  isSubmitting,
  mutationError,
  onSubmit,
  onClose,
}: HoldingFormModalProps) => {
  const { closeModal, isModalOpen } = useModal();

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    if (onClose) {
      onClose();
      return;
    }

    closeModal();
  };

  return (
    <Modal
      isOpen={isModalOpen("holding-form")}
      title={holding ? `Edit ${holding.symbol}` : "Add Holding"}
      onClose={handleClose}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <HoldingForm
        key={holding?.id ?? "new-holding"}
        holding={holding}
        defaultCurrency={defaultCurrency}
        isSubmitting={isSubmitting}
        mutationError={mutationError}
        onSubmit={onSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
};

export default HoldingFormModal;
