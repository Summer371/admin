<template>
    <div class="goeasy">

        <div class="screen">
            <ul>
             <li v-for="(item,i) in textList" :key="i" >
                 <div :class="item.user==user?'right':'left'">
                     <b >{{item.user}}</b>:
                     <span >{{item.content}}</span>
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
                textList:[],
                user:localStorage.adminName
            }
        },
        sockets: {
            message(data) {
                let user=data.user;
                let content=data.content;
                this.textList.push({
                    user,
                    content
                })
            },
            connect() {
                this.id = this.$socket.id;
                this.$socket.emit('login', {
                    user:"admin"
                });   //监听connect事件
            },
            join(data){
                this.$message.success("欢迎"+data+"进入聊天室");
            }
        },
        methods:{
            send(){
                let{content,user}=this;
                this.$socket.emit("message",{
                    user,
                    content
                });
                this.content="";
            },
        },
        mounted() {
            this.$socket.emit("login",{
                user:this.user
            });
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
}
    .screen ul{
        overflow: hidden;
        clear: both;
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
.screen li span{
   background: #13ce66;
    border-radius: 3px;
    padding: 1px 3px;
}
.goeasy  .el-input__inner{
        width: 240px;
}

</style>
