import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载全局样式
import './styles/index.less'

// 加载 vant 组件库
import Vant from 'vant';
// 加载 vant 样式
import 'vant/lib/index.css';
// 全局注册 vant 中组件
Vue.use(Vant);


// 自动设置基准值 REM (html 标签字大小)
import 'amfe-flexible'

// 生产环境提示关闭
Vue.config.productionTip = false

// 创建 Vue 根组件 APP，将路由， vuex 挂载上去
// 把 APP 根组件 渲染到 #app 节点
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')