import type { SearchItem } from "../types/search";

export const searchItems: SearchItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "View your financial dashboard and account overview.",
    path: "/dashboard",
    category: "dashboard",
    keywords: ["dashboard", "overview", "home"],
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "View and manage your investment portfolios.",
    path: "/dashboard/portfolio",
    category: "portfolio",
    keywords: ["portfolio", "holdings", "investments", "assets"],
  },
  {
    id: "watchlist",
    title: "Watchlist",
    description: "Review stocks saved to your watchlist.",
    path: "/dashboard/watchlist",
    category: "watchlist",
    keywords: ["watchlist", "saved stocks", "favorites"],
  },
  {
    id: "ai-insights",
    title: "AI Insights",
    description: "Generate AI-powered portfolio insights.",
    path: "/dashboard/ai-insights",
    category: "insight",
    keywords: ["ai", "insights", "analysis", "portfolio"],
  },
  {
    id: "ai-chat",
    title: "AI Chat",
    description: "Ask questions about stocks and your portfolio.",
    path: "/dashboard/chat",
    category: "chat",
    keywords: ["ai", "chat", "assistant", "questions"],
  },
  {
    id: "settings",
    title: "Settings",
    description: "Manage your account and application preferences.",
    path: "/dashboard/settings",
    category: "settings",
    keywords: ["settings", "account", "preferences", "profile"],
  },
];
