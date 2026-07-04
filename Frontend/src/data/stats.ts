import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faUsers,
  faChartColumn,
  faBrain,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

interface StatItem {
  id: number;
  icon: IconDefinition;
  numbers: string;
  title: string;
}

export const stats: StatItem[] = [
  {
    id: 1,
    icon: faUsers,
    numbers: "10K+",
    title: "Active Users",
  },
  {
    id: 2,
    icon: faChartColumn,
    numbers: "50M+",
    title: "Reports Analyzed",
  },
  {
    id: 3,
    icon: faBrain,
    numbers: "95%",
    title: "AI Accuracy",
  },
  {
    id: 4,
    icon: faClock,
    numbers: "24/7",
    title: "Market Monitoring",
  },
];
