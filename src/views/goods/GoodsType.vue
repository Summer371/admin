<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-button type="success" @click="$refs.goodsTypeCom.dialogFormVisible=true;$store.dispatch('getAllShopTypeList')">
                        添加商品类别</el-button>
                </el-form-item>
            </el-form>
        </div>
        <AddGoodsType ref="goodsTypeCom"></AddGoodsType>
        <div>
            <el-table
                    v-loading = "$store.state.loading"
                    :border = "true"
                    :data="$store.state.goods.goodsTypeList"
                    style="width: 100%">
                <el-table-column
                        label="商品类别ID"
                        width="260">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row._id}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="商品类别"
                        width="180">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.goodsType}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="店铺名称"
                        width="180">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.shopName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="是否推荐"
                        width="160">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.isRecommend?"是":"否"}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="添加时间"
                        width="180">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.createTime | date}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="300">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                plain disabled
                        >编辑</el-button>
                        <el-button type="danger"
                                   @click="delGoodsType(scope.row._id)"
                                   size="mini">删 除</el-button>
                        <el-button type="primary"
                                   @click="addGoods(scope.row)"
                                   size="mini">添加商品</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <AddGoods ref="goodsCom"></AddGoods>
        </div>
        <pagination actions-name="getGoodsType" :keyword="form.goodsType"></pagination>
    </div>

</template>

<script>
    export default {
        name: "GoodsType",
        data(){
            return{
                form:{
                    goodsType:"",
                    isRecommend:false
                }
            }
        },
        methods:{
            delGoodsType(id){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch("delGoodsType",id);
                    this.$store.dispatch("adminHandle",{type:"删除商品类别",adminName:localStorage.adminName});
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
            addGoods(data){
                this.$refs.goodsCom.dialogFormVisible=true;
                this.$store.dispatch('getAllShopTypeList');
                this.$store.dispatch("getThisShop",{shopTypeId:data.shopTypeId});
                this.$store.dispatch("getThisTypeGoods",{shopId:data.shopId});
                this.$refs.goodsCom.form.shopTypeId=data.shopTypeId;
                this.$refs.goodsCom.form.shopId=data.shopId;
                this.$refs.goodsCom.form.goodsTypeId=data._id;
            }
        },
        mounted(){
            this.$store.dispatch("getGoodsType");
        }
    }
</script>

<style scoped>

</style>