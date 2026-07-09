import ProfileCard from "../components/ProfileCard";
import ThemeSettings from "../components/ThemeSettings";
import AccountSettings from "../components/AccountSettings";

const Settings = () => {
  return (
    <section className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Manage your profile, appearance, and account preferences.</p>
      </header>

      <ProfileCard />

      <ThemeSettings />

      <AccountSettings />
    </section>
  );
};

export default Settings;
