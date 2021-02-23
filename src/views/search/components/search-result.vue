
<template>
    
    <div class="search-result">
        
        <!-- 搜索结果列表 -->
        <van-list v-model="loading" :finished="finished"
            finished-text="没有更多了" @load="onLoad">

            <van-cell v-for="(article,index) in list" :key="index" 
                :title="article.title" />
        </van-list>
        

    </div>

</template>



<script>

// 导入 axios 请求
import { getSearchResults } from "@/API/search.js"

export default {
    // 组件名，用来给父组件导出
    name:'SearchResult',

    props:{
        searchText:{
            type:String,
            required:true
        }
    },

    data(){
        return {
            // 搜索结果展示 需要的三个数据
            list: [],
            loading: false,
            finished: false,

            // 搜索结果展示 所需要的数据--作为参数
            queryInfo:{
                page:1,
                per_page:10,
                q:this.searchText
            }

        }
    },

    methods:{
        // 搜索结果展示 需要的函数---点击了 enter 或者是 手机搜索按钮
        async onLoad() {
            //  1：获取搜索数据--参数是对象
            const { data:res } = await getSearchResults(this.queryInfo)
            // console.log(res.data.results);

            // 2：将获取的数据 push 到 list 数组中
            // 要用 ES6 扩展运算符，不然就是数组套数组：[[[]]]
            this.list.push(...res.data.results)

            // 3：取消加载状态
            this.loading = false;

            // 4：判断是否还有 返回的文章
            if(res.data.results.length){
                // 如果还有：就更新获取下一页文章-
                this.page++;
            }else {
                // 如果没有，就结束状态
                this.finished = true;
            }
        },


    }
    
}
</script>

<style>
    .search-result {
        position: fixed;
        left: 0;
        right: 0;
        top: 54px;
        bottom: 0;
        overflow-y: auto;
    }
</style>