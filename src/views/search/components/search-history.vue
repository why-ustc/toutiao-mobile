<template>

    <div class="search-history">
        
        <!-- 搜索历史记录 -->
        <!-- 第一行：固定的 -->
        <van-cell title="历史记录" >
            
            <div slot="right-icon" v-if="loadDelete">

                <!-- 改变父组件中的值--不能在子组件中定义函数执行 -->
                <span @click="$emit('deleteAllHistory',[])">全部删除</span>  

                <span @click="loadDelete=false"
                  class="span">完成</span>
            </div>

            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <div slot="right-icon" v-else>
                <van-icon name="delete-o" @click="deleteIcon">

                </van-icon>
            </div>
            
        </van-cell>

        <!-- 真正的历史记录 -->
        <van-cell :title="history" 
            v-for="(history,index) in searchHistoryList"
            :key="index"
            @click="deleteHistory(index,history)"
        >
            
            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <div slot="right-icon">
                <!-- 或者 v-show -->
                <van-icon :name="loadDelete ? 'close':'' ">

                </van-icon>
            </div>
            
        </van-cell>


    </div>

</template>

<script>

import {setItem} from "@/utils/storage.js"



export default {
    
    name:'SearchHistory',

    props:{
        searchHistoryList:{
            type:Array,
            required:true
        }
    },

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
        },

        // 点击单元格删除数据
        deleteHistory(index,history){
            if(this.loadDelete){
                // 如果是删除状态，就删除
                this.searchHistoryList.splice(index,1);

                // 持久化处理：1.修改本地存储 2.发送给线上接口
                // 此处没有删除单个历史记录的接口
                // 只有删除全部历史记录的接口
                setItem('search-history',this.searchHistoryList);

                // 函数必须有 return 
                return 
            }

            // 如果不是删除状态--点击历史记录就直接搜索
            this.$emit('search',history);
        },

        
    }
}
</script>

<style lang="less" scoped>
    
    .search-history {
        .span {
            margin-left: 15px;
        }
    }

</style>