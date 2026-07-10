import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../../api/userApi";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
