<template>
    <div class="home-container">
        
        <!-- 第一行--搜索框 --> 
        <van-field  center label="今日头条" >

            <template #button>
                <van-button size="small" type="info" icon="search"
                round class="search" to="/search">
                搜索</van-button>
            </template>

        </van-field>


        <!-- 第二行-- 文章频道列表：推荐 + linux... -->
        <van-tabs v-model="active" >

            <van-tab :title="channel.name" v-for="channel in channels"
                :key="channel.id" class="channels">

                <!-- 显示文章内容--使用导入的 子组件 ArticleList -->
                <!-- 父组件传给子组件：子组件去渲染文章列表 -->
                <!-- F-Son-channel 是子组件 props 属性名，channel 是属性值 -->

                <!-- 以下俩种标签使用都可以 -->
                <!-- <article-list :FtoSonChannel='channel'></article-list> -->
                <ArticleList :FtoSonChannel='channel'></ArticleList>


                
            </van-tab>

            <!-- 汉堡按钮是 固定定位，脱标流，会挡住最后一个文章频道的字
                所以在标准流中 占位：宽高等于汉堡标签 -->
            <div slot="nav-right" class="last">
                
            </div>

            <!-- 插槽--放右侧汉堡标签 -->
            <div slot="nav-right" class="editChannels" @click="popupShow=true">
                <div class="icon-edit">
                    <van-icon name="wap-nav"  />
                </div>
            </div>            
        </van-tabs>


        
        <!-- 编辑文章列表的 弹出层 -->
        <van-popup v-model="popupShow" position="bottom"  closeable
            :style="{ height: '100%' }" get-container="body" 
            close-icon-position="top-left">

            <!-- 因为弹出层内容太多，逻辑也多。因此单独封装成一个组件 -->
            <channels-edit :myChannels="channels"  
                :active="active"
                @editActive="changeActive"
                @closePopup="popupShow = false">
            </channels-edit>
    
        </van-popup> 

    </div>
</template>

<script>

// 导入 axios 请求，文章频道列表
import { getArticlesList } from '@/API/user.js'

// 导入自己创立的 专门用于显示 文章内容 的组件
// 并注意在 此组件要注册 子组件 ArticleList
// ArticleList---此组件 对 子组件的命名，与挂载处名字一致就行
import ArticleList from './components/article-list'

// 导出频道弹出层 组件
import channelsEdit from './components/channels-edit'

import { getItem } from "@/utils/storage.js"


export default {

    // 组件名字--用于其他组件使用
    name:'HomeIndex',

    // 挂载子组件
    components:{
        // 挂载子组件--显示文章内容区域
        ArticleList,

        // 频道弹出层组件
        channelsEdit,
    },

       created(){
        // 获取文章频道列表
        this.getArticles();
        },

    data(){
        return {

            // 绑定文章频道的激活页
            active:0,

            // 文章频道的数据
            channels:[],

            // 控制弹出层是否显示
            popupShow:false,
        }
    },

    methods:{
        
        async getArticles(){
            let channels = [];
            // 如果用户登录了，就获取此用户的频道列表
            if(this.$store.state.user){
                const { data:res } = await getArticlesList();
                channels = res.data.channels;
            }else {
                // 如果用户未登录，就获取本地存储的频道列表
                const localChannels = getItem('user-channels');
                
                // 如果有点本地存储列表，就使用
                if(localChannels) {
                    channels = localChannels
                };

                // 如果本地存储没有频道列表,
                // 那就请求默认推荐的频道列表
                if(!localChannels){
                    const { data:res } = await getArticlesList();
                    channels = res.data.channels;
                }
            }

            // 最后赋值channels
            this.channels = channels;
            
        },

        changeActive(index){
            this.active = index;
        },

        
    }
}
</script>



<style lang="less" scoped>
    
    .home-container {

        // 第一行样式
        .van-field {
            background-color: #3196fa;
            
            /deep/.van-field__label{
                color: #fff;
            }

            .search {
            width: 200px;
            height: 32px;
            background-color: #5babfb;
            font-size: 14px;
            color: #fff;

                .van-icon-search::before{
                    color:#fff;
                    font-size: 16px;
                }
            }
        }

        /deep/.van-tab {
            border-right: 1px solid #eee;
            width: auto;
            min-width: 65px;

        }

        .last {
            width: 33px;
            flex-shrink: 0;
        }
        

        .editChannels {

            .icon-edit {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                height: 44px;
                width: 36px;
                line-height: 44px;
                position:fixed;
                right: 0;
                background-color: #fff;
                opacity: .9;        
            }
            
        }

    /deep/.van-tabs__line {
        background-color:#3296fa !important;
        width: 15px;
        height: 3px;
    }
        

    }

</style>