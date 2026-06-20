import { apiClient } from "./apiClient";

export type DashboardResponse = {
  message: string;
};

export const getDashboardData = async () => {
  return apiClient<DashboardResponse>("/dashboard");
};
