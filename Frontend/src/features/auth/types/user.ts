export type CurrentUser = {
  id: number;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  email: string;
};

export type UserProfile = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export type UpdateUserPayload = {
  first_name?: string;
  last_name?: string;
  email?: string;
};
