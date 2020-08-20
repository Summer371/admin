<template>
    <div>
        <el-upload
                class="upload-demo"
                action="/ele/saveFile"
                ref="upload"
                name="file"
                :headers="{authorization:$store.state.admin.token,permissions:$store.state.admin.permissions}"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="3"
                :on-success="successUp"
                :on-error="upError"
                :on-exceed="handleExceed"
                :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
         <!--   <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>
        <div class="chat">
            <div class="screen">
                <el-input
                        type="textarea"
                        v-model="textarea"
                ></el-input>
            </div>
            <el-input v-model="text" placeholder="想说的话" width="200px"></el-input>
            <el-button type="primary" @click="sendText" >发送</el-button>
        </div>


    </div>
</template>

<script>
    import io from "socket.io"
    export default {
        name: "saveFile",
        data(){
            return{
                fileList:[],
                text:'',
                ws:null,
                textarea:'',id:''
            }
        },
        sockets:{
            connect: function(){
                this.id=this.$socket.id;
                console.log('socket connected from Page')
            },
            customEmit: function(val){
                console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
            },
            send: function(val){
                this.textarea+= (' '+val);
            },
            online:function(data){
                this.$message.success(data.str+",当前在线人数："+data.num)
            }
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            successUp(v){
                this.$message.success(v.msg)
                this.$refs.upload.clearFiles();
            },
            upError(v){
                this.$message.error(v.msg)
            },
            sendText(){
                this.$socket.emit('text', this.text);
                this.text=''
            }
        },
        mounted() {
            this.$socket.emit('login', {userName:localStorage.adminName});

        }
    }
</script>

<style scoped>
.chat{
    width: 800px;
    height:600px;

    margin: 0 auto;
}
    .el-input{
        width: 240px;
        margin: 0 5px;
    }
    .screen{
        width: 100%;
        border: 1px solid black;
        height: 500px;

    }
</style>