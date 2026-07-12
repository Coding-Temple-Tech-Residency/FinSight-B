import { useQuery } from "@tanstack/react-query";

import { getUserProfile } from "../../../api/userApi";

export const USER_PROFILE_QUERY_KEY = ["user-profile"] as const;

export const useUserProfile = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: getUserProfile,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
