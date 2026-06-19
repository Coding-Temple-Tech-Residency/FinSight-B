import type { ReactNode } from "react";

import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";
import ModalProvider from "./ModalProvider";

type AppProvidersProps = {
  children: ReactNode;
};

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ThemeProvider>
      <ModalProvider>
        <QueryProvider>{children}</QueryProvider>
      </ModalProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
