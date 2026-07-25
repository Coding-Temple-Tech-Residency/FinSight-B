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
    <QueryProvider>
      <ThemeProvider>
        <ModalProvider>
          <DashboardProvider>{children}</DashboardProvider>
        </ModalProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default AppProviders;
