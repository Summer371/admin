<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="form.shopName" placeholder="请输入店铺的名字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="addShop">添加店铺</el-button>
                </el-form-item>
            </el-form>
        </div>

        <AddShop  ref="shopCom"></AddShop>
        <div>
            <el-table
                    v-loading = "$store.state.loading"
                    :border = "true"
                    :data="$store.state.shop.shopList"
                    style="width: 100%">
                <el-table-column
                        label="店铺ID"
                       >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row._id}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="店铺名字"
                       >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.shopName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="店铺类别"
                        width="180"
                       >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.shopType}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="是否推荐"
                        width="80"
                       >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.isRecommend=="true"?"是":"否"}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="图片"
                        >
                    <template slot-scope="scope">
                        <el-image
                                style="width: 100px; height: 100px"
                                :src="'/ele/'+scope.row.shopPic" alt="帅哥"
                                :preview-src-list="['/ele/'+scope.row.shopPic]">
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
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="upData(scope.row)"
                        >编辑</el-button>
                        <el-button type="danger"
                                   @click="open(scope.row._id)"
                                   size="mini">删 除</el-button>
                        <el-button
                                   type="success"
                                   @click="addGoodsType(scope.row)"
                                   size="mini">添加商品类别</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <AddGoodsType ref="goodsTypeCom"></AddGoodsType>
        <pagination actions-name="getShop" :keyword="form.shopName"></pagination>
    </div>
</template>

<script>
    export default {
        name: "shop",
        data(){
            return{
                form:{
                    shopType:"",
                    shopName:''
                },
                shopTypeVisible:false,
            }
        },
        methods:{
            addShop(){
                this.$refs.shopCom.dialogFormVisible=true;
                this.$store.dispatch('getAllShopTypeList');
                this.$refs.shopCom.title=0;
                this.$refs.shopCom.form={};
            },
            submitUpload() {
                this.$refs.upload.submit();
                this.$refs.shopCom.shopTypeVisible = false;
                this.$store.dispatch("adminHandle",{type:"添加店铺",adminName:localStorage.adminName});
            },
            open(id){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch("delShop",id);
                    this.$store.dispatch("getShop");
                    this.$store.dispatch("adminHandle",{type:"删除店铺",adminName:localStorage.adminName});
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            search(){
                this.$store.dispatch("getShop",{keyWord:this.form.shopName})
            },
            addGoodsType(data){
                this.$refs.goodsTypeCom.dialogFormVisible=true;
                this.$store.dispatch('getAllShopTypeList');
                this.$refs.goodsTypeCom.form.shopTypeId=data.shopTypeId;
                this.$refs.goodsTypeCom.change();
                this.$refs.goodsTypeCom.form.shopId=data._id;
            },
            upData(data){
                this.$refs.shopCom.dialogFormVisible=true;
                this.$refs.shopCom.title=1;
                this.$refs.shopCom.form.updateId=data._id;
                this.$store.dispatch('getAllShopTypeList');
                this.$refs.shopCom.form.shopTypeId=data.shopTypeId;
                this.$refs.shopCom.form.shopName=data.shopName;
                this.$refs.shopCom.form.isRecommend=window.eval(data.isRecommend);
            }
        },
        mounted(){
            this.$store.dispatch("getShop");
        }
    }
</script>

<style scoped>

</style>