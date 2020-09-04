<template>
    <div class="goeasy">

        <div class="screen">
            <ul>
             <li v-for="(item,i) in textList" :key="i" >
                 <div :class="item.user==user?'right':'left'">
                     <b >{{item.user}}</b>:
                     <span >{{item.text}}</span>
                 </div>

             </li>
            </ul>
        </div>
        <div class="caozuo">
            <el-input v-model="text"></el-input><el-button @click="send"  @keyup.enter.native="send">发送</el-button>
        </div>

    </div>
</template>

<script>
    export default {
        name: "goEasy",
        data(){
            return{
                text:'',
                textList:[],
                user:localStorage.adminName
            }
        },
        methods:{
            send(){
                // this.$goEasy.publish({
                //     channel: "msg", //替换为您自己的channel
                //     message: this.text //替换为您想要发送的消息内容
                // });

                this.$axios.post("/getGoEasy",{
                        text:this.text,
                    user:localStorage.adminName
                }).then(data=>{
                    console.log(data)

                    this.text=""
                })
            },
            talkLogin(){
                let _this=this;
                this.$axios.post("/talkLogin",{
                    user:localStorage.adminName
                }).then(()=>{
                    this.$goEasy.subscribe({
                        channel: "talkLogin",//替换为您自己的channel
                        onMessage: function (message) {
                            console.log(message)
                            _this.$message.success(  message.content+"进入了聊天室" )
                        }
                    });
                })
            }
        },
        mounted() {
            let _this=this;
            this.$goEasy.subscribe({
                channel: "sendMsg",//替换为您自己的channel
                onMessage: function (message) {
                    let user=message.content.split(":")[0];
                    let text=message.content.split(":")[1];
                    _this.textList.push({
                        user,
                        text
                    })
                }
            });
            this.talkLogin();
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