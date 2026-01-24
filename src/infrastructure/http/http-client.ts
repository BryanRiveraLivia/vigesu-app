import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { useAuthStore } from "@/presentation/stores/useAuthStore";
import { API_CONFIG } from "@/core/config/apiConfig";

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

      return config;
    });

    // Response Interceptor
    HttpClient.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid -> clear everything and redirect
          deleteCookie("auth-token");
          useAuthStore.getState().logout();

          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
        }

        return Promise.reject(error);
      },
    );
  }
}

export const httpClient = HttpClient.getInstance();
