<template>
    <div class="ad">
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table
                v-loading = "$store.state.loading"
                :border = "true"
                :data="userList"
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
                    <span style="margin-left: 10px">{{scope.row.userName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="电话"
            >
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="照片"
            >
                <template slot-scope="scope">
                    <el-image
                            style="width: 100px; height: 100px"
                            :src="scope.row.picPath" alt="帅哥"
                            :preview-src-list="[scope.row.picPath]">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="update(scope.row)"
                    >编辑</el-button>
                    <el-button type="danger"
                               @click="open(scope.row._id)"
                               size="mini">删 除</el-button>
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
</template>

<script>
    export default {
        name: "userList",
        data(){
            return{
                adType:'',
                adTypeList:[],
                pageSum:0,
                userList:[],
                userName:''
            }
        },
        methods:{
            select(){
                this.getList(1,"",this.adType)
            },
            changeCurrent(v){
                this.getList(v)
            },
            getList(pageIndex=1,keyWord=""){
                this.$axios.get("/allLocationList",{
                    params:{
                        pageIndex,
                        keyWord
                    }
                }).then(data=>{
                    if(data.ok==1){
                        this.userList=data.data.locationList;
                        this.pageSum=data.data.pageSum;
                    }else{
                        this.userList=[];
                        this.$message.error(data.msg)
                    }

                }).catch(()=>{
                    this.userList=[]
                })
            },
            update(){

            },
            search(){
                this.getList(1,this.userName)
            },
            open(id){
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/userLocation",{
                        params:{
                            id
                        }
                    }).then(data=>{
                        if(data.ok==1){
                            this.getList();
                            this.$message.success(data.msg)
                        }else{
                            this.$message.error(data.msg)
                        }
                        this.$store.dispatch("adminHandle",{type:"删除用户信息",adminName:localStorage.adminName,msg:data.msg});
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
            this.getList();
        }
    }
</script>

<style scoped>

</style>