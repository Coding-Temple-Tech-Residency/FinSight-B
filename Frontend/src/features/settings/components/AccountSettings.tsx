import { useNavigate } from "react-router-dom";

import { useDeleteAccount } from "../hooks/useDeleteAccount";

const AccountSettings = () => {
  const navigate = useNavigate();
  const deleteMutation = useDeleteAccount();

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Delete your FinSight account? This action cannot be undone.",
    );

    if (!confirmed) return;

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/", { replace: true });
      },
    });
  };

  return (
    <article className="settings-card danger-zone">
      <div className="settings-card-header">
        <div>
          <h2>Delete Account</h2>

          <p>Permanently delete your profile and associated account data.</p>
        </div>
      </div>

      {deleteMutation.isError && (
        <p className="negative">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Unable to delete account."}
        </p>
      )}

      <button
        type="button"
        onClick={handleDeleteAccount}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "Deleting Account..." : "Delete Account"}
      </button>
    </article>
  );
};

export default AccountSettings;
