import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { appConfig } from "../config/appConfig";

export function useApiClient() {
  const { token, logout } = useAuth();

  const instance = axios.create({
    baseURL: appConfig.apiBaseUrl,
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    if (config.headers?.["x-no-auth"]) {
      delete config.headers["x-no-auth"];
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
}