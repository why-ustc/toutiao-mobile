<template>
  <div id="app">

    <!-- 一级路由出口：在路由表中只有俩个一级路由login+home, -->
    <!-- login + home 一级路由就是渲染在这里 -->

    <!-- keep-alive 仅对该路由出口渲染的组件有效 -->
    <!-- :include  选择缓存的组件，因为有的组件不需要缓存 -->
    <keep-alive :include="this.$store.state.catchPages">
      <router-view/>
    </keep-alive>

  </div>
</template>


<script>
export default {
  // 给组件起名字
  name:'App'
}
</script>


<style lang="less">

</style>
