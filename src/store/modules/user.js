import { login, logout, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { StaticRouterMap } from "../../router/index";
const user = {
  state: {
    access_token: getToken(),
    name: "",
    avatar: "",
    roles: [],
    RouterList: [] // 动态路由
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      console.log("SET_TOKEN", token);
      state.access_token = token;
      console.log("已经设置SET_TOKEN");
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    set_router: (state, RouterList) => {
      state.RouterList = RouterList;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      console.log("loginloginlogin");
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        console.log(username, userInfo.password);
        login(username, userInfo.password).then(
          response => {
            console.log("============");
            console.log(response);
            const data = response.data;
            console.log("actions下的Login");
            console.log("data->", data);
            setToken(data.access_token);
            commit("SET_TOKEN", data.access_token);
            resolve();
          },
          fail => {
            console.log("----fail-----");
            console.log(fail);
            reject(fail);
          }
        );
        console.log(username, userInfo.password + "结束");
        // .catch(error => {
        //   console.log("erroreerrr");
        //   console.log(error);
        //   reject(error);
        // });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      console.log("{ commit, state }在GetInfo里");
      console.log({ commit, state });
      console.log(state.token);
      console.log(state.access_token);
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(response => {
            const data = response.data;
            if (data.roles && data.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              // commit('SET_ROLES', data.roles)
            } else {
              reject("getInfo: roles must be a non-null array !");
            }
            commit("SET_NAME", data.name);
            commit("SET_AVATAR", data.avatar);
            resolve(response);
          })
          .catch(error => {
            console.log("进入user.js的error");
            reject(error);
          });
      });
    },
    // 动态设置路由 此为设置设置途径
    setRouterList({ commit }, routerList) {
      commit("set_router", StaticRouterMap.concat(routerList)); // 进行路由拼接并存储
    },
    // 存储颗粒话权限
    setroles({ commit }, roleList) {
      commit("SET_ROLES", roleList);
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit("SET_TOKEN", "");
            commit("SET_ROLES", []);
            commit("set_router", []);
            removeToken();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
