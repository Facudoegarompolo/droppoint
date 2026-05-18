import { DropoffOptimizationRequest, DropoffOptimizationResponse } from "../types/dropoff";
import { getApiBaseUrl } from "../config/env";

const API_BASE_URL = getApiBaseUrl();

export async function optimizeDropoff(
  request: DropoffOptimizationRequest
): Promise<DropoffOptimizationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/dropoff/optimize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    let message = "No se pudo calcular el punto de bajada.";
    try {
      const errorBody = (await response.json()) as { message?: string };
      message = errorBody.message ?? message;
    } catch {
      // Keep the friendly fallback.
    }
    throw new Error(message);
  }

  return response.json() as Promise<DropoffOptimizationResponse>;
}
