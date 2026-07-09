import { useCurrentUser } from "../../auth/hooks/useCurrentUser";

const ProfileCard = () => {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <article className="settings-card">
        <p>Loading profile...</p>
      </article>
    );
  }

  if (isError) {
    return (
      <article className="settings-card">
        <p>Unable to load profile.</p>
      </article>
    );
  }

  const firstName = user?.first_name ?? user?.firstName ?? "";
  const lastName = user?.last_name ?? user?.lastName ?? "";

  return (
    <article className="settings-card">
      <div className="settings-card-header">
        <div>
          <h2>Profile</h2>
          <p>Your account information.</p>
        </div>

        <button disabled>Edit Coming Soon</button>
      </div>

      <div className="settings-grid">
        <div>
          <p className="settings-label">First Name</p>
          <h3>{firstName || "Not provided"}</h3>
        </div>

        <div>
          <p className="settings-label">Last Name</p>
          <h3>{lastName || "Not provided"}</h3>
        </div>

        <div>
          <p className="settings-label">Email</p>
          <h3>{user?.email}</h3>
        </div>
      </div>
    </article>
  );
};

export default ProfileCard;
