
<template>
    
    <div class="search-suggestion">

        <!-- 搜索联想记忆列表 -->
        <van-cell  icon="search" center
            v-for="(str,index) in searchSuggest" :key="index"
            @click="$emit('search',str)">

            <div slot="title" v-html="highlightTitle(str)"></div>

        </van-cell>

        

    </div>

</template>



<script>

// 导入 lodash,完成 函数防抖 + 函数节流
// 一般命名 _ 为 lodash
// import _ from 'lodash'

// 此处按需加载，目前只使用 lodash 中一个函数处理 防抖。
import { debounce } from 'lodash'

// 导入 axios 请求，搜索联想记忆 axios
import { getSearchSuggests } from "@/API/search.js"

export default {
    // 组件名，用来给父组件导出
    name:'SearchSuggestion',

    props:{
        searchText:{
            type:String,
            required:true,
        }
    },

    data(){
        return {
            // 存储 搜索联想建议 数据
            searchSuggest:[],
        }
    },

    methods:{
        // 搜索联想建议--高亮
        highlightTitle(str){
            // 正则表达式  /中间的内容/ 都会被当做普通字符串处理
            // 错误写法： /this.searchText/
            // new RegExp(this.searchText,'gi')--正则表达式构造函数
            // 参数1：字符串  参数2：匹配模式  返回：正则对象
            // g 全局匹配代替，否则只代替第一个,i 忽视大小写差别
            return str.replace(
                new RegExp(this.searchText,'gi'),
                `<span style="color: red">${this.searchText}</span>`

            )
        }
    },


    watch:{
        // 监视搜索框的 文字的改变，一旦改变就执行函数
        // 但是此法：输入的第一个字母不会触发 搜索，因为只有数据被此组件
        // 渲染后才能 watch 监视变化

        // ① async searchText(){
        //     const { data:res } = await getSearchSuggests(this.searchText);
        //     this.searchSuggest = res.data.options;
        //  }

        // 这才是监视的完整写法
        searchText:{
            // ② 当数据发生变化就执行 handler 函数
            // async handler(){
            //     const { data:res } = await getSearchSuggests(this.searchText);
            //     this.searchSuggest = res.data.options;
            // },
            // immediate:true,

            // 加入 函数防抖动--每隔 0.5 秒才能发一次 axios 请求，防抖动
            handler: debounce(async function(){
                const { data:res } = await getSearchSuggests(this.searchText);
                this.searchSuggest = res.data.options;
            },500),
            immediate:true,
        }
    }
}
</script>

<style>

</style>