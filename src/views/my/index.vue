<template>

    <div class="my-container">

        <!-- 用户基本信息 -->
        <div class="user-info">

            <!-- 第一行 + 第二行  登录状态显示的样子 -->
            <div v-if="this.$store.state.user">
                <div class="base-info">
                <!-- 第一行：头像+编辑资料 -->
                <van-cell :title="userInfo.name" center class="nicheng">

                    <!-- 定义左侧头像和昵称 -->
                    <div slot="icon" class="image">
                        <van-image round fit="cover" width='50' height='50'
                        :src="userInfo.photo"/>
                    </div>

                    <!-- 定义右侧编辑资料 -->
                    <template #right-icon>
                        <van-button type="default" round size="mini">
                            编辑资料</van-button>
                    </template> 

                </van-cell>
                </div>

                <!-- 第二行：用户粉丝+点赞 数据 信息 -->
                <div class="data-info">
                    <van-cell >
                        <van-grid :border='false'>
                            <van-grid-item  text="头条" class="text">
                                <span slot="icon" class="num">{{userInfo.art_count}}</span>
                            </van-grid-item>

                            <van-grid-item  text="关注" class="text">
                                <span slot="icon" class="num">{{userInfo.follow_count}}</span>
                            </van-grid-item>

                            <van-grid-item  text="粉丝" class="text">
                                <span slot="icon" class="num">{{userInfo.fans_count}}</span>
                            </van-grid-item>

                            <van-grid-item  text="获赞" class="text">
                                <span slot="icon" class="num">{{userInfo.like_count}}</span>
                            </van-grid-item>
                            
                        </van-grid>
                    </van-cell>
                </div>
            </div>

            <!-- 第一行 + 第二行 未登录状态样式 -->
            <div class="not-login" v-else>
                
                <div class="image" @click="$router.push('/login')">
                    <div>
                        <van-icon name="friends-o" class='icon' :size="40"/>
                   </div>
                </div>
                <div class="text">
                    <span>登录/注册</span>
                </div>
            </div>

            <!-- 第三行：收藏 + 历史 -->
                <van-cell class="history">

                    <van-grid :column-num="2">
                        <van-grid-item   icon="star-o" text="收藏" class="star"/>

                        <van-grid-item   icon="browsing-history-o" class="history" text="历史"/>
                    </van-grid>

                </van-cell>

            <!-- 第四行：消息通知 -->
            <div class="message">
                <van-cell title="消息通知" is-link to="#">

                </van-cell>
            </div>

            <!-- 第五行：小智同学 -->
            <div class="robot">
                <van-cell title="小智同学" is-link to="#">

                </van-cell>
            </div>

            <!-- 第六行：退出登录 -->
            <!-- 登录状态才显示 退出登录按钮---v-if='this.$store.state.user' -->
            <van-cell center title="退出登录" class="login-out"
                v-if='this.$store.state.user'
                @click='outLogin()'></van-cell>

            
        </div>

    </div>


</template>

<script>
// 导入 获取用户信息(粉丝，点赞数) axios 请求
import { getUserInfo } from '@/API/user'


export default {
    name: 'myIndex',

    created(){
        // 获取自己信息
        this.getUserInfomation();
    },

    data(){
        return {
            // 存储用户本身信息：粉丝数，点赞数等等
            userInfo:{},
        }
    },

    methods:{
        // 点击退出登录按钮
        outLogin(){
            // this.$dialog 调用其方法
            this.$dialog.confirm({
                title: '退出登录提示',
                message: '您确定要退出登录吗?',
            })
            .then(() => {
                // 确定退出登录的话--移除 token,继续在此页面
                this.$store.commit('setUser',null);
            })
            .catch(() => {
                // 取消退出登录的话
                this.$toast({
                    message:'您已取消退出登录',
                    position:'center'
                })
            });
        },

        // 获取用户信息(粉丝数，点赞数)
        async getUserInfomation(){
            const { data:res } = await getUserInfo();
            // console.log(res);
            this.userInfo = res.data;
            // console.log(this.userInfo);

            
        }


    }
}
</script>

<style lang="less" scoped>

    .not-login {
        width: 100%;
        height: 180px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        
        .image {
            width: 66px;
            height: 66px;
            border-radius: 50%;
            background-color: #fff;
            border: 1px solid #fff;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .text {
            font-size: 14px;
        }
    }
    // 第一行
    .base-info {
        width: 100%;
        height: 115px;
        box-sizing: border-box;
        background-color: blue;

        .nicheng{
            color:black;
        }

        .image {
            margin-top: 38px;
            margin-bottom: 11px;
            width: 66px;
            height: 66px;
            border: 1px solid #fff;

        }
    }

    // 第二行
    .data-info {
        height: 65px;

        .text {
            
            font-size: 11px;
        }

        .num {
            color: black;
            font-size: 18px;
        }
    }


    // 第三行
    .history {
        height: 90px;

       .star {
           color:#eb5253;
           
       }

       .history {
           color: #ff9d1d;
       }

        //  /deep/ 可以强制覆盖 css样式
        .van-grid-item__icon +.van-grid-item__text{
           font-size: 14px ;
           color: #333;
       }
    }
    
    // 最后一行
    .login-out {
        text-align: center;
        color: #d86262;
    }

    .login-out{
        margin-top: 3px;
    }
    
    .message{
        margin-top: 3px;
    }
</style>