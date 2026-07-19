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

export type SearchResult = SearchItem & {
  score: number;
};
