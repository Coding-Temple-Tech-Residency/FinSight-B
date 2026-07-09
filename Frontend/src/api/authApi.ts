import type { CurrentUser } from "../features/auth/types/user";
import { apiClient } from "./apiClient";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: "bearer";
};

export type RegisterResponse = {
  message: string;
};

export const registerUser = async (payload: RegisterPayload) => {
  return apiClient<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const loginUser = async (payload: LoginPayload) => {
  return apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = () => apiClient<CurrentUser>("/api/auth/me");
