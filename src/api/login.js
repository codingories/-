import request from "@/utils/request";
import axios from "axios";
import qs from "qs";

export function login(username, password) {
  let data = { account: username, password: password };
  return request({
    url: "/api/v1/login",
    method: "post",
    data: qs.stringify(data)
  });
}

export function getInfo(token) {
  return request({
    url: "/user/info",
    method: "get",
    params: { token }
  });
}

export function getRouter(roule) {
  console.log(roule);
  if (roule === "admin") {
    return axios.get(
      " https://www.easy-mock.com/mock/5ca8799b4f62671c250622a9/vlogin/user/getRouterAdmin"
    );
  } else {
    return axios.get(
      " https://www.easy-mock.com/mock/5ca8799b4f62671c250622a9/vlogin/user/getRouteReditor"
    );
  }
}

export function logout() {
  return request({
    url: "/user/logout",
    method: "post"
  });
}
