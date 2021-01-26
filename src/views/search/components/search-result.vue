
<template>
    
    <div class="search-result">
        
        <!-- 搜索结果列表 -->
        <van-list v-model="loading" :finished="finished"
            finished-text="没有更多了" @load="onLoad">

            <van-cell v-for="item in list" :key="item" :title="item" />
        </van-list>
        

    </div>

</template>



<script>
export default {
    // 组件名，用来给父组件导出
    name:'SearchResult',

    data(){
        return {
            // 搜索结果展示 需要的三个数据
            list: [],
            loading: false,
            finished: false,

        }
    },

    methods:{
        // 搜索结果展示 需要的函数
        onLoad() {
             // 异步更新数据
             // setTimeout 仅做示例，真实场景中一般为 ajax 请求
             setTimeout(() => {
               for (let i = 0; i < 10; i++) {
                 this.list.push(this.list.length + 1);
               }

               // 加载状态结束
               this.loading = false;

               // 数据全部加载完成
               if (this.list.length >= 40) {
                 this.finished = true;
               }
             }, 1000);
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