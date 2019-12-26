import request from "@/utils/request";
import qs from "qs";

export function getUsers(params) {
  return request({
    url: "/api/v1/admin-user/index",
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
