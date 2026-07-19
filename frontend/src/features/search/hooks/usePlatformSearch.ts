import { useMemo } from "react";

import { searchIndex } from "../data/searchIndex";
import { searchPlatform } from "../utils/searchPlatform";

export const usePlatformSearch = (query: string) => {
  const results = useMemo(() => {
    return searchPlatform(searchIndex, query);
  }, [query]);

  return {
    results,
    resultCount: results.length,
    hasResults: results.length > 0,
  };
};
