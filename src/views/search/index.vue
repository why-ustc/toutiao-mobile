<template>
    <div class="search-contain">
        
        <!-- 搜索框 -->
        <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，
            即可在 iOS 和 window手机 输入法中显示搜索按钮。 -->
        <form action="/">
            <van-search v-model="searchText" placeholder="请输入搜索关键词"
                show-action @search="onSearch" @cancel="$router.back()"
                background="#3296fa"
                @focus="isShowResult = false" >
        </van-search>
        </form>


        <!-- 搜索结果组件 -->
        <search-result v-if="isShowResult">

        </search-result>

        <!-- 搜索记忆联想 -->
        <search-suggestion v-else-if="searchText">

        </search-suggestion>


        <!-- 搜索历史记录组件 -->
        <search-history v-else>

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







export default {
    // 组件名
    name:'searchIndex',

    created(){

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
        }
    },

    methods:{
        // 点击搜索 确认事件
        onSearch(){
            this.isShowResult = true;
        }
    }
}
</script>

<style lang="less" scoped>
    .van-search__action{
        color: #fff !important;
    }
</style>