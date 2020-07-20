<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="shopType" placeholder="请输入店铺的类别"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="addShopType">添加店铺类别</el-button>
                </el-form-item>
            </el-form>
        </div>
        <AddShopType ref="shopType"></AddShopType>
        <AddShop  ref="shopCom"></AddShop>
        <div>
            <el-table
                    v-loading = "$store.state.loading"
                    :border = "true"
                    :data="$store.state.shop.shopTypeList"
                    style="width: 100%">
                <el-table-column
                        label="店铺类别ID"
                        >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row._id}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="店铺类别"
                       >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.shopType}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="图片"
                        >
                    <template slot-scope="scope">
                        <el-image
                                style="width: 100px; height: 100px"
                                :src="'/ele/'+scope.row.shopTypePic" alt="帅哥"
                                :preview-src-list="['/ele/'+scope.row.shopTypePic]">
                        </el-image>

                    </template>
                </el-table-column>
                <el-table-column
                        label="创建时间"
                >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.createTime | date}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        >
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                plain disabled
                        >编辑</el-button>
                        <el-button type="danger"
                                   @click="open(scope.row._id)"
                                   size="mini">删 除</el-button>
                        <el-button type="primary"
                                   @click="getAllShopTypeList(scope.row)"
                                   size="mini">添加店铺</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination actions-name="getShopTypeList" :keyword="shopType"></pagination>
    </div>
</template>

<script>
    export default {
        name: "GoodsType",
        data(){
            return{
                shopType:"",
                shopTypeVisible:false
            }
        },
        methods:{
            addShopType(){
                this.$refs.shopType.dialogFormVisible=true;
            },
            submitUpload() {
                this.$refs.upload.submit();
                this.shopTypeVisible = false;
                this.$store.dispatch("getShopTypeList");
                this.$store.dispatch("adminHandle",{type:"添加店铺类型",adminName:localStorage.adminName});
            },
            open(id){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch("delShopTypeList",id);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.$store.dispatch("getShopTypeList");
                    this.$store.dispatch("adminHandle",{type:"删除店铺类别",adminName:localStorage.adminName});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            getAllShopTypeList(data){
                this.$refs.shopCom.dialogFormVisible=true;
                this.$store.dispatch("getAllShopTypeList");
                this.$refs.shopCom.form.shopTypeId=data._id;
            },
            search(){
                this.$store.dispatch("getShopTypeList",{keyWord:this.shopType});

            }

        },
        mounted(){
            this.$store.dispatch("getShopTypeList")
        }
    }
</script>

<style scoped>

</style>