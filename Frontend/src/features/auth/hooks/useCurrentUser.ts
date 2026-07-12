import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../../../api/authApi";

export const CURRENT_USER_QUERY_KEY = ["current-user"] as const;

export function useCurrentUser() {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
