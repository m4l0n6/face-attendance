import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";

export const faceUpload = async (
  token: string,
  studentId: string,
  descriptor: number[]
) => {
  return axios
    .post(
      `${APP_CONFIG_API_URL}/students/${studentId}/face`,
      { descriptor },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data);
};
