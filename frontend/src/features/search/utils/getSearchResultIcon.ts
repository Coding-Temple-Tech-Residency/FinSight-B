import {
  faBriefcase,
  faChartLine,
  faFileLines,
  faRobot,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import type { SearchResultType } from "../types/search";

const searchResultIcons: Record<SearchResultType, IconDefinition> = {
  stock: faChartLine,
  portfolio: faBriefcase,
  watchlist: faStar,
  page: faFileLines,
  ai: faRobot,
};

export const getSearchResultIcon = (type: SearchResultType): IconDefinition => {
  return searchResultIcons[type];
};
