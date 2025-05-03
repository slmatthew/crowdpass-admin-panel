import axios from "axios";
import { appConfig } from "@/config/appConfig";

export const rawApiClient = (token: string) =>
  axios.create({
    baseURL: appConfig.apiBaseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });