<template>
    <div class="sendComment">
        
        <!-- 留言区域 -->
        <van-field
            v-model.trim="message"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入留言"
            show-word-limit
        >
        </van-field>

        <van-button type="default"
        size="mini"
        @click="onSendComment()"
        :disabled='!message'>
        <!-- 没有内容就不可以点击发布 -->
            发布
        </van-button>

     

    </div>
</template>



<script>

import {sendComments} from "@/API/comment.js"

export default {
    name:'SendComment',

    props:{
        // 评论的目标id,评论文章即为文章id，
        // 对评论进行回复则为评论id 
        target:{
            type:[Number,String,Object],
            required:true
        },

        // 文章id，对文章评论，不需要此参数
        // 对 评论 进行回复，需要文章 id
        articleId:{
             type:[Number,String,Object],
             default:null
        }
        
    },

    data(){
        return {
            // 发布留言 内容
            message:'',
        }
    },

    methods:{
        // 点击发布留言按钮---只有部分文章能评论成功
        // 主要是正规文章能进行评论
        async onSendComment(){

            // 防止多次点击
            this.$toast.loading({
                message:'发布中',
                forbidClick:true //禁止北京点击
            })

            const { data:res } = await sendComments({
                // 评论的目标id,评论文章即为文章id，
                // 对评论进行回复则为评论id
                target:this.target.toString(),
                // 评论内容
                content:this.message,
                // 文章id，对文章评论，不需要此参数
                // 对 评论 进行回复，需要文章 id
                // art_id:this.articleId ? this.articleId.toString() : null
            })
            // console.log(res);

            // 发送事件给父组件--关闭弹出层 + 将刚刚写的评论置顶
            this.$emit('sendSuccess',res.data.new_obj)
            this.$toast.success('发布评论成功')

            // 清空 输入框
            this.message = '';
        }
    }
}
</script>

<style lang="less" scoped>
    .sendComment {
        display: flex;
        align-items: center;

        .van-button__content {
            width: 30px;
        }
    }
</style>