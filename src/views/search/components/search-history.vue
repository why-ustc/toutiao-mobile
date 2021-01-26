<template>

    <div class="search-history">
        
        <!-- 搜索历史记录 -->
        <van-cell title="历史记录" >
            
            <div slot="right-icon" v-if="loadDelete">
                 <span>全部删除</span>  <span>完成</span>
            </div>

            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <div slot="right-icon" v-else>
                <van-icon name="delete-o" @click="deleteIcon">

                </van-icon>
            </div>
            
        </van-cell>

        <!-- 真正的历史记录 -->
        <van-cell title="java" >
            
            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <div slot="right-icon">
                <van-icon :name="loadDelete ? 'close':'' ">

                </van-icon>
            </div>
            
        </van-cell>


    </div>

</template>

<script>
export default {
    
    name:'SearchHistory',

    data(){
        return {
            // 控制 删除图标 + 全部删除 完成  的切换
            // true-正删除状态 false:正常态
            loadDelete:false,
        }
    },

    methods:{
        // 点击了 删除历史记录图标
        deleteIcon(){
            this.loadDelete = !this.loadDelete;
        }
    }
}
</script>

<style>

</style>