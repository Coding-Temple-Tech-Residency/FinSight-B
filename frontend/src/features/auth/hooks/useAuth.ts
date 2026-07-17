import { useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "../../../api/authApi";
import { CURRENT_USER_QUERY_KEY, useCurrentUser } from "./useCurrentUser";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const { data: user, isLoading, isFetching, isError } = useCurrentUser();

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      queryClient.clear();
    }
  };

  const refreshUser = async () => {
    await queryClient.invalidateQueries({
      queryKey: CURRENT_USER_QUERY_KEY,
    });
  };

  return {
    user: user ?? null,
    loading: Boolean(token) && (isLoading || isFetching),
    isAuthenticated: Boolean(token) && Boolean(user),
    hasToken: Boolean(token),
    isError,
    refreshUser,
    logout,
  };
};
