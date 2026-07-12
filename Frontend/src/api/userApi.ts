import { apiClient } from "./apiClient";

import type {
  UpdateUserPayload,
  UserProfile,
} from "../features/auth/types/user";

export const getUserProfile = () => {
  return apiClient<UserProfile>("/api/users/me");
};

export const updateUserProfile = (payload: UpdateUserPayload) => {
  return apiClient<UserProfile>("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteUserAccount = () => {
  return apiClient<void>("/api/users/me", {
    method: "DELETE",
  });
};
