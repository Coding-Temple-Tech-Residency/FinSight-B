import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import useTheme from "../../hooks/useTheme";
import "./ThemeButton.css";
import { useBreakpoint } from "../../hooks/useBreakingPoint";

type ThemeButtonProps = {
  className?: string;
};

const ThemeButton = ({ className = "" }: ThemeButtonProps) => {
  const { toggleTheme, darkTheme } = useTheme();
  const { isDesktop } = useBreakpoint();

  return (
    <button
      type="button"
      className={`theme-btn ${className} ${isDesktop ? "z-60" : "z-0"}`}
      onClick={toggleTheme}
      aria-label={darkTheme ? "Switch to light theme" : "Switch to dark theme"}
      title={darkTheme ? "Switch to light theme" : "Switch to dark theme"}
    >
      <FontAwesomeIcon icon={darkTheme ? faSun : faMoon} aria-hidden="true" />
    </button>
  );
};

export default ThemeButton;
