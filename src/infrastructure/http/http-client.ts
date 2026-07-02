import axios, { AxiosInstance } from "axios";
import { getCookie } from "cookies-next";
import { API_CONFIG } from "@/core/config/apiConfig";
import { getMockResponseFor } from "@/core/utils/mockApi";
import { performLogout } from "@/core/utils/logout";

export class HttpClient {
  private static instance: AxiosInstance;

  private constructor() {}

  public static getInstance(): AxiosInstance {
    if (!HttpClient.instance) {
      HttpClient.instance = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      HttpClient.setupInterceptors();
    }

    return HttpClient.instance;
  }

  private static setupInterceptors() {
    // Request Interceptor
    HttpClient.instance.interceptors.request.use((config) => {
      const token = getCookie("auth-token");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Bypass de red solo disponible en entorno de desarrollo
      if (process.env.NODE_ENV === "development" && token === "mock-token-admin") {
        config.adapter = async function () {
          const mockData = getMockResponseFor(config.url);

          const safeProxy = new Proxy(mockData as Record<string | symbol, unknown>, {
            get(target: Record<string | symbol, unknown>, prop: string | symbol) {
              if (prop in target) return target[prop];
              if (prop === "items") return [];
              if (prop === "totalCount") return 0;
              if (prop === "pageNumber" || prop === "totalPages") return 1;
              if (prop === "length") return 0;
              if (prop === "map") return [].map;
              if (prop === "filter") return [].filter;
              if (prop === "forEach") return [].forEach;
              if (typeof prop === "string" && prop.includes("Id")) return 0;
              return undefined;
            },
          });

          return {
            data: safeProxy,
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          };
        };
      }

      return config;
    });

    // Response Interceptor
    HttpClient.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          performLogout();
          return Promise.reject(error);
        }

        return Promise.reject(error);
      },
    );
  }
}

export const httpClient = HttpClient.getInstance();
