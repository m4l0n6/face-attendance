import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";

export async function getNotifications(
  token: string,
  unreadOnly: boolean = true
) {
  return axios
    .get(`${APP_CONFIG_API_URL}/notifications`, {
      params: { unreadOnly },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function markNotificationAsRead(
  token: string,
  notificationId: string
) {
  return axios
    .patch(
      `${APP_CONFIG_API_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data);
}

export async function markAllNotificationsAsRead(token: string) {
  return axios
    .patch(
      `${APP_CONFIG_API_URL}/notifications/read-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data);
}
