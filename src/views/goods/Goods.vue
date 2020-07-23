<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="goodsName" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="addGoods">添加商品</el-button>
                </el-form-item>
            </el-form>
        </div>
        <AddGoods ref="goodsCom"></AddGoods>
        <div>
            <el-table
                    v-loading = "$store.state.loading"
                    :border = "true"
                    :data="$store.state.goods?$store.state.goods.goodsList:null"
                    style="width: 100%">
                <el-table-column
                        label="商品ID"
                        >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row._id}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="商品名称"
                        >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.goodsName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="商品类别"
                       >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.goodsType}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="店铺名称"

                        >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.shopName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="原价"
                        >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.goodsOldPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="现价"
                       >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.goodsNewPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="库存"
                        >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.goodsNum}}</span>
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
                                :src="'/ele/'+scope.row.goodsPic" alt="帅哥"
                                :preview-src-list="['/ele/'+scope.row.goodsPic]">
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
                            @click="updateGoods(scope.row)"
                        >编辑</el-button>
                        <el-button type="danger"
                                   @click="delGoods(scope.row._id)"
                                   size="mini">删 除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination actions-name="getGoodsList" :keyword="goodsName"></pagination>
    </div>
</template>

<script>
    export default {
        name: "Goods",
        data(){
            return{
                goodsName:"",
                goodsVisible:false
            }
        },
        methods:{
            search(){
                this.$store.dispatch("getGoodsList",{keyWord:this.goodsName})
            },
            addGoods(id){
                this.$refs.goodsCom.dialogFormVisible = true;
                this.$store.dispatch('getAllShopTypeList');
                this.$refs.goodsCom.title = 0;
                this.$refs.goodsCom.form.updateId=id;
            },
            delGoods(id){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((data) => {
                    if(data.ok==1){
                        this.$store.dispatch("delGoods",id);
                        this.$message({
                            type: 'success',
                            message: data.msg
                        });
                        this.$store.dispatch("adminHandle",{type:"删除商品",adminName:localStorage.adminName,msg:data.msg});
                    }else{
                        this.$message.error(data.msg);
                        this.$store.dispatch("adminHandle",{type:"删除商品",adminName:localStorage.adminName,msg:data.msg});
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            updateGoods(data){
                this.$refs.goodsCom.dialogFormVisible = true;
                this.$refs.goodsCom.title = 1;
                this.$refs.goodsCom.form.updateId=data._id;
                this.$store.dispatch('getAllShopTypeList');
                this.$store.dispatch("getThisShop",{shopTypeId:data.shopTypeId});
                this.$store.dispatch("getThisTypeGoods",{shopId:data.shopId});
                this.$refs.goodsCom.form.shopTypeId=data.shopTypeId;
                this.$refs.goodsCom.form.shopId=data.shopId;
                this.$refs.goodsCom.form.goodsTypeId=data.goodsTypeId;
                this.$refs.goodsCom.form.goodsName=data.goodsName;
                this.$refs.goodsCom.form.goodsNewPrice=data.goodsNewPrice;
                this.$refs.goodsCom.form.goodsOldPrice=data.goodsOldPrice;
                this.$refs.goodsCom.form.goodsNum=data.goodsNum;
                this.$refs.goodsCom.form.isRecommend=window.eval(data.isRecommend);
            }
        },
        mounted(){
            this.$store.dispatch("getGoodsList")
        }

    }
</script>

<style scoped>

</style>