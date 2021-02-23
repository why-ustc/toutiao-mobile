<template>
    <div class="edit-birthday">

        <!-- 时间选择器 组件 -->
        <van-datetime-picker
            v-model="currentDate"
            type="date"
            title="选择年月日"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel = '$emit("closePop")'
            @confirm = "onConfirm"
        />


    </div>
</template>


<script>
import dayjs from 'dayjs'

import {editUsreInfo} from '@/API/user.js'

export default {
    name:'EditBirthday',

    props:{
        // 原本的生日时间
        value:{
            type:String,
            required:true
        }
    },

    data(){
        return {
            // 时间选择器所需要的三个 数据
            // 月份全部 自动加1 才是真正月份
            minDate: new Date(1980, 0, 1),
            maxDate: new Date(),
            // 时间选择器 默认选择的时间 + 选择后的时间
            currentDate: new Date(this.value),
        }
    },

    methods:{
        // 修改生日 确认
        async onConfirm(){
            this.$toast.loading({
                message:'保存中',
                forbidClick:true
            })

            const date = dayjs(this.currentDate).format('YYYY-MM-DD')
            await editUsreInfo({
                birthday:date
            })

            // 关闭弹出层
            this.$emit('closePop');

            // 修改 父组件中 原来的生日
            this.$emit('input',date)

            this.$toast.success('修改生日成功')
            
            
        }
    }
}
</script>

<style lang="less" scoped>

</style>