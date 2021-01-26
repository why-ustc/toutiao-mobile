<template>
    <div class="article-item">
       
        <!-- 渲染每篇文章内容 + 图片-->
        <!-- title:标题插槽  label：作者插槽  value：右边图片插槽-->
        <van-cell >

            <!-- 标题插槽 -->
            <div slot="title" class="title van-multi-ellipsis--l3">
                {{this.articleItem.title}}
                <!-- 标题太长了标题太长了标题太长了标题太长了标题太长了标题太长了标题太长了标题太长了标题太长了标题太长了标题太长了标题太长了标题太长了标题太长了标题太长了标题太长了标题太长了 -->
            </div>

            <!-- 标题下的 作者+评论数 插槽 -->
            <div slot="label">
                
                <!-- 如果有三张图片 -->
                <div class="imageThree" v-if="articleItem.cover.type===3">
                    <div v-for="(img, index) in articleItem.cover.images"
                        :key="index">
                        <van-image   class="image" :src="img" fit="cover"/>
                    </div>
                    
                </div>

                <!-- 最下方的作者+评论数+时间 -->
                <div class="author">
                    <span>{{articleItem.aut_name}}</span> 
                    <span>{{articleItem.comm_count}}评论</span>
                    <span>{{articleItem.pubdate | relativeTime}}</span>
                </div>
            </div>

            <!-- 右侧 图片(文字) 插槽 -->
            <!-- 如果只有一张图片，则 src=返回图片数组[0] -->
            <div slot="default" v-if='articleItem.cover.type==1' class="oneImage">
                <van-image  fit="cover"
                    :src="articleItem.cover.images[0]" />
            </div>



        </van-cell>



    </div>
</template>



<script>
export default {

    created(){
        // this.getArticles();
    },

    name:'ArticleItem',

    // 接收父组件传的数据
    props:{
        // 父组件 (home/coments/article-list) 传来的文章具体内容
        articleItem:{
            type:Object,
            required:true
        }
    },

    methods:{
        // getArticles(){
        //     console.log(this.articleItem);
        // }
    }

}
</script>


<style lang="less" scoped>

    .article-item {
        // 标题
        .title {
            font-size: 16px;
            color: #3a3a3a;
        }

        // 最右边图片
        /deep/ .van-image{
            // 去掉第三方组件自带flex
            flex: unset;
            width: 116px;
            height: 73px;
            // margin-left: 124px;
        }

        .imageThree {
            display: flex;
            flex-wrap: nowrap;
            padding: 15px 0;
            // 子元素平分
            .image{
                flex: 1;
                height: 73px;
                padding-right: 4px;
            }

        }

        .author {
            font-size: 11px;
            color: #b4b4b4;
            span {
                margin-right: 12px;
            }
        }

    }

    
</style>