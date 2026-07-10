const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL in frontend .env");
}

type ApiErrorBody = {
  detail?: string;
  message?: string;
};

export class ApiError extends Error {
  status: number;
  data?: ApiErrorBody;

  constructor(message: string, status: number, data?: ApiErrorBody) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = (await response
      .json()
      .catch(() => null)) as ApiErrorBody | null;

    throw new ApiError(
      errorData?.detail ??
        errorData?.message ??
        `API request failed with status ${response.status}`,
      response.status,
      errorData ?? undefined,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
