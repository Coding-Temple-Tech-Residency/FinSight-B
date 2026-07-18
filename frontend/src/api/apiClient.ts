const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL in frontend .env");
}

type ValidationError = {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
};

type ApiErrorBody = {
  detail?: string | ValidationError[];
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

const getErrorMessage = (
  errorData: ApiErrorBody | null,
  status: number,
): string => {
  if (typeof errorData?.detail === "string") {
    return errorData.detail;
  }

  if (Array.isArray(errorData?.detail)) {
    return errorData.detail
      .map((error) => error.msg ?? "Validation error")
      .join(", ");
  }

  return errorData?.message ?? `API request failed with status ${status}`;
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(!isFormData
        ? {
            "Content-Type": "application/json",
          }
        : {}),
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

    if (response.status === 401) {
      localStorage.removeItem("token");
    }

    throw new ApiError(
      getErrorMessage(errorData, response.status),
      response.status,
      errorData ?? undefined,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
