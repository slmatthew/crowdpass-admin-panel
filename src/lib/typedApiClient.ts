import { rawApiClient } from "./rawApiClient";

export function fetchTyped<T = unknown>(token: string, url: string): Promise<T> {
  return rawApiClient(token)
    .get<T>(url)
    .then((res) => res.data);
}

export function postTyped<T = unknown, Body = any>(
  token: string,
  url: string,
  body: Body
): Promise<T> {
  return rawApiClient(token)
    .post<T>(url, body)
    .then((res) => res.data);
}

export function putTyped<T = unknown, Body = any>(
  token: string,
  url: string,
  body: Body
): Promise<T> {
  return rawApiClient(token)
    .put<T>(url, body)
    .then((res) => res.data);
}

export function deleteTyped<T = unknown>(
  token: string,
  url: string
): Promise<T> {
  return rawApiClient(token)
    .delete<T>(url)
    .then((res) => res.data);
}
