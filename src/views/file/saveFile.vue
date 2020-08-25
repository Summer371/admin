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



        <div class="table">
            <el-table
                    v-loading = "$store.state.loading"
                    :border = "true"
                    :data="filesList"
                    style="width: 100%">
                <el-table-column
                        label="创建时间"
                >
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{scope.row.createTime | date}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="用户名称"
                >
                    <template slot-scope="scope">
                        <i class="el-icon-user"></i>
                        <span style="margin-left: 10px">{{scope.row.creator}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="文件名"
            >
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.fileName}}</span>
                </template>
            </el-table-column>
                <el-table-column
                        label="文件路径"
                >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.filePath}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="文件格式"
                >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.fileType || "file"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger"
                                   @click="open(scope.row._id)"
                                   size="mini">删 除</el-button>
                        <el-button type="primary"
                                   @click="download(scope.row)"
                                   size="mini">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    :page-count = "pageSum"
                    @current-change="changeCurrent"
                    background
                    layout="prev, pager, next"
            >
            </el-pagination>
        </div>
<!--        <div class="chat">-->
<!--            <div class="screen">-->
<!--                <el-input-->
<!--                        type="textarea"-->
<!--                        v-model="textarea"-->
<!--                ></el-input>-->
<!--            </div>-->
<!--            <el-input v-model="text" placeholder="想说的话" width="200px"></el-input>-->
<!--            <el-button type="primary" @click="sendText" >发送</el-button>-->
<!--        </div>-->


    </div>
</template>

<script>

    export default {
        name: "saveFile",
        data(){
            return{
                fileList:[],
                text:'',
                ws:null,
                textarea:'',id:'',
                pageSum:0,
                filesList:[],
                pageIndex:1

            }
        },
        // sockets:{
        //     connect: function(){
        //         this.id=this.$socket.id;
        //         console.log('socket connected from Page')
        //     },
        //     customEmit: function(val){
        //         console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        //     },
        //     send: function(val){
        //         this.textarea+= (' '+val);
        //     },
        //     online:function(data){
        //         this.$message.success(data.str+",当前在线人数："+data.num)
        //     }
        // },
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
                this.$message.success(v.msg);
                this.$refs.upload.clearFiles();
                this.getList();
                this.$store.dispatch("adminHandle",{type:"上传文件",adminName:localStorage.adminName,msg:v.msg});
            },
            upError(v){
                this.$message.error(v.msg)
            },
            sendText(){
                this.$socket.emit('text', this.text);
                this.text=''
            },
            changeCurrent(v){
                this.pageIndex=v;
            },
            getList(){
                this.$axios.get("/filesList",{
                    params:{
                        pageIndex:this.pageIndex
                    }
                }).then(data=>{
                    if(data.ok==1){
                        this.filesList=data.filesList.fileList;
                        this.pageSum=data.filesList.pageSum;
                    }else{
                        this.filesList=[];
                        this.pageSum=0;
                    }
                })
            },
            download(v){
               this.$axios.post('/downloadFile',{
                   id:v._id
               },{
                   responseType: 'blob'
               }).then(data=>{
                   const blob = new Blob([data], {
                       type: "application/octet-stream",
                   });
                   var  link = document.createElement("a");
                   link.href = window.URL.createObjectURL(blob);
                   link.download = v.fileName;
                   link.click();
                   window.URL.revokeObjectURL(link.href);
                })
            },
            open(id){
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/file",{
                        params:{
                            id
                        }
                    }).then(data=>{
                        if(data.ok==1){
                            this.$message.success("删除成功");
                            this.getList()
                        }else{
                            this.$message.error("删除失败")
                        }
                        this.$store.dispatch("adminHandle",{type:"删除文件",adminName:localStorage.adminName,msg:data.msg});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            }
        },
        mounted() {
         //   this.$socket.emit('login', {userName:localStorage.adminName});
            this.getList();
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

    .table{
        margin-top: 20px;
    }
</style>