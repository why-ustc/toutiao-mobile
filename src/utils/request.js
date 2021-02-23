// 项目请求模块

/* axios */

import axios from 'axios'

import JSONbig from 'json-bigint'

import { Toast } from 'vant'



// 在非组件模块 获取 store 中数据必须单独加载 store
// 此处 store.state.user = 组件中 this.$store.state...
import store from '@/store/'
import router from '../router'


// 为刷新 token 单独创造一个 axios 请求，可以不经过 之前的 拦截器，防止混淆
const refreshTokenReq = axios.create({

    // 配置基础路径
    baseURL: 'http://ttapi.research.itcast.cn/',
})

// 创建一个 axios 实例进行配置 并接受
const request = axios.create({

    // 配置基础路径
    baseURL: 'http://ttapi.research.itcast.cn/',

    // 定义后端返回的原始数据的处理
    // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
    transformResponse: [function(data) {
        // Do whatever you want to transform the data
        // console.log(data)

        // 后端返回的数据可能不是 JSON 格式字符串
        // 如果不是的话，那么 JSONbig.parse 调用就会报错
        // 所以我们使用 try-catch 来捕获异常，处理异常的发生
        try {
            // 如果转换成功，则直接把结果返回
            return JSONbig.parse(data)
        } catch (err) {

            // console.log('转换失败', err)
            // 如果转换失败了，则进入这里
            // 我们在这里把数据原封不动的直接返回给请求使用
            return data
        }

        // axios 默认在内部使用 JSON.parse 来转换处理原始数据
        // return JSON.parse(data)
    }]
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
request.interceptors.response.use(response => {
    // 在2xx范围内的任何状态代码都会触发此函数，这里主要用于处理响应数据
    // 请求响应成功进入这里
    return response
}, async function(error) {
    // 请求响应失败进入这里
    // 任何超出2xx范围的状态码都会触发此函数，这里主要用于处理响应错误:如400,401
    // console.log(error);
    const status = error.response.status

    if (status === 400) {
        // 客户端请求参数错误
        Toast.fail('客户端请求参数异常')

    } else if (status === 401) {
        // token 无效(过有效期)

        // 如果没有 user 或者 user.token，直接去登录
        const { user } = store.state
        if (!user || !user.token) {
            // 跳转到登录页
            return redirectLogin()
        }

        // 如果有 refresh_token,则请求获取新的 token
        // 此请求方法没有拦截器，是不同的 token,
        // 否则 401 去请求，继续因为 401被 axios拦截器拦截
        try {
            const { data: res } = await refreshTokenReq({
                url: '/app/v1_0/authorizations',
                method: 'put',
                headers: {
                    Authorization: `Bearer ${user.refresh_token}`
                }
            })

            // 将新 token 更新到容器中
            user.token = res.data.token
            store.commit('setUser', user)

            // 把失败的请求 重新发出去
            // error.config: 本次请求的相关配置对象
            return request(error.config)

        } catch (error) {
            // 刷新 token 失败，直接跳转登录页
            redirectLogin()
        }

    } else if (status === 403) {
        Toast.fail('没有权限操作')

    } else if (status >= 500) {
        Toast.fail('服务端异常，请稍后重试')
    }


    // 将未处理的异常往外抛
    return Promise.reject(error)
})

// 跳转登录函数
function redirectLogin() {
    // router.replace('/login')
    router.replace({
        name: 'login',
        // 传递查询参数，查询参数会以 ？ 作为分隔符 放到 url后面
        query: {
            // 数据名：自己起 + 当前路由路径(相当于 this.$router)
            redirect: router.currentRoute
        }
    })
}

// 导出
export default request