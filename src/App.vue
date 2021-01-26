<template>
  <div id="app">

    <!-- 一级路由出口：在路由表中只有俩个一级路由login+home, -->
    <!-- login + home 一级路由就是渲染在这里 -->
    <router-view/>
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
