import { searchRegistry } from "../registry/searchRegistry";

import { platformSearchProvider } from "./platformSearchProvider";
import { portfolioSearchProvider } from "./portfolioSearchProvider";
import { stockSearchProvider } from "./stockSearchProvider";
import { watchlistSearchProvider } from "./watchlistSearchProvider";

let providersRegistered = false;

export const registerSearchProviders = (): void => {
  if (providersRegistered) {
    return;
  }

  searchRegistry.register(platformSearchProvider);
  searchRegistry.register(portfolioSearchProvider);
  searchRegistry.register(watchlistSearchProvider);
  searchRegistry.register(stockSearchProvider);

  providersRegistered = true;
};
