// Re-export hacia el cliente HTTP consolidado.
// Todos los imports existentes de axiosInstance siguen funcionando.
// Migrar gradualmente a: import { httpClient } from "@/infrastructure/http/http-client"
export { httpClient as axiosInstance } from "@/infrastructure/http/http-client";
