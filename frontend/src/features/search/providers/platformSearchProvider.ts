import { searchItems } from "../data/searchItems";

import type { SearchProvider } from "../types/searchProvider";
import type { UniversalSearchResult } from "../types/search";

import { searchPlatform } from "../utils/searchPlatform";

export const platformSearchProvider: SearchProvider = {
  id: "platform",
  label: "Pages",

  search(query): UniversalSearchResult[] {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    const results = searchPlatform(searchItems, normalizedQuery);

    return results.map((result) => ({
      id: `platform-${result.id}`,
      type: "page",
      title: result.title,
      subtitle: result.description,
      badge: result.category,
      href: result.path,
      data: result,
    }));
  },
};
