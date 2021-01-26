<template>
    
    <!-- 布局的整个大容器，其余页面都在这个布局里面作为 他的 子路由 -->
    <div class="layout-container">

        <!-- layout 子路由出口 -->
        <!-- 这是二级路由 -->
        <router-view></router-view>


        <!-- 底部导航栏 -->
        <van-tabbar v-model="active" route>
             <van-tabbar-item to="/"  icon="home-o">首页</van-tabbar-item>
             <van-tabbar-item to="/qa"  icon="comment-o">问答</van-tabbar-item>
             <van-tabbar-item to="/video"  icon="video-o">视频</van-tabbar-item>
             <van-tabbar-item to="/my"  icon="manager-o">我的</van-tabbar-item>
        </van-tabbar>




    </div>

</template>

<script>
export default {

    // 给组件起名字
    name:'layoutIndex',

    data(){
        return {
            active:0,
        }
    }
}
</script>


<style lang="less" scoped>

</style>

