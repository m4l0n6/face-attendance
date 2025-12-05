import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";
import { GetStudentsResponse } from "./typing";

export async function getStudentByClassID(
  token: string,
  classId: string
): Promise<GetStudentsResponse> {
  return axios
    .get(`${APP_CONFIG_API_URL}/students/class/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        classId,
      },
    })
    .then((response) => response.data);
}
