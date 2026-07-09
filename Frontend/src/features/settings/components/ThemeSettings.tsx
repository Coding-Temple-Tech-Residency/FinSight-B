import useTheme from "../../../hooks/useTheme";

const ThemeSettings = () => {
  const { darkTheme, toggleTheme } = useTheme();

  return (
    <article className="settings-card">
      <div className="settings-card-header">
        <div>
          <h2>Appearance</h2>
          <p>Switch between light and dark mode.</p>
        </div>

        <button onClick={toggleTheme}>
          {darkTheme ? "Switch to Light" : "Switch to Dark"}
        </button>
      </div>

      <p className="settings-label">
        Current theme: {darkTheme ? "Dark" : "Light"}
      </p>
    </article>
  );
};

export default ThemeSettings;
