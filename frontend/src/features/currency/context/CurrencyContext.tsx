import { createContext } from "react";

import type { CurrencyContextValue } from "../types/currency";

export const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined,
);
