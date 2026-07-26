import type { ReactNode } from "react";

import CurrencyProvider from "../features/currency/providers/CurrencyProvider";
import DashboardProvider from "../features/dashboard/providers/DashboardProvider";

import ModalProvider from "./ModalProvider";
import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";

type AppProvidersProps = {
  children: ReactNode;
};

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ThemeProvider>
      <ModalProvider>
        <QueryProvider>
          <CurrencyProvider>
            <DashboardProvider>{children}</DashboardProvider>
          </CurrencyProvider>
        </QueryProvider>
      </ModalProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
