import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type SearchCategory =
  | "page"
  | "dashboard"
  | "portfolio"
  | "watchlist"
  | "insight"
  | "chat"
  | "settings";

export type SearchItem = {
  id: string;
  title: string;
  description: string;
  path: string;
  category: SearchCategory;
  keywords: string[];
  icon?: IconDefinition;
};

export type PlatformSearchResult = SearchItem & {
  score: number;
};

export type SearchResultType =
  | "stock"
  | "portfolio"
  | "watchlist"
  | "page"
  | "ai";

export interface UniversalSearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  badge?: string;
  image?: string | null;
  trailing?: string;
  href?: string;
  data?: unknown;
}
