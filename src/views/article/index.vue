<template>
    <div class="article-container">

        <!-- 导航栏 -->
        <van-nav-bar title="文章详情"
            left-arrow
            @click-left="$router.back()"
        />


        <div class="article-wrap">
            <!-- 标题 -->
            <h2 class="title">{{articleDetail.title}}</h2>


            <!-- 作者头像 + 名字 -->
            <div class="authorInfo">
            <van-cell center>
                
                <!-- 右侧关注按钮 -->
                <div slot="right-icon" class="button">
                    <van-button type="default"
                        v-if="articleDetail.is_followed"
                        round
                        size="small"
                        @click="deleteFollowBtn()">
                        已关注
                    </van-button>

                    <van-button type="info"
                        v-else
                        icon="plus"
                        round
                        size="small"
                        :loading='isLoading'
                        loading-text="加载中..."
                        @click="addFollowBtn()">
                        关注
                    </van-button>
                </div>

                <!-- 左侧图像按钮 -->
                <div slot="icon" class="headImage">
                    <van-image
                        width="35"
                        height="35"
                        round
                        fit="cover"
                        :src="articleDetail.aut_photo"
                    />
                </div>

                <!-- 昵称  -->
                <div slot="title" class="title">
                    {{articleDetail.aut_name}}

                    <!-- 昵称下的描述信息 -->
                <div slot="label" class="publishDate">
                    {{articleDetail.pubdate | relativeTime}}
                </div>
                </div>

                

            </van-cell>
            </div>

            <!-- 文章正文 -->
            <div class="markdown-body"
                v-html="articleDetail.content"
                ref="articleContent"
            ></div>


            <!-- 文章评论列表 -->
            <comment-list :source="articleId"
            :list='commentList'
            @commentCount='commentsCount = $event'
            @commentReply='commentReplyClick'>

            </comment-list>
        </div>
        

        <!-- 底部区域 -->
        <div class="footer">

            <!-- 写评论按钮 -->
            <div class="comment">
                <van-button 
                type="default"
                round
                @click="popShow = true"
                >写评论</van-button>
            </div>

            <!-- 评论数图标 -->
            <div class="commentIcon">
                <van-icon name="chat-o" :badge="commentsCount" />
            </div>

            <!-- 收藏图标 -->
            <div class="collectIcon">
                <van-icon 
                :name="articleDetail.is_collected ? 'star':'star-o'" 
                :color="articleDetail.is_collected ? 'orange':'#777'"
                @click="onCollect()">
                </van-icon>
            </div>

            <!-- 点赞图标 -->
            <div class="addLike">
                <van-icon 
                :name="articleDetail.attitude===1? 'good-job':'good-job-o'"
                :color="articleDetail.attitude===1 ? 'hotpink':'#777'"
                @click="onLike">

                </van-icon>
            </div>



        </div>

        <!-- 写评论弹出层 -->
        <van-popup v-model="popShow"
            position="bottom">

            <!-- 发送评论区域组件 -->
            <send-comment :target='articleId'
            @sendSuccess='sendSuccess'>

            </send-comment>
        </van-popup>

        
        <!-- 评论回复弹出层 -->
        <van-popup v-model="isReplyShow"
            position="bottom">
            
            <!-- 评论的回复 组件 -->
            <!-- 这里使用 v-if 的目的是让组件随着弹出层的显示进行
            渲染和销毁，防止加载过的评论组件不重新渲染 导致评论数据
            重复。也就是说点击一个评论其回复数据会缓存，点击下一个还是这些 -->
            <comment-reply
            v-if="isReplyShow"
            @closePop="isReplyShow = false"
            :commentReply = "commentReply"
            :articleId = "articleId"
            >
            </comment-reply>

        </van-popup>




        

    </div>
</template>



<script>

// 导入 github 关于文章正文的 css 样式文件
import './github-markdown.css'

// 导入 请求文章具体内容 axios 请求
import {
    getArticle,
    addFollow,
    deleteFollow,
    addCollect,
    deleteCollect,
    addLike,
    deleteLike,
    } from '@/API/article.js'

// 导入预览图片 函数
import { ImagePreview } from 'vant';

import CommentList from './components/comment-list.vue';
import SendComment from './components/send-comment.vue'
import CommentReply from './components/comment-reply.vue'



