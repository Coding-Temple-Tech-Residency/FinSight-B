import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUserAccount } from "../../../api/userApi";

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserAccount,

    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear();
    },
  });
};
