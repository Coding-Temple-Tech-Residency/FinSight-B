import { useMutation } from "@tanstack/react-query";

import { sendAIChatMessage } from "../../../api/aiInsightsApi";

export const useAIChat = () => {
  return useMutation({
    mutationFn: sendAIChatMessage,
    retry: false,
  });
};
