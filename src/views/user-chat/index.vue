<template>
    <div class="user-chat">

        <!-- 导航栏 -->
        <van-nav-bar
            title="小智同学"
            left-arrow
            @click-left="$router.back()"
        />

        <!-- 聊天纪律 单元格 -->
        <van-cell-group class="chatList">

            <van-cell :title="item.msg" v-for="(item,index) in messageList"
                :key="index"/>
        
        </van-cell-group>

        <!-- 底部 发送按钮 -->
        <van-cell-group >
            <van-field v-model="message"
                placeholder="请输入消息" 
                class="field"
            >
                <van-button type="info" slot="button"
                    size="small"
                    @click="onSend()"
                >发布</van-button>

            </van-field>
        </van-cell-group>

    </div>
</template>

<script>
// 加载 socketIo
import io from 'socket.io-client'



export default {
    name:'UserChat',

    created(){
        // 建立连接
        const socket = io('http://ttapi.research.itcast.cn')

        this.socket = socket

        // 建立连接事件
        socket.on('connect',()=>{
            console.log('建立连接成功');
        })

        // 断开连接事件
        socket.on('disconnect',()=>{
            console.log('断开连接了');
        })

        // 监听 message 事件，接收服务端消息
        socket.on('message',(data)=>{
            // 将对方返回的消息放到消息队列
            this.messageList.push(data)
        })

    },

    data(){
        return {
            // 发信息内容
            message:'',

            // webSocket 通信对象
            socket:null,

            // 双方发送的消息数组
            messageList:[]
        }
    },

    methods:{
        // 发送消息
        onSend(){
            const data = {
                msg:this.message,
                timeStamp:Date.now()
            }
            this.socket.emit('message',data)

            // 将我发的信息 加入消息队列
            this.messageList.push(data)

            // 清空输入框
            this.message = ''
        }
    },

    watch:{
        
    }
}
</script>

<style lang="less" scoped>
    .user-chat {
        // 导航栏
        .van-nav-bar {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            background-color:#3196fa ;
            /deep/.van-icon-arrow-left::before {
                color: #fff;
            }
            /deep/.van-nav-bar__title {
                color: #fff;
            }
        }

        // 底部输入框
        .field {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            .van-button--small {
                width: 55px;
            }
        }

        .chatList {
            position: fixed;
            left: 0;
            right: 0;
            top: 46px;
            bottom: 44px;
            overflow-y: auto;
        }
    }
</style>