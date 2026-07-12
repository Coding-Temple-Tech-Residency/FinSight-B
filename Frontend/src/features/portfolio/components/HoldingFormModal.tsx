import ModalPanel from "../../../components/ui/ModalPanel";
import { useModal } from "../../../hooks/useModal";

import HoldingForm from "./HoldingForm";

import type { CreateHoldingPayload, Holding } from "../types/holdings";

type HoldingFormModalProps = {
  holding?: Holding;
  isSubmitting: boolean;
  onSubmit: (payload: CreateHoldingPayload) => void;
  onClose?: () => void;
};

const HoldingFormModal = ({
  holding,
  isSubmitting,
  onSubmit,
  onClose,
}: HoldingFormModalProps) => {
  const { closeModal, isModalOpen } = useModal();

  if (!isModalOpen("holding-form")) {
    return null;
  }

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    closeModal();
  };

  return (
    <ModalPanel
      title={holding ? "Edit Holding" : "Add Holding"}
      onClose={handleClose}
    >
      <HoldingForm
        key={holding?.id ?? "new-holding"}
        holding={holding}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onCancel={handleClose}
      />
    </ModalPanel>
  );
};

export default HoldingFormModal;
