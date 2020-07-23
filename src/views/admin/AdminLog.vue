<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-button type="success" @click="$refs.AddShopType.dialogFormVisible = true">添加店铺类别</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"><i class="el-icon-phone"></i> <a href="tel:17530871070" style="text-decoration: none;color: white">联系管理员</a></el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table
                v-loading = "$store.state.loading"
                :border = "true"
                :data="$store.state.admin?$store.state.admin.adminLog:null"
                style="width: 100%">
            <el-table-column
                    label="日期"
                    >
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{scope.row.createTime | time}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="管理员"
                    >
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>姓名: {{ scope.row.adminName }}</p>
                        <p>时间: {{ scope.row.createTime | date}}</p>
                        <div slot="reference" class="name-wrapper">
                            <i class="el-icon-user"></i><el-tag size="medium">{{ scope.row.adminName }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="IP"
                    >
                <template slot-scope="scope">
                    <i class="el-icon-cherry"></i>
                    <span style="margin-left: 10px">{{scope.row.ip}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="位置"
                   >
                <template slot-scope="scope">
                    <i class="el-icon-location"></i>
                    <span style="margin-left: 10px">{{scope.row.location}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="$message.error('并不能编辑qaq!')"
                    >编辑</el-button>
                    <el-button type="danger"
                               @click="open(scope.row._id)"
                               size="mini">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="toolbar">
            <Pagination actions-name="adminLog"></Pagination>
        </div>
        <AddShopType ref="AddShopType"></AddShopType>
    </div>
</template>

<script>
    export default {
        name: "adminLog",
        data(){
            return {
                shopTypeVisible:false,
                ip:returnCitySN["cip"]
            }
        },
        methods:{
            open(id) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch("adminLogDel", id);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.$store.dispatch("adminLog");
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        mounted(){
            this.$store.dispatch("adminLog");
        }
    }
</script>

<style scoped>

</style>