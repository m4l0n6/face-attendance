import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";

export async function mySchedules(token: string) {
    return axios
        .get(`${APP_CONFIG_API_URL}/schedules/my-schedules`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data);
}