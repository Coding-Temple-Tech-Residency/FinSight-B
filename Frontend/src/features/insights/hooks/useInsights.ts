import { useQuery } from "@tanstack/react-query";

import { getInsights } from "../../../api/aiInsightsApi";

export const useInsights = () => {
  return useQuery({
    queryKey: ["insights"],
    queryFn: getInsights,
    staleTime: 60 * 1000,
    retry: false,
  });
};