export default {
    components: { 
      CommentList,
      SendComment ,
      CommentReply,
      
    },

    name:"ArticleIndex",


    created(){
        // 根据文章 id 获取文章具体内容 函数
        this.loadGetArticle();
    },

    data(){
        return {
            // 文章具体内容
            articleDetail:{},

            // 加载状态
            isLoading:false,

            // 评论区弹出层内容
            popShow:false,

            // 文章评论列表
            commentList:[],

            // 文章评论总数
            commentsCount:0,

            // 控制回复评论弹出层
            isReplyShow:false,

            // 被评论的评论项
            commentReply:{}

        }
    },

    // 在组建中获取动态路由参数：articleId
    // 方式一：this.$route.params.xxx
    // 方式二：路由 props 传参--推荐：在路由处开启，props:true
    // 将路由动态路由参数 映射到组件的 props 中，访问和维护比较方便
    props:{
        articleId:{
            type:[String,Number,Object],
            required:true
        }
    },

    methods:{
        // 根据文章 id 获取文章具体内容 函数
        async loadGetArticle(){
            const { data:res } = await getArticle(this.articleId)
            this.articleDetail = res.data;
            // console.log(this.articleDetail);

            this.$nextTick(() => {
                this.handlePreviewImage();
            })
        },

        // 点击回复 评论按钮
        commentReplyClick(comment){
            // 打开评论回复组件
            this.isReplyShow = true;
            
            // 赋值 被评论的 评论项
            this.commentReply = comment
        },

        // 预览图片执行步骤
        handlePreviewImage(){
            // 1：获取 文章内容 DOM 容器， ref 获取 Dom 容器
            const articleContent = this.$refs.articleContent;

            // <div><具体内容 html 语句></div>
            // console.log(articleContent);


            // 2：得到所有的 image 标签--会发现 得到空数组

            //    原因：数据改变(this.articleDetail = res.data;)
            // 影响视图更新(DOM 数据) 不是立即的
            // 如果需要修改数据后马上操作被该数据影响的视图 DOM,
            // 需要把这个代码放到 $nextTick 中
            // const imgs = articleContent.querySelectorAll('img');
            // console.log(imgs);

            // this.$nextTick 是 vue 中提供的方法，专门处理这种问题
            const imgs = articleContent.querySelectorAll('img');
            // console.log(imgs);


            // 3：遍历 img 绑定 点击事件
            const imgPath = []; // 保存所有图片地址
            imgs.forEach((img,index) => {
                imgPath.push(img.src)
                img.onclick = function () {
                    
                    // 使用 vant 中 预览图片的函数
                    ImagePreview({
                        images: imgPath,
                        closeable: true,
                        // 显示第一张图片的索引
                        startPosition: index,
                    });
                }
            })
        },

        // 点击关注按钮 触发
        async addFollowBtn(){
            this.isLoading = true;
            console.log(this.articleDetail);
            await addFollow(this.articleDetail.aut_id);
            
            // 关注按钮--> 已经关注,改变状态
            this.articleDetail.is_followed = !this.articleDetail.is_followed;
            // 提示关注成功
            this.$toast.success('关注用户成功')
            // 取消加载状态
            this.isLoading = false
        },

        // 取消关注按钮
        async deleteFollowBtn(){
            await deleteFollow(this.articleDetail.aut_id)
            
            
            // 关注按钮--> 已经关注,改变状态
            this.articleDetail.is_followed = !this.articleDetail.is_followed;
            // 提示关注成功
            this.$toast.success('已取消关注')
        },

        // 收藏文章与取消收藏文章
        async onCollect(){
            // 如果已经收藏文章，则点击就取消收藏
            if(this.articleDetail.is_Collect){
                await deleteCollect(this.articleId);
                
            }else {
                // 如果没收藏文章，点击就收藏
                await addCollect(this.articleId);
            }

            this.articleDetail.is_collected =
                !this.articleDetail.is_collected;
        },

        // 点赞与取消点赞
        async onLike(){
            // 如果未点赞
            if(this.articleDetail.attitude === 1){
                await deleteLike(this.articleId);
                this.articleDetail.attitude =-1;
            }else {
                await addLike(this.articleId);
                this.articleDetail.attitude =1;
            }
        },

        // 子组件评论成功
        sendSuccess(newComment){
            // 把刚发布的新评论放到列表顶部
            this.commentList.unshift(newComment);

            // 关闭弹出留言区
            this.popShow = false;
        }

    }
}
</script>

<style lang="less" scoped>
    .article-container {
        background-color: #fff !important;
        // 第一行导航栏
        .van-nav-bar {
            background-color:#3196fa ;

            /deep/.van-icon-arrow-left::before{
                color:#fff;
            }

            /deep/.van-nav-bar__title {
                color: #fff !important;
            }
        }

        // 第二行：标题
        .title {
            font-size: 20px;
            color: #3a3a3a;
            padding: 14px;
        }

        // 第三行-作者信息
        .authorInfo {
            .headImage {
                width: 35px;
                height: 35px;
                // margin-right: 8px;
            }
            .title {
                font-size: 12px;
                color: #333;
            }
            .publishDate {
                font-size: 12px;
                color: #b4b4b4;
            }
            .button {
               .van-button {
                   width: 85px;
                   height: 29px;
               }
            }
        }

        .markdown-body {
            padding: 14px;
            background-color: #fff;

        }
        .article-wrap {
            position: fixed;
            left: 0;
            right: 0;
            top: 46px;
            bottom: 44px;
            overflow-y: auto;
        }

        .footer {
            width: 100%;
            height: 46px;
            display: flex;
            justify-content: space-around;
            // text-align: center;
            align-items: center;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #fff;

            .comment {
                .van-button {
                    width: 160px;
                    height: 30px;
                    margin-bottom: 6px;
                }
            }
            .commentIcon{
                .van-icon{
                    width: 20px;
                    height: 20px;
                }
            }
            .collectIcon {
                .van-icon{
                    width: 20px;
                    height: 20px;
                }
            }
            .addLike {
               .van-icon{
                    width: 20px;
                    height: 20px;
                }
            }

        }
    }
</style>