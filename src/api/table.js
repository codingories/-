import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/api/v1/attendance/statistics",
    method: "get",
    params
  });
}

export function getMainDetail(params) {
  return request({
    url: "/api/v1/attendance/details",
    method: "get",
    params
  });
}
