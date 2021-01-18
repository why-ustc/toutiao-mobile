import Vue from 'vue'
import VueRouter from 'vue-router'


// 以前 路由懒加载方式
// import Login from '../views/login/index.vue'
// const Login =() => import('../views/login')

Vue.use(VueRouter)



// 路由规则
const routes = [

    // 直接自动路由懒加载方式
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('../views/login')
    }
]



const router = new VueRouter({
    routes
})

export default router