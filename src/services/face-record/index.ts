import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";

export async function faceUpload(
  token: string,
  studentId: string,
  descriptor: number[]
) {
  return axios
    .post(
      `${APP_CONFIG_API_URL}/faces/upload`,
      { studentId, descriptor },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data);
}
