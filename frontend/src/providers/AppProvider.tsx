import type { ReactNode } from "react";

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
          <DashboardProvider>{children}</DashboardProvider>
        </QueryProvider>
      </ModalProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
