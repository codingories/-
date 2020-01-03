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
