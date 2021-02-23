<template>
    <div class="comment-item">
        
        <!-- 每个评论项 -->
        <van-cell>

            <!-- 左侧头像 -->
            <div slot="icon">
                <van-image
                    round
                    class="image"
                    fit="cover"
                    :src="comment.aut_photo"
                />
            </div>

            <!-- 作者名字 + 评论内容 -->
            <div slot="title">
                <div class="author">{{comment.aut_name}}</div>

                <div class="comment-content">
                    {{comment.content}}
                </div>
            </div>

            <!-- 发布时间 与 回复按钮 -->
            <div slot="label" class="label">
                <span class="date">
                    {{comment.pubdate | dateTime('MM:DD HH:mm')}}
                </span>

                <van-button type="default"
                    round size="mini"
                    class="replyBtn"
                    @click="$emit('commentReply',comment)">
                        {{comment.reply_count}}回复
                    </van-button>
            </div>

            <!-- 右侧点赞图标 -->
                <div @click="onCommentLike">
                    <van-icon class='like'
                        :name="comment.is_liking? 'good-job':'good-job-o'"
                        :class="{likeIcon:comment.is_liking}"
                    >
                    </van-icon>

                    <span>{{comment.like_count}}</span>
                </div>

            
        </van-cell>

    </div>
</template>

<script>
// 导入时间过滤器
import '@/utils/dayjs.js'

// 导入 axios 请求
import { addCommentLike,deleteCommentLike } from "@/API/comment.js"

export default {
    name:'CommentItem',

    props:{
        comment:{
            type:Object,
            required:true
        }
    },

    methods:{
        // 对评论点赞
        async onCommentLike(){
            console.log(this.comment);
            // 如果已经点赞，点击就取消点赞
            if(this.comment.is_liking){
                await deleteCommentLike(this.comment.com_id)
                this.comment.like_count--;
                this.comment.is_liking = false
            }else {
                await addCommentLike(this.comment.com_id)
                this.comment.like_count++;
                this.comment.is_liking = true
            }   

        }
    }
}
</script>

<style lang="less" scoped>
    .comment-item {

        /* 发布时间 + 回复按钮 */
        .label {
            display: flex;
            justify-content: flex-start;
            text-align: center;
            .date {
                font-size: 10px;
            }
            .van-button--mini {
                width: 54px;
                margin-left: 12px;
            }
        }

        .image {
            width:36px;
            height: 36px;
            margin-right: 13px;
        }
        
        .author {
            font-size: 14px;
            color: #406599;
        }

        .comment-content {
            font-size: 16px;
            color: #222;
        }

        .likeIcon {
            color: #ff69b4;
        }
    }
</style>
    