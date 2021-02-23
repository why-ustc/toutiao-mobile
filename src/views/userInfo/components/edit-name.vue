<template>
    <div class="editName">

        <!-- 导航栏 -->
        <van-nav-bar
            title="修改昵称"
            left-text="取消"
            right-text="完成"
            @click-left="$emit('closePop')"
            @click-right="onClickRight"
        />

        <!-- 修改昵称 区域 -->
        <div class="textarea">
            <van-field
            v-model="localName"
            rows="2"
            autosize
            type="textarea"
            maxlength="7"
            show-word-limit
        />
        </div>

    </div>
</template>

<script>
import {editUsreInfo} from '@/API/user.js'

export default {
    name:'EditName',

    props:{
        // 用户原来昵称
        // name:{
        //     type:String,
        //     required:true
        // }
        // 用户原来昵称
        value:{
            type:String,
            required:true
        }
    },

    data(){
        return {

            // 用户修改后昵称
            localName:this.value,
        }
    },

    methods:{
        // 点击 修改昵称完成
        async onClickRight(){
            this.$toast.loading({
                message:'保存中',
                forbidClick:true
            })

            try {
                await editUsreInfo({
                name:this.localName
            })

                // 关闭弹出层
                this.$emit('closePop');

                // 修改 父组件中 原来的昵称
                this.$emit('input',this.localName)
                this.$toast.success('修改昵称成功')
            } catch (error) {
                if(err && err.response && err.response.status == 409){
                    this.$toast.fail('昵称已存在')
                }
            }
            
        },


    }
}
</script>

<style lang="less" scoped>
    .editName {
        .textarea {
            padding: 10px;
        }
    }
</style>