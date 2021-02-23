<template>
    <div class="editGender">

        <!-- 选择框组件 Picker -->
        <van-picker
            show-toolbar
            :columns="columns"
            @confirm="onConfirm"
            @cancel="$emit('closePop')"
            @change="pickchange"
            :default-index="defaultIndex"
        />

    </div>
</template>

<script>
import {editUsreInfo} from '@/API/user.js'


export default {
    name:'EditGender',

    props:{
        // 性别：0男 1表示女
        value:{
            type:Number,
            required:true
        }
    },

    data(){
        return {
            // 男女性别选择 数据
            columns: ['男','女'],

            // 默认 性别的 数字(也当做索引)
            defaultIndex:this.value

        }
    },

    methods:{
        // 确认性别 修改
        async onConfirm(){
            this.$toast.loading({
                message:'保存中',
                forbidClick:true
            })

            await editUsreInfo({gender:this.defaultIndex})

                // 关闭弹出层
                this.$emit('closePop');

                // 修改 父组件中 原来的昵称
                this.$emit('input',this.defaultIndex)
                this.$toast.success('修改性别成功')
            
        },

        // 选项作出改变时触发
        pickchange(picker,value,index){
    
            // 获取选择的性别
            this.defaultIndex = index
        }

    }    

}

</script>

<style lang="less" scoped>

</style>