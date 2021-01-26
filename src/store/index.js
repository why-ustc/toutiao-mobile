import Vue from 'vue'
import Vuex from 'vuex'

// 导入对 本地存储操作的封装函数
import { getItem, setItem, removeItem } from '../utils/storage'

Vue.use(Vuex)

// 用别名代替 本地存储中的 名字，可以避免一些错误
const USER_KEY = "toutiao_user"

export default new Vuex.Store({
    state: {

        // 记录当前用户登录状态

        // user: JSON.parse(window.localStorage.getItem('user')),
        user: getItem(USER_KEY)
    },

    // 同步函数改变 state 中数据值只能是 mutations 中方法
    mutations: {

        // 设置 token 值
        setUser(state, data) {
            state.user = data;

            // 为了防止页面刷新数据丢失，还需要将 token 数据放在本地存储中，
            // 这里仅仅为了持久化数据--本地存储只能存字符串，不可对象

            // window.localStorage.setItem('user', JSON.stringify(data));
            setItem(USER_KEY, state.user)


        }
    },
    actions: {},
    modules: {}
})