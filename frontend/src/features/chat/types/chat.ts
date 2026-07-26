import type { SupportedCurrency } from "../../currency/types/currency";

export type ChatRole = "user" | "assistant";

export type AIChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  created_at?: string;
};

export type AIChatPayload = {
  message: string;
  symbol?: string;
  preferredCurrency?: SupportedCurrency;
};
