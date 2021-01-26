// 项目请求模块

/* axios */

import axios from 'axios'


// 在非组件模块 获取 store 中数据必须单独加载 store
// 此处 store.state.user = 组件中 this.$store.state...
import store from '@/store/'

// 创建一个 axios 实例进行配置 并接受
const request = axios.create({

    // 配置基础路径
    baseURL: 'http://ttapi.research.itcast.cn/'
})



// 请求拦截器--统一为 axios 请求设置 token 拦截
// 这语法是固定的不需要背
// config=== axios 请求的相关信息
request.interceptors.request.use(function(config) {

    const { user } = store.state;

    // 如果用户已经登录，即有 token，则为 axios 统一设置 token
    if (user) {
        config.headers.Authorization = `Bearer ${user.token}`
    }

    // 处理完之后一定要把 config 返回，否则请求就会停在这里,发不出去
    return config

}, function(error) {
    // 请求出错，就返回 服务器返回的信息
    return Promise.reject(error)
})



// 响应拦截器

// 导出
export default request