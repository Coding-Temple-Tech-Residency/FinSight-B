import { createContext } from "react";

export type ThemeContextType = {
  darkTheme: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);
