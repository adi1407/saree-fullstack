const SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return SERVER_API_URL;
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

export async function api<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...init } = options;

  let url = `${getBaseUrl()}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.set(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string | number | undefined>) =>
    api<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body?: unknown) =>
    api<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body?: unknown) =>
    api<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) => api<T>(endpoint, { method: "DELETE" }),
};
