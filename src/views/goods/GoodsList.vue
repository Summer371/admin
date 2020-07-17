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
            </el-form>
        </div>
        <div>
            <el-table
                    v-loading = "$store.state.loading"
                    :border = "true"
                    :data="$store.state.goods.goodsList"
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
                        label="店铺类别"

                >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.shopType}}</span>
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
            </el-table>
        </div>
        <pagination actions-name="getGoodsList" :keyword="goodsName"></pagination>
    </div>
</template>

<script>
    export default {
        name: "GoodsList",
        data(){
            return{
                goodsName:''
            }
        },
        mounted(){
            this.$store.dispatch("getGoodsList")
        },
        methods:{
            search(){
                this.$store.dispatch("getGoodsList",{keyWord:this.goodsName})
            }
        }
    }
</script>

<style scoped>

</style>