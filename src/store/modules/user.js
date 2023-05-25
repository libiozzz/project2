//引入 登录、退出登录、获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
//引入 获取token、设置token、删除token的接口函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 重置路由
import { asyncRoutes,resetRouter,constantRoutes,anyRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    //获取token
    token: getToken(),
    //存储用户名
    name: '',
    //存储用户头像
    avatar: '',
    //服务器返回的标记信息（根据不同的角色，返回的标记信息，注意数组里面的元素是字符串）
    //1.菜单权限标记
    routes:[],
    //2.按钮权限标记
    buttons:{},
    //3.角色信息
    roles:[],
    //将服务器返回的标记信息与异步路由对比之后 最终需要展示的异步路由
    resultAsyncRoutes:[],
    //最终需要展示的完整路由（常量、异步、任意路由）
    resultAllRoutes:[]
  }
}

const state = getDefaultState()

//该函数用于对比服务器返回的标记信息与异步路由，返回最终需要展示的异步路由
const computedAsyncRoutes = (asyncRoutes,routes) => {
  return asyncRoutes.filter(item=>{
    if(routes.indexOf(item.name) != -1){
      //递归(还有二、三级路由)
      if(item.children && item.children.length){
        item.children = computedAsyncRoutes(item.children,routes)
      }
      return true
    }
  })
}

const actions = {
  // 处理登陆业务
  async login({ commit }, userInfo) {
    const { username, password } = userInfo //解构出用户名和密码
    const result = await login({ username: username.trim(), password: password }) //带着用户名和密码发请求
    console.log(result);
    if (result.code == 20000) {   //注：当前登录使用的是mock数据，mock数据的code成功是20000
      commit('SET_TOKEN', result.data.token)
      //本地持久化存储token
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        //获取用户信息
        const { data } = response
        //存储用户全部信息
        commit('SET_USERINFO',data)
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

const mutations = {
  //重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())  //清空state
  },
  //存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户信息
  SET_USERINFO:(state,userInfo)=>{
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    //菜单权限标记
    state.routes = userInfo.routes
    //按钮权限标记
    state.buttons = userInfo.buttons
    //角色信息
    state.roles = userInfo.roles
  },
  //存储最终计算出的异步路由
  SET_RESULTASYNCROUTES:(state,asyncRoutes)=>{
    state.resultAsyncRoutes = asyncRoutes
    //合并出最终需要展示的完整路由（常量、异步、任意路由），并进行存储
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    //给路由器添加新路由
    router.addRoutes(state.resultAllRoutes)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

