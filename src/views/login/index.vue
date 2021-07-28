<template>

    <div class="login-container">

        <!--最上面的 登录注册 + 返回上一页按钮  -->
        <van-nav-bar title="登录/注册"  left-arrow class="app-nav-bar"
            @click-left='routeBack()'></van-nav-bar>


        <!-- 输入表单--手机号 + 验证码 -->
        <van-cell-group>

            <!-- 进行表单验证--需要将输入框用 vant-form 包裹住 -->
            <van-form @submit="onlogin()" :show-error-message='false' ref="loginForm"
                :show-error='false' @failed="onfailed()" validate-first>

                <van-field v-model="user.mobile" 
                    left-icon="phone-o" placeholder="请输入手机号"
                    :rules="formRules.mobile" name="mobile">
                    
                </van-field>

                <van-field v-model="user.code" clearable
                    left-icon="bag-o"   placeholder="请输入验证码" 
                    :rules="formRules.code">

                    <!-- 验证码插槽 -->
                     <!-- @click.prevent="sendSms()": 阻止默认提交表单事件,
                            这里只需要对手机验证即可 -->
                    <!-- <template #button> -->
                    <div slot="button">
                        <!-- 发送验证码后就显示 倒计时效果 -->
                        <van-count-down :time="1000 * 60" format="ss s"
                            v-if="iscountShow" @finish='iscountShow=false'></van-count-down>

                        <van-button size="small" class="send-btn" round v-else
                        @click.prevent="sendSms()" :loading='isloading'>发送验证码</van-button>
                    </div>
                        
                    <!-- </template> -->

                    

                </van-field>


                <!-- 中间的登录按钮 -->
                <div class="onlogin">
                    <van-button type="info" block class="login-btn" 
                        >登录</van-button>
                </div>

            </van-form>

           
        </van-cell-group>


        


    </div>


</template>

<script>

// 加载 API文件 中的 axios 请求
// 导入的 login 是一个函数
import { login,sendSms } from '@/API/user.js'

// 导入个别 需要从 vant 导入引入的组件
// 也可以不引入，后面就要全部用 this.$toast()
import { Toast } from 'vant'

export default {

    // 给组件起名字
    name: 'loginIndex',

    data(){
        return {
            // 用户表单--手机 + 验证码 数据
            user:{
                mobile:'13955555555',
                code:'246810',
            },

            // 手机+验证码的 验证规则
            formRules:{
                // 手机验证规则
                mobile:[
                    { required:true, message: '请输入手机号码' },
                    // 手机号适合正则验证
                    { pattern:/^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/,
                        message:'手机号格式错误'}
                    
                ],

                // 验证码 校验
                code:[
                    { required:true, message: '请输入验证码' },
                    { pattern:/^\d{6}$/,message:'验证码格式错误'}
                    
                ]
                  
            },

            // 发送验证码 + 倒计时 只显示其中一个
            iscountShow:false,

            // 是否显示加载状态
            isloading:false,
        }
    },

    methods:{
        // 函数1：点击返回上一页按钮
        routeBack(){
            this.$router.back();
        },


        // 函数2：点击登录按钮
        async onlogin(){

            //一点击登录按钮就显示 加载提示 
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
                //展示时长(ms)，值为 0 时，toast 不会消失。但是后面出现新 toast会覆盖这个，自动关闭
                duration:0  
            });


            //1-2：找到数据接口-->封装请求方法

            //3：请求调用登录函数---axios请求出要try-catch
            // try-catch 用来捕获可能出现的错误
            try {
                const { data:res } = await login(this.user);
                // console.log(res);

                // 这里是登录成功
                Toast.success('登录成功')

                // 将token 赋值给 vuex 的state 中 user
                this.$store.commit('setUser',res.data)

                // 清除 layout 的缓存，让他重新渲染
                this.$store.commit('removeCachePage','layoutIndex')

                // 登录成功后--this.$router.back() 这个不好，如果直接输入网址进来
                // 如果直接输入网址进来，回到开始的导航界面
                // this.$router.back()

                // 京东淘宝 都是用这种--登录的优化
                // 登录成功后,跳转到之前的页面，如果直接输入网址进来，就跳转首页
                this.$router.push(this.$route.query.redirect || '/')

            //4：处理响应结果
            // catch 用来捕获错误并 提醒用户
            } catch (err) {
                // console.log(err);

                // 这里是登录失败
                Toast.fail('登录失败，手机或验证码错误')
            }



        },

        // 函数3：监听表单验证错误， 表单验证有错误的函数--他有回调参数:验证失败相关信息
        onfailed(error){
            // console.log(error);
            // 自己配置 提示信息和位置
            this.$toast({
                message: '手机格式错误',
                position: 'top',
            })
        },

        // 函数4：监听发送验证码 按钮
        async sendSms(){
            // 先要单独检测手机号正确才能发送验证码
           try {
                const res = await this.$refs.loginForm.validate('mobile')
                // 点击发送验证码后 就要显示加载状态，防止重复点击
                this.isloading = true;

                // 点击了发送验证码-->倒计时显示
                this.iscountShow = true;

                // 没进入 catch 说明验证正确，则可以进行发送验证码
                const result = await sendSms(this.user.mobile);
                // console.log(result);

            } catch (error) {

                // 进行错误判断：手机验证错误还是 验证码获取错误
                let message = '';
                if(error && error.name=='mobile'){
                    message = error.message;
                }else {
                    message = '您发送次数太频繁,强稍后再发'
                }
                // 进行提示 到底那种错误
               this.$toast({
                   message:message,
                   position:top
               })
            }

            // 无论是否验证错误，最后都要关闭这个 loading 加载状态
            this.isloading = false;

            // this.$refs.loginForm.validate('mobile').then(data=>{
            //     console.log(data);
            // })
        }

    }


}
</script>

<style lang="less" scoped>

    .onlogin {
        padding: 27px 17px;
        border-radius: 3px;

        .login-btn {
            background-color: #6db4fb;
            border: 0;


        }
    }

    .send-btn {
        width: 96px;
        height: 28px;
        background-color: #ededed;
    }

    .van-field__control {
        background-color: #fff !important ;
    }

    .van-count-down {
        border: 1px solid #eee;
        width: 60px;
        height: 28px;
        text-align: center;
        line-height: 28px;
    }

</style>