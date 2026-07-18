import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "../context/ThemeContext";

const THEME_KEY = "currentMode";

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false;

  const saved = window.localStorage.getItem(THEME_KEY);

  if (saved === "dark") return true;
  if (saved === "light") return false;

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkTheme, setDarkTheme] = useState<boolean>(getInitialTheme);

  const toggleTheme = () => {
    setDarkTheme((prev) => !prev);
  };

  useEffect(() => {
    document.body.classList.remove("dark-theme", "light-theme");
    document.body.classList.add(darkTheme ? "dark-theme" : "light-theme");

    window.localStorage.setItem(THEME_KEY, darkTheme ? "dark" : "light");
  }, [darkTheme]);

  return (
    <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
