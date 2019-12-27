import request from "@/utils/request";
import qs from "qs";

export function setAttendance(params) {
  console.log("params");
  console.log(params);
  return request({
    url: "/api/v1/attendance_adjust/set",
    method: "post",
    data: qs.stringify(params)
  });
}
