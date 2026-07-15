import ModalPanel from "../../../components/ui/ModalPanel";
import { useModal } from "../../../hooks/useModal";

import HoldingForm from "./HoldingForm";

import type { CreateHoldingPayload, Holding } from "../types/holdings";

type HoldingFormModalProps = {
  holding?: Holding;
  isSubmitting: boolean;
  mutationError?: string;
  onSubmit: (payload: CreateHoldingPayload) => void;
  onClose?: () => void;
};

const HoldingFormModal = ({
  holding,
  isSubmitting,
  mutationError,
  onSubmit,
  onClose,
}: HoldingFormModalProps) => {
  const { closeModal, isModalOpen } = useModal();

  if (!isModalOpen("holding-form")) {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting) return;

    if (onClose) {
      onClose();
      return;
    }

    closeModal();
  };

  return (
    <ModalPanel
      title={holding ? `Edit ${holding.symbol}` : "Add Holding"}
      onClose={handleClose}
    >
      <HoldingForm
        key={holding?.id ?? "new-holding"}
        holding={holding}
        isSubmitting={isSubmitting}
        mutationError={mutationError}
        onSubmit={onSubmit}
        onCancel={handleClose}
      />
    </ModalPanel>
  );
};

export default HoldingFormModal;
