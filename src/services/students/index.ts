import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";
import { GetStudentsResponse, Student } from "./typing";

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

export async function getInfoStudentByID(
  token: string,
  studentId: string
): Promise<Student> {
  return axios
    .get(`${APP_CONFIG_API_URL}/students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data.data);
}