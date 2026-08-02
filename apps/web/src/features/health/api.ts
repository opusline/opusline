import { apiFetch } from "@/lib/api-client";

export type PingResponse = {
  status: string;
};

export function pingApi(): Promise<PingResponse> {
  return apiFetch<PingResponse>("/api/ping");
}
