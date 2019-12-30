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

// export function getUserFlowsApprovals({ access_token }) {
//   return request({
//     method: "get",
//     url: `/api/v1/user-flows`,
//     params: { access_token }
//   });
// }

// export const getEntryDetail = ({ access_token, entry_id }) =>
//   request({
//     method: "get",
//     url: `/api/v1/entries/${entry_id}`,
//     params: { access_token, entry_id }
//   });

// export const resolvedApproval = ({ access_token, process_id, content }) =>
//   request({
//     method: "post",
//     url: "/api/v1/proc/pass",
//     data: qs.stringify({ access_token, process_id, content })
//   });

// export const rejectedApproval = ({ access_token, process_id, content }) =>
//   request({
//     method: "post",
//     url: "/api/v1/proc/unpass",
//     data: qs.stringify({ access_token, process_id, content })
//   });

// export const getUserFlows = ({access_token}) =>
//   request({
//     method: 'get',
//     url: `/api/v1/user-flows`,
//     params: {access_token}
//   });
