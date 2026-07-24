import { useMemo } from "react";

import { searchData } from "../data/searchData";
import { searchPlatform } from "../utils/searchPlatform";

export const usePlatformSearch = (query: string) => {
  const results = useMemo(() => {
    return searchPlatform(searchData, query);
  }, [query]);

  return {
    results,
    resultCount: results.length,
    hasResults: results.length > 0,
  };
};
