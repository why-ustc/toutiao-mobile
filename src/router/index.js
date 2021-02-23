import Vue from 'vue'
import VueRouter from 'vue-router'

// import { Dialog } from 'vant'
// import store from '@/store/'


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
            import ('../views/login/'),
        // 给路由添加额外的自定义数据--表示访问这个页面需要登录才能访问
        // meta: { requiresAuth: false }
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
                    import ('../views/home/'),
                // meta: { requiresAuth: false }
            },

            {
                path: '/qa', //子路由 问答
                name: 'qa',
                component: () =>
                    import ('../views/qa/'),
                // meta: { requiresAuth: false }
            }, {
                path: '/video', //默认子路由 为首页
                name: 'video',
                component: () =>
                    import ('../views/video/'),
                // meta: { requiresAuth: false }
            }, {
                path: '/my', //默认子路由 为首页
                name: 'my',
                component: () =>
                    import ('../views/my/'),
                // meta: { requiresAuth: false }
            },
        ]
    },
    // 搜索页路由
    {
        path: '/search',
        name: 'search',
        component: () =>
            import ('../views/search/'),
        // meta: { requiresAuth: false }
    },

    // 文章详情页路由：动态路由传参--articleId
    // 点击文章单元格 API/components/article-item--进入文章详情页
    {
        path: '/article/:articleId',
        name: 'article',
        component: () =>
            import ('../views/article/'),

        // meta: { requiresAuth: false },
        // 将路由动态路由参数 映射到组件的 props 中，访问和维护比较方便
        props: true
    },

    // 编辑用户信息页 路由
    {
        path: '/user/profile',
        name: 'userInfo',
        component: () =>
            import ('../views/userInfo'),
        // meta: { requiresAuth: false }
    },

    // 小智同学页面 路由
    {
        path: '/user/chat',
        name: 'userChat',
        component: () =>
            import ('../views/user-chat'),
        // meta: { requiresAuth: true }
    },
]


const router = new VueRouter({
    routes
})



// 导航守卫
// router.beforeEach((to, from, next) => {
//     //     // to 要去的页面
//     //     // from 来自那个页面
//     //     // next():放行标记

//     // 判断页面是否需要登录才能访问，如果是则进入if
//     if (to.meta.requiresAuth) {
//         // 如果已经登录，则直接放行
//         if (store.state.user) {
//             return next()
//         }

//         // 如果没登录，提示用户登录
//         Dialog.confirm({
//             title: '访问提示',
//             message: '该功能需要登录才能访问，确认登录吗',
//         }).then(() => {
//             // 如果用户点击确认--进入登录页面
//             router.replace({
//                 name: 'login',
//                 query: {
//                     redirect: router.currentRoute.fullPath
//                 }
//             })
//         }).catch(() => {
//             // 用户点击取消按钮--中断路由导航，停留在当前页面
//             next(false)
//         });
//     } else {
//         // 不需要登录的页面，直接放行
//         next()
//     }
// })

export default router