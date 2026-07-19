import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import useTheme from "../../hooks/useTheme";

const ThemeButton = () => {
  const { toggleTheme, darkTheme } = useTheme();
  const theme = darkTheme ? faSun : faMoon;

  return (
    <button
      className={`theme-btn fixed bottom-2 right-2 z-50`}
      onClick={toggleTheme}
    >
      <FontAwesomeIcon
        className={`${darkTheme ? "text-stone-50" : "text-stone-800"}`}
        icon={theme}
      />
    </button>
  );
};

export default ThemeButton;
