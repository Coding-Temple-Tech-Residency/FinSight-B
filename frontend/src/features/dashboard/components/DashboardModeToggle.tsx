type DashboardMode = "portfolio" | "trending";

type DashboardModeToggleProps = {
  mode: DashboardMode;
  onChange: (mode: DashboardMode) => void;
};

const DashboardModeToggle = ({ mode, onChange }: DashboardModeToggleProps) => {
  return (
    <div
      className="dashboard-mode-toggle"
      role="group"
      aria-label="Dashboard view"
    >
      <button
        type="button"
        className={`dashboard-mode-button ${
          mode === "portfolio" ? "active" : ""
        }`}
        aria-pressed={mode === "portfolio"}
        onClick={() => onChange("portfolio")}
      >
        Portfolio
      </button>

      <button
        type="button"
        className={`dashboard-mode-button ${
          mode === "trending" ? "active" : ""
        }`}
        aria-pressed={mode === "trending"}
        onClick={() => onChange("trending")}
      >
        Trending Market
      </button>
    </div>
  );
};

export type { DashboardMode };
export default DashboardModeToggle;
