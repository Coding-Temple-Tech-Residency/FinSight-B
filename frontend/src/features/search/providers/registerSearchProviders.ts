import { searchRegistry } from "../registry/searchRegistry";

import { platformSearchProvider } from "./platformSearchProvider";
import { stockSearchProvider } from "./stockSearchProvider";

let providersRegistered = false;

export const registerSearchProviders = (): void => {
  if (providersRegistered) {
    return;
  }

  searchRegistry.register(platformSearchProvider);
  searchRegistry.register(stockSearchProvider);

  providersRegistered = true;
};
