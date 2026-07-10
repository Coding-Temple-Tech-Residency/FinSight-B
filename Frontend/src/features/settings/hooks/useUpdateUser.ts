import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserProfile } from "../../../api/userApi";
import type { UpdateUserPayload } from "../../auth/types/user";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUserProfile(payload),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["current-user"], updatedUser);
    },
  });
};
