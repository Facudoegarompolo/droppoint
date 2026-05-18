const DEFAULT_LOCAL_API_URL = "http://localhost:8080";

function withoutTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  return withoutTrailingSlash(configuredUrl || DEFAULT_LOCAL_API_URL);
}
