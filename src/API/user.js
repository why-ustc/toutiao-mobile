/*  */

/* 用户登录请求接口 */

// 导入 axios 模块
import request from '../utils/request'


// 在非组件模块 获取 store 中数据必须单独加载 store
// 此处 store.state.user = 组件中 this.$store.state...

// 设置 axios 统一拦截器，就不需要单独设置 token 了
// import store from '@/store/'



// 1：进行 axios 请求---参数是 手机号和验证码
//    登录注册 axios请求
export const login = (userInfo) => {
    return request({
        method: 'post',
        url: '/app/v1_0/authorizations',
        data: userInfo,
    })
}


// 2：进行 axios 请求---参数是 手机号
//    发送验证码 axios请求
export const sendSms = (mobile) => {
    return request({
        method: 'get',
        url: `/app/v1_0/sms/codes/${mobile}`
    })
}

// 3：发送 axios 请求，获取自己的信息。如粉丝数点赞数等等
export const getUserInfo = () => {
    return request({
        method: 'get',
        url: `/app/v1_0/user`

        // 绝大部分 axios 请求都要 token 令牌
        // headers: {
        //     Authorization: `Bearer ${ store.state.user.token }`
        // }
    })
}


// 4：发送 axios 请求，获取首页的 文章频道列表，如推荐 + linux + java
export const getArticlesList = () => {
    return request({
        method: 'get',
        url: `/app/v1_0/user/channels`
    })
}