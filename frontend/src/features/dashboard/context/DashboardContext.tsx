import { createContext } from "react";

export type DashboardContextType = {
  symbol: string;
  setSymbol: React.Dispatch<React.SetStateAction<string>>;
};

export const DashboardContext = createContext<DashboardContextType | null>(
  null,
);
