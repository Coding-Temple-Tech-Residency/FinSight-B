import { useState } from "react";
import { DashboardContext } from "../context/DashboardContext";

type DashboardProviderProps = {
  children: React.ReactNode;
};

const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [symbol, setSymbol] = useState("AAPL");

  return (
    <DashboardContext.Provider
      value={{
        symbol,
        setSymbol,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
