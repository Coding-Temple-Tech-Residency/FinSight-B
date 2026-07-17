export type CurrentUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export type UserProfile = CurrentUser;

export type UpdateUserPayload = {
  first_name?: string;
  last_name?: string;
  email?: string;
};
