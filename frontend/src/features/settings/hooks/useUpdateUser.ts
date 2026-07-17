import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserProfile } from "../../../api/userApi";
import { CURRENT_USER_QUERY_KEY } from "../../auth/hooks/useCurrentUser";
import type { UpdateUserPayload } from "../../auth/types/user";
import { USER_PROFILE_QUERY_KEY } from "./useUserProfile";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUserProfile(payload),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(USER_PROFILE_QUERY_KEY, updatedUser);

      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, updatedUser);
    },
  });
};
