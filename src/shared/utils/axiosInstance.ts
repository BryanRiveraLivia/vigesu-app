// src/shared/utils/axiosInstance.ts

import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { API_CONFIG } from "@/shared/config/apiConfig";

export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
//  Agrega el token a cada request si existe
axiosInstance.interceptors.request.use((config) => {
  const token = getCookie("auth-token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//  Interceptor para manejar errores globales (401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido → limpia todo y redirige
      deleteCookie("auth-token");
      useAuthStore.getState().logout();

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);
