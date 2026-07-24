import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import {
  faChartLine,
  faComments,
  faHouse,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

export interface NavigationItem {
  id: number;
  name: string;
  path: string;
  icon: IconDefinition;
}

export const navigation: NavigationItem[] = [
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard",
    icon: faHouse,
  },
  {
    id: 2,
    name: "Portfolio",
    path: "/dashboard/portfolio",
    icon: faChartLine,
  },
  {
    id: 3,
    name: "Watchlist",
    path: "/dashboard/watchlist",
    icon: faStar,
  },
  {
    id: 4,
    name: "Insights",
    path: "/dashboard/insights",
    icon: faChartLine,
  },
  {
    id: 5,
    name: "Chat",
    path: "/dashboard/chat",
    icon: faComments,
  },
];

export interface HomeNavigationItem {
  id: number;
  name: string;
  section: string;
}

export const homeNavigation: HomeNavigationItem[] = [
  {
    id: 1,
    name: "Features",
    section: "features",
  },
  {
    id: 2,
    name: "About",
    section: "about",
  },
  {
    id: 3,
    name: "Demo",
    section: "preview",
  },
  {
    id: 4,
    name: "Contact",
    section: "footer",
  },
];
