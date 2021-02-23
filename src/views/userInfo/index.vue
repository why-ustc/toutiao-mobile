<template>
    <div class="userInfo">
        
        <!-- 上方导航栏 -->
        <van-nav-bar
            class="navBar"
            title="个人信息"
            left-arrow
            @click-left='$router.back()'
        />

        <!-- 点击头像，出现选择文件 -->
        <!-- ref="imageFile" = 用来选择 dom 的 
            @change="onFileChange() = 选择了图片就触发-->
        <input 
            type='file' 
            hidden 
            ref="imageFile"
            accept="image/*"
            @change="onFileChange()"
        >

        <!-- 头像 + 昵称 + 性别 + 生日 -->
        <!-- $refs.imageFile.click() = 点击头像行，
                用 js 控制 相当于点击 input，而点击文件 input 就可选择文件 -->
        <van-cell title="头像" is-link center
            @click="$refs.imageFile.click()">

            <van-image
                width="30"
                height="30"
                round
                fit="cover"
                :src="userInfo.photo"
            />
        </van-cell>

        <van-cell 
            @click="editName"
            title="昵称" 
            is-link 
            :value="userInfo.name" 
        />

        <van-cell 
            @click="isGenderShow = true"
            title="性别" 
            is-link 
            :value="userInfo.gender ? '女':'男'" 
        />

        <van-cell title="生日" is-link :value="userInfo.birthday" 
        @click="isBirthdayShow = true"/>


        <!-- 修改昵称--弹出层 -->
        <van-popup class="popEditName"
            v-model="isNameShow"
            position="bottom"
            :style="{ height: '100%' }"
        >

            <!--修改昵称组件  -->

            <!-- 
                当父组件传给子组件的数据 既要使用 又要修改，例如这里的昵称
                这种情况我们可以使用 v-model 简写，代替下面 俩句代码
            :name = 'userInfo.name'+ @updateName = "userInfo.name = $event"
            -->

            <!-- v-model ="userInfo.name" 做了以下俩件事
                 ①默认传递一个名字叫 value 的数据 :value = "userInfo.name"
                 ②默认监听 input 事件 @input = "userInfo.name = $event"
                此时父组件节约一具代码，子组件 必须做 接收 props: value 
                    以及发布 input 事件 $emit('input',params)
            -->

            <!-- v-model 只能用一次 -->

            <!-- 如果有多个数据 昵称+性别等等 需要保持同步，用 .sync 修饰符  
            :gender ="userInfo.gender"
            @updateGender = "userInfo.gender = $event"" -->

            <!-- 现在可以： 
                :gender.sync = "userInfo.gender" 它等价于：
                    :gender ="userInfo.gender"
                    @update:gender = "userInfo.gender = $event""    
            -->
            <!-- 子组件需要：
                    接收 props: gender 
                    发布 update:gender 事件 $emit('update:gender',params)
             -->

            <edit-name
                v-if="isNameShow"
                v-model = 'userInfo.name'
                @closePop = "isNameShow = false"
            ></edit-name>

        </van-popup>

        <!-- 修改性别-弹出层 -->
        <van-popup 
            v-model="isGenderShow"
            position="bottom"
        >
            <!-- 修改性别组件 -->
            <edit-gender
                @closePop= "isGenderShow=false"
                v-model="userInfo.gender"
            ></edit-gender>
        </van-popup>


        <!-- 修改生日-弹出层 -->
        <van-popup 
            v-model="isBirthdayShow"
            position="bottom"
        >
            <!-- 修改生日 组件 -->
            <edit-birthday
                v-if="isBirthdayShow"
                @closePop = "isBirthdayShow = false"
                v-model="userInfo.birthday"
            ></edit-birthday>

        </van-popup>


        <!--新头像预览 - 弹出层 -->
        <van-popup 
            v-model="isImageShow"
            position="bottom"
            :style="{ height: '100%' }"
        >
            <preview-image
                v-if="isImageShow"
                :file = "selectImage"
                @closePop="isImageShow = false"
                @updatePhoto ="userInfo.photo = $event"
            ></preview-image>

        </van-popup>



    </div>
</template>


<script>
// 导入 axios 请求
import {getUsreInfo} from "@/API/user.js"

// 导入子组件
import EditName from './components/edit-name.vue'
import EditGender from './components/edit-gender.vue'
import EditBirthday from './components/edit-birthday.vue'
import PreviewImage from './components/preview-image.vue'

export default {
    name:'UserInfoIndex',

    created(){
        // 获取用户个人资料
        this.getUsreInfos();
    },

    components:{
        EditName,
        EditGender,
        EditBirthday,
        PreviewImage
    },

    data(){
        return {
            // 存储用户个人信息
            userInfo:{},

            // 控制 修改昵称弹出层是否显示
            isNameShow:false,

            // 控制 修改性别弹出层是否显示
            isGenderShow:false,

            // 控制 修改生日弹出层是否显示
            isBirthdayShow:false,

            // 控制 头像预览 弹出层是否显示
            isImageShow:false,

            // 储存 更换头像 当前选择的图片,初始为空
            selectImage:null

        }
    },

    methods:{
        // 获取用户个人资料
        async getUsreInfos(){
            const { data:res } = await getUsreInfo()
            this.userInfo = res.data
            console.log(this.userInfo);
        },
        
        // 点击修改用户昵称
        editName(){
            this.isNameShow = true
        },

        // 选择了新头像就触发
        onFileChange(){
            // 显示头像预览弹出层
            this.isImageShow = true

            // 在弹出层预览图片
            // const blob = window.URL.createObjectURL(
            //     this.$refs.imageFile.files[0])

            const file = this.$refs.imageFile.files[0]
            this.selectImage = file;

            // 防止点击 当前头像 照片不触发 change，手动清空 
            //       imageFile 的 value
            // this.$refs.file.value = ''
        }
    }
}
</script>


<style lang="less" scoped>
    .userInfo {

        // 导航栏
        .navBar {
            background-color: #3196fa;

            /deep/.van-icon-arrow-left::before {
                color: #fff;
            }
            /deep/.van-nav-bar__title {
                color: #fff !important;
            }
        }

        .popEditName {
            background-color: #f5f7f9;
        }



    }
</style>

