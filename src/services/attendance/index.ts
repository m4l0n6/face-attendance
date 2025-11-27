import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";

// Ghi nhận điểm danh
export async function recordAttendance(
  token: string,
  data: {
    sessionId: string;
    studentId: string;
    method: "face" | "manual";
    matchedAt: string;
  }
) {
  return axios
    .post(`${APP_CONFIG_API_URL}/attendance/record`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}
