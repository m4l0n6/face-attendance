import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";
import { CurrentIPResponse } from "./typing";

export async function getCurrentIP(): Promise<CurrentIPResponse> {
  const response = await axios.get(
    `${APP_CONFIG_API_URL}/ip-config/current-ip`
  );
  return response.data.data;
}
