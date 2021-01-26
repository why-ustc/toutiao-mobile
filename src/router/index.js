import Vue from 'vue'
import VueRouter from 'vue-router'


// 以前 路由懒加载方式
// import Login from '../views/login/index.vue'
// const Login =() => import('../views/login')

Vue.use(VueRouter)



// 路由规则
const routes = [

    // 直接自动路由懒加载方式---登录组件
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('../views/login/')
    },
    {
        // 总布局页面---路由路径是： /
        path: '/',
        // 如果路由有子路由，就不需要起名字 name 属性
        component: () =>
            import ('../views/layout/'),

        // 为总布局页面配置子路由
        children: [{
                path: '', //默认子路由 为首页
                name: 'home',
                component: () =>
                    import ('../views/home/')
            },

            {
                path: '/qa', //子路由 问答
                name: 'qa',
                component: () =>
                    import ('../views/qa/')
            }, {
                path: '/video', //默认子路由 为首页
                name: 'video',
                component: () =>
                    import ('../views/video/')
            }, {
                path: '/my', //默认子路由 为首页
                name: 'my',
                component: () =>
                    import ('../views/my/')
            },
        ]
    },
    // 搜索页路由
    {
        path: '/search',
        name: 'search',
        component: () =>
            import ('../views/search/')
    },

]



const router = new VueRouter({
    routes
})

export default router