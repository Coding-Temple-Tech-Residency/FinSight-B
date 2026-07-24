import { searchData } from "../data/searchData";

import type {
  PlatformSearchResult,
  UniversalSearchResult,
} from "../types/search";
import type { SearchProvider } from "../types/searchProvider";

import { searchPlatform } from "../utils/searchPlatform";

const mapPlatformResult = (
  result: PlatformSearchResult,
): UniversalSearchResult => {
  return {
    id: `platform-${result.id}`,
    type: "page",
    title: result.title,
    subtitle: result.description,
    badge: result.category,
    href: result.path,
    data: result,
  };
};

export const platformSearchProvider: SearchProvider = {
  id: "platform",
  label: "Pages",

  search(query): UniversalSearchResult[] {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    return searchPlatform(searchData, normalizedQuery).map(mapPlatformResult);
  },
};
