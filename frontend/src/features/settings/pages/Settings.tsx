import AccountSettings from "../components/AccountSettings";
import CurrencySettings from "../components/CurrencySettings";
import ProfileCard from "../components/ProfileCard";
import ThemeSettings from "../components/ThemeSettings";

import "../styles/settings.css";

const Settings = () => {
  return (
    <section className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>

        <p>
          Manage your profile, appearance, currency, and account preferences.
        </p>
      </header>

      <ProfileCard />
      <ThemeSettings />
      <CurrencySettings />
      <AccountSettings />
    </section>
  );
};

export default Settings;
