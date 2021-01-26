// 频道编辑组件---弹出层
<template>
    <div class="channels-edit">
        
        <!-- 我的频道 -->
        <van-cell  center class="myChannels-wrap">

            <span slot="title">我的频道</span>

            <van-button  size="mini" round plain type="danger"
                @click="editChannel()">
                {{isShowIcon ? '完成' : '编辑'}}    
            </van-button>
        </van-cell>

        <!-- 我的频道列表 -->
        <van-grid  :gutter="10">
            <van-grid-item v-for="(channel,index) in myChannels" 
                :key="index"  class="channels-item" :text="channel.name" 
                @click="changeChannels(index,channel)" :class="{ active: index===active }">
                <!-- 右上角图标 -->
                <div slot="icon" v-if="index !== 0">
                    <!-- 三元表达式--icon是否显示 -->
                    <!-- 错误写法：name="isShowIcon ? close : '' " -->
                    <van-icon :name="isShowIcon ? 'close' : '' " class="icon" size="20px"/>
                    
                </div>
            </van-grid-item>
        </van-grid>



         <!-- 频道推荐 -->
        <van-cell  center class="recommendChannels">
            <span slot="title">频道推荐</span>
        </van-cell>

        <!-- 频道推荐列表 -->
        <van-grid  :gutter="10" >
            <van-grid-item v-for="(recommendchannel,index) in recommendChannels" 
            class="channels-item" :key="index"  :text="recommendchannel.name"
                @click="switchChannels(recommendchannel)">

            </van-grid-item>
        </van-grid>

    </div>
</template>

<script>

// 导入 axios 请求，获取所有频道
// 加载 axios 请求必须用 {} 包起来，否则报错
import { getAllChannelsAxios,addUserChannels,deleteUserChannels } from "@/API/channels.js"

import { setItem } from "@/utils/storage.js"
export default {

    created(){
        this.loadAllChannels();
    },

    name:'channelsEdit',

    props:{
        // 我的频道
        myChannels: {
            type:Array,
            required:true,
        },

        // 激活频道
        active: {
            type:Number,
            required:true,
        }
    },

    data(){
        return {
            // 存储所有频道 数据
            allChannels:[],

            // 编辑删除图标 是否显示
            isShowIcon:false,
        }
    },

    methods:{
        // 获取所有频道
        async loadAllChannels(){
            const { data:res } = await getAllChannelsAxios();
            this.allChannels = res.data.channels;
            // console.log(this.recommendChannels);
        },

        // 点击推荐频道列表，此频道就自动切换到我的频道
        // undo undo undo
        async switchChannels(channel){
            this.myChannels.push(channel);

            // 数据持久化：否则一刷新就恢复原样了

            // 服务端接口有错误，成功进行 axios 请求，但是不能数据持久化
            if(this.$store.state.user){
                // 如果登录了，数据存储到 线上数据库
                const res = await addUserChannels({
                    channels:[
                        { id:channel.id, 
                          seq:this.myChannels.length, 
                        }
                    ]
                 })
                console.log(res);
            }else {
                // 没有登录，则存储在本地
                setItem('user-channels',this.myChannels)
                console.log('没登录');
            }

        },

        // 监听 编辑频道按钮的点击
        editChannel(){
            // 这样写法是错误的，这样点击不会发生 编辑 + 完成的互相跳转
            this.isShowIcon = !this.isShowIcon;
        },

        // 频道单元格的点击事件监听
        changeChannels(index,channel){
            // 如果是编辑状态(isShoeIcon==true)，点击就删除此频道
            if(this.isShowIcon){
                this.deleteChannels(index,channel);
            }

            if(!this.isShowIcon){
                // 如果是非编辑态，就切换到此点击频道首页
                this.toClickChannels(index);
            }
        },

        // 如果是编辑状态(isShoeIcon==true)，点击就删除此频道
        async deleteChannels(index,channel ){
            // 推荐频道不可删除--永远索引为 0
            if(index!==0){
                // 如果删除频道 在激活频道前面
                if(index <= this.active){
                    // 发送事件改变 父组件 激活频道索引
                    this.$emit('editActive',this.active-1)
                }
                this.myChannels.splice(index,1);
            }

            // undo undo 持久化数据修改
            // 服务端接口有错误，成功进行 axios 请求，但是不能数据持久化
            if(this.$store.state.user){
                // 如果登录持久化存储
                const res = await deleteUserChannels(channel.id);
                console.log(res);
            }else {
                setItem('user-channels',this.myChannels)
                console.log('删除');
            }
        },

        // 如果是非编辑态，就切换到此频道首页
        toClickChannels(index){

            // 关闭弹出层--切换到首页(弹出层控制在父组件)、
            // 只能子传父，子组件事件改变父组件数据
            // 只能在 父组件中使用子组件处 监听 子组件传出的事件
            this.$emit('closePopup');

            // 首页频道 激活频道 改变为 点击的频道
            // 此事件需要 传一个参数
            this.$emit("editActive",index);
        }
    },


    // 计算属性：一般用于基于本来数据 衍生出其他数据时使用。
    //     优点：当依赖数据改变，计算属性立马就改变--响应式
    computed: {
        /* 没有用来获取推荐频道的数据接口，但是我们有获取所有频道列表的数据接口。
            所以：所有频道列表 - 我的频道 = 剩余推荐的频道。
            实现过程所以一共分为两大步：
                • 获取所有频道
                • 基于所有频道和我的频道计算获取剩余的推荐频道 */

        // 上面模板使用 直接： recommendChannels 当成已有数组数据 
        recommendChannels(){
            let arr = [];
            this.allChannels.forEach(channel=>{
                let flag = false;
                for(let i=0;i<this.myChannels.length;i++){
                    if(channel.id === this.myChannels[i].id){
                        flag = true;
                        break;
                    }
                }

                if(!flag){
                    arr.push(channel)
                }
            })
            // 计算属性最后一定要 return
            return arr;
        }
    }


}
</script>


<style lang="less" scoped>
    .channels-edit {
        padding-top: 54px;
        padding-bottom: 20px;

        .myChannels-wrap {
           
            .span {
                font-size: 16px;
                color: #333;
            }

            .van-button {
                width: 50px;
                height: 22px;
            }
        }

        .recommendChannels {
           .span {
                font-size: 16px;
                color: #333;
            } 
        }

        .channels-item {
            position: relative;
            .icon {
                position: absolute;
                right: -49px;
                top: -24px;
                color: #ccc;
            }
        }

        /deep/.active {
            .van-grid-item__text{
                color: red !important;
            }
        }

        // /deep/.channels-item {
        //     width: 180px !important;
        //     height: 43px;
        //     font-size: 24px;
        //     color: #222;
        // }

        /deep/.van-grid-item__content{
            background-color: #f4f5f6;
        }



    }
</style>