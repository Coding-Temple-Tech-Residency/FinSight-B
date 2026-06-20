import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import {
  faHouse,
  faCode,
  faChartLine,
  faComments,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

import { faCircleUser } from "@fortawesome/free-regular-svg-icons";

export interface NavigationItem {
  id: number;
  name: string;
  path?: string;
  icon: IconDefinition;
}

export const navigation: NavigationItem[] = [
  {
    id: 1,
    name: "Dashboard",
    path: "",
    icon: faHouse,
  },
  {
    id: 2,
    name: "Portfolio",
    path: "portfolio",
    icon: faCircleUser,
  },
  {
    id: 3,
    name: "Watchlist",
    path: "watchlist",
    icon: faCode,
  },
  {
    id: 4,
    name: "Insights",
    path: "insights",
    icon: faChartLine,
  },
  {
    id: 5,
    name: "Chat",
    path: "chat",
    icon: faComments,
  },
  {
    id: 6,
    name: "Settings",
    path: "settings",
    icon: faGear,
  },
];
