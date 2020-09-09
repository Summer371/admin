<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
               <el-form-item>
                <el-input v-model="adminName" placeholder="请输入管理名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="addAdmin">添加管理员</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table
                v-loading = "$store.state.loading"
                :border = "true"
                :data="adminList"
                style="width: 100%">
            <el-table-column
                    label="注册时间"
                    width="200">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{scope.row.signTime | date}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="管理员"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-user"></i>
                    <span style="margin-left: 10px">{{scope.row.adminName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="头像"
                   >
                <template slot-scope="scope">
                   <el-image :src="scope.row.picPath"  v-if="scope.row.picPath" style="width: 60px"></el-image>
                    <span v-if="!scope.row.picPath">暂无头像</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="权限"
                    width="200">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.permissions | permissions}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="最后登录时间"
                    width="200">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.loginTime | time}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="update(scope.row)"
                    >权限</el-button>
                    <el-button type="danger"
                               @click="open(scope.row._id)"
                               size="mini">删 除</el-button>
                    <el-button type="primary"
                               @click="talk(scope.row)"
                               size="mini">聊 天</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                :total = "pageSum"
                @current-change="changeCurrent"
                background
                layout="prev, pager, next"
        >
        </el-pagination>
        <talk ref="talk"></talk>
        <setPermissions ref="setPermissions"></setPermissions>
        <addAdmin ref="addAdmin"></addAdmin>
    </div>
</template>

<script>
    import talk from "../../components/dialog/talk";
    import addAdmin from "../../components/dialog/addAdmin";
    export default {
        name: "adminList",
        components:{
            talk,
            addAdmin
        },
        data(){
            return{
                adminName:localStorage.adminName,
                adminList:[],
                pageSum:0,

            }
        },
        methods:{
            addAdmin(){
                this.$refs.addAdmin.dialogFormVisible=true;
            },
            search(){
                this.$message.error("本来就没几个人，别搜了！")
            },
            changeCurrent(v){
                this.pageIndex=v;
            },
            talk(op){
                if(op.adminName==this.adminName){
                    this.$message.error("不能与自己聊天！")
                    return
                }
                this.$refs.talk.dialogFormVisible=true;
                this.$refs.talk.socketId=op.socketId;
                this.$refs.talk.title=op.adminName;
                this.$refs.talk.user=op.adminName;
            },
            open(id){
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/admin",{
                        params:{
                            id
                        }
                    }).then(data=>{
                        if(data.ok==1){
                            this.$message.success(data.msg);
                            this.getList();
                        }else{
                            this.$message.error(data.msg)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            update(v){
                this.$refs.setPermissions.dialogFormVisible=true;
                this.$refs.setPermissions.id=v._id;
                this.$refs.setPermissions.adminName=v.adminName;
                this.$refs.setPermissions.permissions=v.permissions || "00";
            },
            getList(){
                this.$axios.get("/adminList").then(data=>{
                    if(data.ok==1){
                        this.adminList=data.data.adminList;
                        this.pageSum=data.data.count;
                    }else{
                        this.adminList=[];
                        this.pageSum=0;
                    }
                })
            }
        },
        mounted() {
            this.getList();
        }
    }
</script>

<style scoped>

</style>
