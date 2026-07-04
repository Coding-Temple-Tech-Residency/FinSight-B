import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faChartLine,
  faBrain,
  faEye,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

interface FeatureItem {
  id: number;
  icon: IconDefinition;
  title: string;
  message: string;
}

export const features: FeatureItem[] = [
  {
    id: 1,
    icon: faChartLine,
    title: "Portfolio Tracking",
    message:
      "Track holdings, performance, gains, losses, and asset allocation.",
  },
  {
    id: 2,
    icon: faBrain,
    title: "AI Insights",
    message:
      "Get plain-language summaries of earnings, news, and market trends.",
  },
  {
    id: 3,
    icon: faEye,
    title: "Watchlists",
    message: "Monitor stocks you care about with real-time price movement.",
  },
  {
    id: 4,
    icon: faComments,
    title: "Ask AI",
    message:
      "Ask questions about stocks, your portfolio, or market performance.",
  },
];
