<template>
    <div class="comment-reply">
        
        <!-- 顶部导航栏 -->
        <van-nav-bar
            :title=" `${commentReply.reply_count.toString()}条评论` "
        >
            <!-- 左侧关闭按钮 -->
            <van-icon name="cross" slot="left"
            @click="$emit('closePop')">

            </van-icon>
        </van-nav-bar>

        <!-- 当前 被评论项 -->
        <!-- 组件复用--要传组件需要的数据 -->
        <comment-item 
        :comment='commentReply'>

        </comment-item>

        <van-cell title="所有回复"/>

        <!-- 回复评论的 评论列表 -->
        <comment-list
        :source="commentReply.com_id"
        type = "c"
        :list = "commentList">
        </comment-list>


        <!-- 底部发布按钮 -->
        <div class="footer">
            
                <van-button 
                type="default"
                round
                size="mini"
                @click="isReplyShow = true"
                >写评论</van-button>
        </div>
 
        <!-- 写评论 的回复弹出层 -->
        <van-popup v-model="isReplyShow"
            position="bottom">

            <!-- 发送评论区域组件 -->
            <send-comment :target='commentReply.com_id'
            @sendSuccess='sendReplyComment'
            :articleId ='articleId'
            >

            </send-comment>
        </van-popup>

           



    </div>




   
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import SendComment from './send-comment'

export default {
    name:'CommentReply',

    props:{
        // 被回复的 原始评论
        commentReply:{
            type:Object,
            required:true
        },

        // 文章 id
        articleId:{
            type:[Object,Number,String],
            required:true
        }
    },

    created(){
        console.log(this.commentReply);
    },

    components:{
        CommentItem,
        CommentList,
        SendComment
    },

    data(){
        return {
            // 写评论 的回复弹出层 是否显示
            isReplyShow:false,

            // 评论列表
            commentList:[]
        }
    },

    methods:{
        // 发布回复评论成功
        sendReplyComment(commentObj){
            // 将刚发布的评论放最上面
            this.commentList.unshift(commentObj)

            // 更新回复评论数量
            this.commentReply.reply_count++

            // 关闭弹出层
            this.isReplyShow = false
        }
    }
}
</script>

<style lang="less" scoped>
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
            border-top: 1px solid #888;

           
                .van-button {
                    width: 200px;
                    height: 30px;
                    margin-bottom: 6px;
                    
                }

            
    }
</style>