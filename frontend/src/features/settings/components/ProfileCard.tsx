import { useState } from "react";

import ErrorCard from "../../../components/ui/ErrorCard";
import LoadingCard from "../../../components/ui/LoadingCard";

import { useUpdateUser } from "../hooks/useUpdateUser";
import { useUserProfile } from "../hooks/useUserProfile";

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isLoading, isError, error } = useUserProfile();

  const updateMutation = useUpdateUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const beginEditing = () => {
    if (!user) return;

    setFirstName(user.first_name ?? "");
    setLastName(user.last_name ?? "");
    setEmail(user.email ?? "");
    setIsEditing(true);
    updateMutation.reset();
  };

  const cancelEditing = () => {
    setIsEditing(false);
    updateMutation.reset();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail) {
      return;
    }

    updateMutation.mutate(
      {
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        email: trimmedEmail,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  if (isLoading) {
    return <LoadingCard title="Loading profile..." />;
  }

  if (isError) {
    return (
      <ErrorCard
        message={
          error instanceof Error ? error.message : "Unable to load profile."
        }
      />
    );
  }

  if (!user) {
    return <ErrorCard message="Profile information is unavailable." />;
  }

  return (
    <article className="settings-card">
      <div className="settings-card-header">
        <div>
          <h2>Profile</h2>
          <p>Manage your account information.</p>
        </div>

        {!isEditing && (
          <button type="button" onClick={beginEditing}>
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form className="profile-settings-form" onSubmit={handleSubmit}>
          <div className="settings-grid">
            <div className="settings-field">
              <label htmlFor="profile-first-name">First name</label>

              <input
                id="profile-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                required
              />
            </div>

            <div className="settings-field">
              <label htmlFor="profile-last-name">Last name</label>

              <input
                id="profile-last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
                required
              />
            </div>

            <div className="settings-field">
              <label htmlFor="profile-email">Email</label>

              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {updateMutation.isError && (
            <p className="negative">
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : "Unable to update profile."}
            </p>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={cancelEditing}
              disabled={updateMutation.isPending}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                updateMutation.isPending ||
                !firstName.trim() ||
                !lastName.trim() ||
                !email.trim()
              }
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="settings-grid">
          <div>
            <p className="settings-label">First Name</p>
            <h3>{user.first_name || "Not provided"}</h3>
          </div>

          <div>
            <p className="settings-label">Last Name</p>
            <h3>{user.last_name || "Not provided"}</h3>
          </div>

          <div>
            <p className="settings-label">Email</p>
            <h3>{user.email}</h3>
          </div>
        </div>
      )}
    </article>
  );
};

export default ProfileCard;
