import { useQuery, useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "../../../api/authApi";

type AuthUser = {
  email: string;
};

const getUserFromToken = (): AuthUser | null => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      email: payload.email,
    };
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user = null, isLoading: loading } = useQuery<AuthUser | null>({
    queryKey: ["current-user"],
    queryFn: async () => getUserFromToken(),
    initialData: getUserFromToken(),
  });

  const logout = () => {
    logoutUser();
    queryClient.setQueryData(["current-user"], null);
  };

  const refreshUser = async () => {
    queryClient.setQueryData(["current-user"], getUserFromToken());
  };

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    refreshUser,
    logout,
  };
};
