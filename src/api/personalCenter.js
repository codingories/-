import request from "@/utils/request";
import qs from "qs";

export function getPersonalInfo(user_id, access_token) {
  return request({
    url: `/api/v1/users/${user_id}`,
    method: "get",
    params: { user_id, access_token }
  });
}

export function editUserInfo(data) {
  return request({
    method: "post",
    url: "/api/v1/user/edit_info",
    data: qs.stringify(data)
  });
}

export function changePassword(data) {
  return request({
    method: "post",
    url: "/api/v1/change/password",
    data: qs.stringify(data)
  });
}
export const AddRepairOne = ({
  access_token,
  title,
  content,
  location,
  is_urgent,
  classroom_id,
  apply_images
}) => {
  console.log("apply_images", apply_images);
  const data = new window.FormData();
  data.append("access_token", access_token);
  data.append("title", title);
  data.append("content", content);
  data.append("location", location);
  data.append("is_urgent", is_urgent);
  data.append("classroom_id", classroom_id);
  apply_images.forEach(item => {
    data.append("apply_images[]", item.raw);
  });
  return request({
    method: "post",
    url: "/api/v1/repairs",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data
  });
};
