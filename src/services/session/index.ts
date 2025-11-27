import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";

export async function mySession(token: string) {
  return axios
    .get(`${APP_CONFIG_API_URL}/sessions/my-sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}