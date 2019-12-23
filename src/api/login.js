import request from "@/utils/request";
import axios from "axios";
import qs from "qs";

export function login(username, password) {
  console.log("进入api中login的请求");
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

export function getRouter(role) {
  console.log("=====role======");
  console.log(role);
  let data = { access_token: role };
  if (role === "admin") {
    return axios.get(
      " https://www.easy-mock.com/mock/5ca8799b4f62671c250622a9/vlogin/user/getRouterAdmin"
    );
  } else {
    console.log("进入到请求获取路由列表");

    return axios.get("/api/v1/admin-user/menus", { params: data });
  }
}

export function logout() {
  return request({
    url: "/user/logout",
    method: "post"
  });
}
