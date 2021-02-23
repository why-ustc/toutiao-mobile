<template>
    <div class="search-contain">
        
        <!-- 搜索框 -->
        <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，
            即可在 iOS 和 window手机 输入法中显示搜索按钮。 -->
        <form action="/">
            <van-search v-model="searchText" placeholder="请输入搜索关键词"
                show-action 
                @search="onSearch(searchText)" 
                @cancel="$router.back()"
                background="#3296fa"
                @focus="isShowResult = false" >
        </van-search>
        </form>


        <!-- 搜索结果组件 -->
        <search-result v-if="isShowResult" :searchText="searchText">

        </search-result>

        <!-- 搜索记忆联想 -->
        <search-suggestion v-else-if="searchText"
            :searchText="searchText"
            @search="onSearch">

        </search-suggestion>


        <!-- 搜索历史记录组件 -->
        <!-- @deleteAllHistory="searchHistoryList=$event"
            绑定子组件传的事件，$event 是参数，这样可少写一个函数 -->
        <search-history v-else 
        :searchHistoryList="searchHistoryList"
        @search="onSearch"
        @deleteAllHistory="searchHistoryList=$event"
        >

        </search-history>

        

       

    </div>
</template>



<script>

// 导入子组件--搜索联想记忆组件
import  SearchSuggestion  from "./components/search-suggestion"

// 导入子组件--历史记录组件
import SearchHistory from './components/search-history.vue'

// 导入子组件--搜索结果组件
import SearchResult from "./components/search-result.vue"

// 导入 获取搜索历史记录 axios 请求
import { getSearchHistorys } from "@/API/search.js"

import { setItem,getItem } from "@/utils/storage.js"







export default {
    // 组件名
    name:'searchIndex',

    created(){
        // 获取搜索历史记录
        this.loadGetHistory();
    },

    components:{
        // 注册子组件--搜索联想记忆组件
        SearchSuggestion,
        // 注册子组件--历史记录组件
        SearchHistory,
        // 注册子组件--搜索结果组件
        SearchResult
      
   
        
    },

    data(){
        return {
            // 双向绑定搜索框 搜索关键字
            searchText:'',

            // 三个组件只能显示一个
            // 控制搜索结果是否展示
            isShowResult:false,

            // 搜索历史记录数组
            // 数据持久化了，直接得到本地存储历史记录
            searchHistoryList:getItem('search-history') || [],
        }
    },

    methods:{
        // 点击搜索 确认事件
        // 点击搜索按钮 或者 enter 触发函数
        onSearch(searchText){
            // 点击点击联想建议也直接触发搜索--参数是搜索建议的文本
            // 搜索建议 子组件 绑定了一个传父组件函数：
            // @click="$emit('search',str)"
            this.searchText = searchText;


            // 每次搜索后--将内容放在搜索历史记录 数组最上面
            // 并且历史记录必须去重：没有返回 -1
            let index = this.searchHistoryList.indexOf(searchText);
            if(index !== -1){
                // 历史记录有，先去重，这次新的放到数组最上面
                this.searchHistoryList.splice(index,1);
            }
            // 无论有没有重复的，新的这个都放到数组最上面
            if(this.searchText !== "") 
                this.searchHistoryList.unshift(searchText);
            // console.log(this.searchHistoryList);


            // 如果用户已经登录，则搜索历史记录直接服务器添加了
            // 如果没登录，就使用本地的 历史记录
            setItem('search-history',this.searchHistoryList)
            
            

            // 展示搜索结果
            this.isShowResult = true;
        },

        // 获取搜索历史记录
        async loadGetHistory(){
            const { data:res } = await getSearchHistorys();
            
            // 因为后端限制了值=只自动存储4条历史记录，太少了
            // 所以这里我们让后端返回的历史记录和本地历史记录合并去重

            // 获取本地历史记录--res.data.keywords 是线上历史记录
            let localHostory = getItem('search-history');

            // 数组合并去重--set 数据结构，自动去重
            let set = new Set([...res.data.keywords,...localHostory])

            // 合并去重后的 搜索记录 重新赋值给展示的搜索记录
            // ES6 扩展运算符
            this.searchHistoryList = [...set];
            // console.log(this.searchHistoryList);

        } ,
        
        
    },

    watch:{
        // 历史搜索记录的 持久化
        // 只要历史搜索记录改变，就重新设置本地存储
        // 类似函数
        searchHistoryList(){
            setItem('search-history',this.searchHistoryList)
        }
    }
}
</script>

<style lang="less" scoped>
    .van-search__action{
        color: #fff !important;
    }
</style>