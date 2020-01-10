import request from "@/utils/request";
import qs from "qs";

export function getUsers(params) {
  return request({
    url: "/api/v1/admin-user/index",
    method: "get",
    params
  });
}

export function getRoles(params) {
  return request({
    // /api/v1/admin-role/index
    url: "/api/v1/admin-role/index",
    method: "get",
    params
  });
}

export function getMenus(params) {
  return request({
    // /api/v1/admin-role/index
    url: "/api/v1/admin-user/menus",
    method: "get",
    params
  });
}

export function getAttendance(params) {
  return request({
    // /api/v1/admin-role/index
    url: "/api/v1/attendance/groupList",
    method: "get",
    params
  });
}

export function getDpet(params) {
  return request({
    url: "/api/v1/dept/getList",
    method: "get",
    params
  });
}

// export function saveuserinfo(data) {
//   // console.log(data);
//   return request({
//     url: "/api/v1/admin-user/save",
//     method: "post",
//     data: qs.stringify(data)
//   });
// }

export function saveuserinfo({
  access_token,
  id,
  username,
  name,
  workno,
  gender,
  mobile,
  password,
  repassword,
  role_id,
  dept_id,
  attendance_group_id
}) {
  // const title = tpl['title']
  const data = new window.FormData();
  data.append("access_token", access_token);
  data.append("id", id);
  data.append("username", username);
  data.append("name", name);
  data.append("workno", workno);
  data.append("gender", gender);
  data.append("mobile", mobile);
  data.append("password", password);
  data.append("repassword", repassword);
  data.append("role_id", role_id);
  data.append("dept_id", dept_id);
  data.append("attendance_group_id", attendance_group_id);
  // Object.keys(tpl).forEach(item => {
  //   if (item !== 'title' && item !== 'flow_name') {
  //     data.append(`tpl[${item}]`, tpl[item])
  //   }
  // })
  return request({
    method: "post",
    url: "/api/v1/admin-user/save",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data
  });
}

// export function saveuserinfo({ access_token, id, username, name, dept_id }) {
//   const data = new window.FormData();
//   data.append("access_token", access_token);
//   data.append("id", id);
//   data.append("username", username);
//   data.append("name", name);
//   data.append("dept_id", dept_id);
//   return request({
//     method: "post",
//     url: "/api/v1/admin-user/save",
//     headers: {
//       "Content-Type": "multipart/form-data"
//     },
//     data
//   });
// }

// access_token: "f6f2e8347a6d234b5cdd52a2adbbfaeb"
// id: 114
// username: "telangpu"
// name: "特朗普"
// workno: "0011"
// gender: "1"
// mobile: null
// password: ""
// repassword: ""
// role_id: (2) [1, 9, __ob__: Observer]
// dept_id: 12
// attendance_group_id: 0
