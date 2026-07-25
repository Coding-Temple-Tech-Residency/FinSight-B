import type { UniversalSearchResult } from "../types/search";

import type {
  SearchProvider,
  SearchProviderContext,
} from "../types/searchProvider";

class SearchRegistry {
  private providers = new Map<string, SearchProvider>();

  register(provider: SearchProvider): void {
    if (this.providers.has(provider.id)) {
      return;
    }

    this.providers.set(provider.id, provider);
  }

  unregister(providerId: string): void {
    this.providers.delete(providerId);
  }

  getProvider(providerId: string): SearchProvider | undefined {
    return this.providers.get(providerId);
  }

  getProviders(): SearchProvider[] {
    return Array.from(this.providers.values());
  }

  async search(
    query: string,
    context?: SearchProviderContext,
  ): Promise<UniversalSearchResult[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery || context?.signal?.aborted) {
      return [];
    }

    const providers = this.getProviders();

    if (providers.length === 0) {
      return [];
    }

    const providerResults = await Promise.allSettled(
      providers.map((provider) =>
        Promise.resolve(provider.search(normalizedQuery, context)),
      ),
    );

    if (context?.signal?.aborted) {
      return [];
    }

    const combinedResults = providerResults.flatMap((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      }

      const provider = providers[index];

      console.error(`Search provider "${provider.id}" failed:`, result.reason);

      return [];
    });

    const uniqueResults = new Map<string, UniversalSearchResult>();

    combinedResults.forEach((result) => {
      if (!uniqueResults.has(result.id)) {
        uniqueResults.set(result.id, result);
      }
    });

    return Array.from(uniqueResults.values());
  }
}

export const searchRegistry = new SearchRegistry();
