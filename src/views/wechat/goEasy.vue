<template>
    <div class="goeasy">
        <div> <b>小优购物管理员聊天室</b>   当前在线{{count}}人 </div>
        <div class="screen">
            <ul>
             <li v-for="(item,i) in textList" :key="i" >
                 <div :class="item.user==user?'right':'left'" v-if="item.user!==user">
                     <b >{{item.user}}</b>
                     <span >{{item.content}}</span>
                 </div>
                 <div :class="item.user==user?'right':'left'" v-if="item.user==user">

                     <span >{{item.content}}</span>
                     <b >{{item.user}}</b>
                 </div>
             </li>
            </ul>
        </div>
        <div class="caozuo">
            <el-input v-model="content"></el-input><el-button @click="send"  @keyup.enter.native="send">发送</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "goEasy",
        data(){
            return{
                content:'',
                count:'',
                id:"",
                textList:[],
                user:localStorage.adminName
            }
        },
        // sockets: {
        //     message(data) {
        //         let user=data.user;
        //         let content=data.content;
        //         this.textList.push({
        //             user,
        //             content
        //         })
        //     },
        //     connect() {
        //         //监听connect事件
        //         this.id = this.$socket.id;
        //         this.$socket.emit('join', {
        //             user:this.user
        //         });
        //     },
        //     join(data){
        //         this.$message.success("欢迎"+data.user+"进入聊天室");
        //         this.count=data.count;
        //     },
        //     leave(data){
        //         this.$message.success(data.content);
        //         this.count=data.count;
        //     }
        // },
        methods:{
            send(){
                let{content,user}=this;
                if(content ==""){
                    this.$message.error("消息不能为空");
                    return
                }
                this.$socket.emit("message",{
                    user,
                    content
                });
                this.content="";
            },
        },
        mounted() {

        },
        created () {
            // 回车事件
            var that = this;
            document.onkeydown = function (e) {
                var ev = (typeof event != 'undefined') ? window.event : e;
                if (ev.keyCode == 13) {
                    that.send();
                }
            }
        },
    }
</script>

<style lang="less">
.caozuo{
    display: flex;
    width: 60%;
}
    .screen ul{
        overflow-y: scroll;
        clear: both;
        height: 100%;
    }
    .left{
        text-align: left;
    }
    .right{
        margin-left: auto;
    }
.screen{
    width: 60%;
    height: 400px;
    border: 1px solid;
    padding: 10px;
    margin-bottom: 20px;
}
    .screen li {
       padding: 3px;   display: flex;
    }
.screen li b{
    border-radius: 10px;
}
.screen li b{

    margin: 0 3px;
}
.screen li span{
   background: #13ce66;
    border-radius: 3px;
    padding: 1px 3px;
}
.goeasy  .el-input__inner{
       height: 60px;
}

</style>
