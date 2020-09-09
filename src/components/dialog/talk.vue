<template>
    <el-dialog :title="'与'+title+'聊天'" :visible.sync="dialogFormVisible" >
        <div class="talk">
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
    </el-dialog>
</template>

<script>
    export default {
        name: "talk",
        data(){
            return{
                dialogFormVisible:false,
                textList:[],
                user:'',
                content:'',
                socketId:'',
                id:'',
                title:''
            }
        },
        methods:{
            send(){
                let{content,user,socketId}=this;
                if(content ==""){
                    this.$message.error("消息不能为空");
                    return
                }
                this.$socket.emit("messageById",{
                    user,
                    content,
                    socketId
                });
                this.content="";
            },
            success(){

            },
            init(){

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

<style scoped>
    .caozuo{
        display: flex;
        width: 100%;
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
        width: 100%;
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

</style>