import type { AuthUser } from "@/store/authStore";

export interface App {
  id: number;
  clientId: number;
  name: string;
  appClientId: string;
  appSecret: string;
  createdAt: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, token: string | null, init: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (res.status === 204) return undefined as T;
  const body = await res.json();
  if (!res.ok) throw new Error(body.message ?? "Request failed");
  return body as T;
}

export const getMe = (token: string) => apiFetch<AuthUser>("/v1/auth/me", token);

export const fetchApps = (token: string) => apiFetch<App[]>("/v1/app", token);

export const createApp = (token: string, name: string) =>
  apiFetch<App>("/v1/app", token, {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const updateApp = (token: string, id: number, name: string) =>
  apiFetch<App>(`/v1/app/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });

export const deleteApp = (token: string, id: number) =>
  apiFetch<void>(`/v1/app/${id}`, token, { method: "DELETE" });
