// components/GlobalThemeButton.tsx

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import useTheme from "../hooks/useTheme";

const ThemeButton = () => {
  const { toggleTheme, darkTheme } = useTheme();
  const theme = darkTheme ? faSun : faMoon;

  return (
    <button className="theme-btn" onClick={toggleTheme}>
      <FontAwesomeIcon icon={theme} />
    </button>
  );
};

export default ThemeButton;
