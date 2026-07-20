export type ChatRole = "user" | "assistant";

export type AIChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  created_at?: string;
};

export type AIChatPayload = {
  message: string;
};
