<template>
    <div class="comment-list">
        
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >   
        <van-cell title='全部评论'></van-cell>
            <!-- <van-cell v-for="(comment,index) in list"
            :key="index"
            :title="comment.content"
            >
                
            </van-cell> -->
            <comment-item
            v-for="(comment,index) in list"
            :key="index"
            :comment="comment"
            @commentReply="$emit('commentReply',$event)"
            >

            </comment-item>
        </van-list>

    </div>


</template>


<script>
// 导入 axios 请求
import {getcomments} from "@/API/comment.js"

// 导入评论项 组件
import CommentItem from "./comment-item.vue"

export default {
    name:'CommentList',

    created(){

    },

    components:{
        CommentItem
    },

    props:{
        // 源id，文章id或评论id
        source:{
            type:[Object,Number,String],
            required:true
        },
        list: {
            type:Array,
            // 不传就默认空数组
            // 数组或对象的默认值必须 函数返回
            default:()=>[]
        },
        // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        type:{
            type:String,
            // 没传就默认是'a'
            default:'a'
        }
    },

    data(){
        return {

            // 评论列表组件需要的三个数据
            loading: false,
            finished: false,
            
            // 获取评论数据的偏移量，
            // 值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
            offset:null,
            // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
            limit:10,
        }
    },

    methods:{
        async onLoad() {
            // 1：请求获取数据
            const { data:res } = await getcomments({
                // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
                type:this.type,
                // 源id，文章id或评论id
                source:this.source.toString(),
                // 获取评论数据的偏移量，
                // 值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
                offset:this.offset,
                // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
                limit:this.limit,
            })
            // 将评论总数传给 父组件 index.vue,渲染其底部
            this.$emit('commentCount',res.data.total_count)

            // 2：把数据放入数组
            this.list.push(...res.data.results)
            // 3：关闭加载状态
            this.loading = false;

            // 4：判断是否还有数据
            if(this.list.length <= res.total_count){
                if(res.data.results.length){
                    this.offset = res.data.lase_id
                }else {
                    this.finished = true;
                }
            }else {
                this.finished = true;
            }


        },          
    },
    
}
</script>

<style lang="less" scoped>

</style>