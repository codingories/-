import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { StaticRouterMap } from '../../router/index'
const user = {
  state: {
    access_token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    RouterList: [], // 动态路由,
    ButtonPermission: undefined,
    user1: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.access_token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    set_router: (state, RouterList) => {
      state.RouterList = RouterList
    },
    SET_ButtonPermission: (state, ButtonPermission) => {
      state.ButtonPermission = ButtonPermission
    },
    SET_USER: (state, user) => {
      console.log('SET_USER')
      console.log(user)
      state.user1 = user
      console.log('state.user1')
      console.log(state.user1)
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(
          response => {
            const data = response.data
            console.log('data.user')
            console.log(data.user)
            commit('SET_USER', data.user)
            setToken(data.access_token)
            commit('SET_TOKEN', data.access_token)
            commit('SET_NAME', data.name)
            resolve()
          },
          fail => {
            reject(fail)
          }
        )
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(response => {
            const data = response.data
            if (data.roles && data.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              // commit('SET_ROLES', data.roles)
            } else {
              reject('getInfo: roles must be a non-null array !')
            }
            // commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.avatar)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 动态设置路由 此为设置设置途径
    setRouterList({ commit }, routerList) {
      commit('set_router', StaticRouterMap.concat(routerList)) // 进行路由拼接并存储
    },
    // 存储颗粒话权限
    setroles({ commit }, roleList) {
      commit('SET_ROLES', roleList)
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.access_token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('set_router', [])
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
