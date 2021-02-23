<template>
    <div class="preview-image">

        <img :src="image" alt="" ref="image" class="image">
        


 
        <!-- 底部 取消 + 确认 -->
        <van-nav-bar
            left-text="取消"
            right-text="确认"
            @click-left="$emit('closePop')"
            @click-right="onConfirm"
        />

    </div>
</template>

<script>
import {editUsrePhoto} from "@/API/user.js"

// 加载具有裁切功能的第三方库
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
    name:'PreviewImage',

    props:{
        // 选择新头像的照片数据
        file:{
            // 不限制类型
            // type:[Object,String,File],
            required:true
        }
    },
    mounted(){
        // cropperjs 第三方插件使用
        // 获取需要裁切的图片dom
        // const image = document.getElementById('image');原生 js
        // vue 中获取 dom  // 获取需要裁切的图片dom
        const image = this.$refs.image
        const cropper = new Cropper(image, {
            // 裁剪工嗯呢该的 配置
            viewMode: 1,
            dragMode: 'move',
            aspectRatio: 1,
            cropBoxMovable: false,
            cropBoxResizable: false,
            background: false,
            movable: true
        });
    },

    data(){
        return {
            // 文件对象的
            image:window.URL.createObjectURL(this.file)
        }
    },

    methods:{
        // 获取裁切后的头像图片
        getCroppedCanvas(){
            return new Promise(resolve =>{
                this.cropper.getCroppedCanvas().toBlob((blob)=> {
                    resolve(blob)
                })
            })
        },
        // 点击确认修改头像
        async onConfirm(){
            this.$toast({
                message:'正在保存',
                forbidClick:true,
                // 展示时间，0表示持久展示
                duration:0
            })

            // const file = await this.getCroppedCanvas()
            // const fd = new FormData()
            // fd.append('photo',file)

            // 如果文档接口要求 Content-Type 是 multipart/form-data，
            // 则参数一定要提交 FormDate 数据对象，专门用于文件上传，不能提交
            // 对象{}，没用
            const fd = new FormData()
            fd.append('photo',this.file)

            await editUsrePhoto(fd)
            
            this.$emit('closePop')
            this.$toast.success('保存成功')

            // 更新父组件中用户头像
            this.$emit('updatePhoto',this.image)
        }
    }


}   
</script>

<style lang="less" scoped>
    .preview-image {
        margin-top: 100px;
        /deep/.van-popup--bottom {
            background: red !important;
        }

        .van-nav-bar {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .image {
            display: block;

            /* This rule is very important, please don't ignore this */
            max-width: 100%;
        }
    }
     /deep/.van-popup--bottom {
            background: red !important;
        }
</style>