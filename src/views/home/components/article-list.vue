<template>

    <div class="article-list">
        
        <!-- 
            List 组件通过 loading 和 finish 俩个变量控制加载状态，当组件
        初始化或滚动到底部，会触发 loading 事件并将 loading 设置为 true，
        此时可以发起异步更新请求更新数据，数据更新完毕，loading设置为 flase
        即可。 若数据已经全部加载完了， 就把 finish 设置为 true 即可。
            
            “load 事件”：list 组件初始化会自动触发 loading 事件，用于加载
        第一屏的文章数据，如果第一次加载数据太少不够铺满屏幕，list 会自动继续
        触发 loading 事件，知道铺满屏幕。

            'loading' 属性：控制加载中的 loading 状态， 非加载中，loading 
        为 false,此时会根据 列表滚动位置 判断是否触发 load 事件；加载中 loading
        为 true,表示正在发起异步更新请求。

            finish 属性，控制加载 结束的状态
        -->

        <!-- 下拉刷新组件 -->
        <van-pull-refresh v-model="isRefreshLoading" @refresh="onRefreshLoad"
          :success-text="refreshSuccessText" :success-duration='1000'>
            
            <!-- 文章内容 -->
            <van-list v-model="loading" :finished="finished"
                finished-text="没有更多了" @load="onLoad">

                <!-- 原本只显示文章标题 -->
                <!-- <van-cell v-for="(item,index) in articlesList" :key="index" 
                    :title="item.title" /> -->

                <!-- 现在渲染文章内容 包括图片等 -->
                <!-- 江边里的文章传给 子组件 -->
                <article-item v-for="(article,index) in articlesList" 
                    :key="index" :articleItem="article">  
                </article-item>
            </van-list>
        </van-pull-refresh>

        

    </div>

</template>

<script>

// 导入 axios 请求
import { getArticlesContent } from '@/API/article.js'

// 加载渲染文章内容(包括图片) 的组件
import ArticleItem from '@/components/article-item'

export default {

    created(){
        this.onLoad();
        // console.log(this.FtoSonChannel);
    },

    // 给组件起名字，用于父组件导入此组件
    name:'ArticleList',

    // 注册子组件
    components:{
        // 加载渲染文章内容(包括图片) 的组件
        ArticleItem
    },

    // 传值使用
    props:{
        // 父组件传输的 文章列表数据
        FtoSonChannel:{
            type:Object,
            required:true,
        }
    },

    data(){
        return {
            // 用于渲染 文章内容的组件 需要的数据
            articlesList: [], //数据列表
            loading: false, // 控制加载中的 loading 状态
            finished: false, // 控制加载状态的结束

            // 获取下一页数据的时间戳
            timestamp:null,

            // 下拉刷新 状态
            isRefreshLoading:false,

            // 下拉刷新成功提示
            refreshSuccessText:'',

            


        }
    },

    methods:{
            // 用于渲染 文章内容 组件使用方法
            async onLoad() {
                // 1：axios 请求获取数据
                const { data:res } = await getArticlesContent({
                    // 频道的 id, 父组件传值了
                    channel_id:this.FtoSonChannel.id,

                    // 时间戳，请求新的推荐数据传当前的时间戳，
                    // 请求历史推荐传指定的时间戳
                    timestamp:this.timestamp || Date.now(),

                    // 是否包含置顶，进入页面第一次请求时要包含置顶文章，
                    //     1-包含置顶，0-不包含
                    with_top:1
                });

                // console.log(res);

                
                // 2：把文章数据放到 数组中(只能 push)    
                this.articlesList.push(...res.data.results)
                // console.log(res.data.results);

                // 3：设置本地加载状态结束，它才判断是否需要继续加载
                //    否则会永远停留在这
                this.loading = false;

                // 4：数据加载完毕后】
                if(res.data.results.length){
                    // 加载下一页
                    this.timestamp = res.data.pre_timestamp;
                }else {
                    // 没有数据了，结束家在状态
                    this.finished = true
                }
            },

            // 下拉刷新触发函数
            async onRefreshLoad(){
                 // 1：axios 请求获取数据
                const { data:res } = await getArticlesContent({
                    channel_id:this.FtoSonChannel.id,
                    timestamp:Date.now(),
                    with_top:1
                });

                // 2：将新数据放到数组列表中
                this.articlesList.unshift(...res.data.results)
                console.log(res);

                // 3：刷新状态关闭，否则一直刷新
                this.isRefreshLoading = false;

                // 刷新成功提示
                this.refreshSuccessText = `刷新了${res.data.results.length}条数据`
            },


    }
}
</script>

<style lang="less" scoped>

    .article-list {
        position: fixed;
        left: 0;
        right: 0;
        top: 96px;
        bottom: 50px;
        overflow-y:auto;
    }

</style>