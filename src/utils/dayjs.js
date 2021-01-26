/* 
    初始化 dayjs 相关配置
*/

import dayjs from 'dayjs'

// 配置中文使用语言包
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn') // use locale globally



// 加载 相对时间 插件 加载相对时间 插件  相对时间 插件
// 这是文档写法
// var relativeTime = require('dayjs/plugin/relativeTime')

// 这是 ES6 写法
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)








// 导入 vue,在此处直接将 相对时间 写成一个过滤器--本质就是函数，
import Vue from 'vue'
/* 
把处理相对时间的代码包装成全局过滤器，然后任何组件就可以直接使用了
过滤器本质就是函数，组件中使用：{{ XXX | relative(过滤器名字)}}
管道符前面的内容会作为参数传递给过滤器函数
过滤器的返回值会渲染到使用过滤器的 组件模板中
*/
// relativeTime-自定义过滤器名  value--参数XXX
Vue.filter('relativeTime', value => {
    return dayjs(value).from(dayjs())
})





// 时间日期格式化
// dayjs()---获取当前时间
console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'));


//   控制台显示：10分钟前
// console.log(dayjs('2021-01-23 17:20').from(dayjs()));

//   11年内
// console.log(dayjs('2010-01-02').to(dayjs()));