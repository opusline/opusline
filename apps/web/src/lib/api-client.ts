export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { Accept: "application/json", ...init.headers },
  });

  if (!response.ok) {
    throw new Error(`API request failed with ${response.status} for ${path}`);
  }

  return response.json() as Promise<T>;
}
