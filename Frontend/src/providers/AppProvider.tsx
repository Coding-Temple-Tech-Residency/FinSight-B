import type { ReactNode } from "react";

import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";
import ModalProvider from "./ModalProvider";
import DashboardProvider from "../features/dashboard/providers/DashboardProvider";

type AppProvidersProps = {
  children: ReactNode;
};

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ThemeProvider>
      <ModalProvider>
        <QueryProvider>
          <DashboardProvider>{children}</DashboardProvider>
        </QueryProvider>
      </ModalProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
