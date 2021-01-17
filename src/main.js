import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载全局样式
import './styles/index.less'

// 生产环境提示关闭
Vue.config.productionTip = false

// 创建 Vue 根组件 APP，将路由， vuex 挂载上去
// 把 APP 根组件 渲染到 #app 节点
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')