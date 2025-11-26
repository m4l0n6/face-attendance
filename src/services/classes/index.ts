import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";

export async function getAllClasses(token: string) {
  return axios
    .get(`${APP_CONFIG_API_URL}/classes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function getStatisticStudentsInClass(token: string, studentID: string, classId: string) {
    return axios
      .get(
        `${APP_CONFIG_API_URL}/statistics/student/${studentID}/class/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => response.data);
}