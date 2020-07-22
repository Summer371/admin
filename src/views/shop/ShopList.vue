<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="shopName" placeholder="请输入店铺的名字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table
                    v-loading = "$store.state.loading"
                    :border = "true"
                    :data="$store.state.shop?$store.state.shop.shopList:null"
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
                       >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.shopType}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="是否推荐"
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
            </el-table>
        </div>
        <pagination actions-name="getShop" :keyword="shopName"></pagination>
    </div>
</template>

<script>
    export default {
        name: "ShopList",
        data(){
            return{
                shopName:''
            }
        },
        methods:{
            search(){
                this.$store.dispatch("getShop",{keyWord:this.form.shopName})
            }
        },
        mounted(){
            this.$store.dispatch("getShop");
        }
    }
</script>

<style scoped>

</style>