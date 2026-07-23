import type { UniversalSearchResult } from "./search";

export interface SearchProviderContext {
  signal?: AbortSignal;
}

export interface SearchProvider {
  id: string;
  label: string;

  search: (
    query: string,
    context?: SearchProviderContext,
  ) => Promise<UniversalSearchResult[]> | UniversalSearchResult[];
}
