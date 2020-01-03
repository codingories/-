import request from "@/utils/request";
import qs from "qs";

export const getRepairs = ({ access_token, kind }) =>
  request({
    method: "get",
    url: `/api/v1/repairs`,
    params: { access_token, kind }
  });

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

export const PostRepairFeedback = ({ repair_id, access_token, remark }) => {
  const data = new window.FormData();
  data.append("repair_id", repair_id);
  data.append("access_token", access_token);
  data.append("remark", remark);

  return request({
    method: "post",
    url: `/api/v1/repair/update`,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    params: {
      repair_id,
      access_token,
      remark
    }
    // params: {
    //   repair_id,
    //   access_token,
    //   title,
    //   content,
    //   is_urgent,
    //   classroom_id,
    //   remark
    // }
  });
};
