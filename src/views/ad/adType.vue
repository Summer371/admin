<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="adType" placeholder="请输入商品类别"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="addAdType">
                        添加广告类别</el-button>
                </el-form-item>
            </el-form>
        </div>
        <AddAdType ref="AddAdType"></AddAdType>
        <div>
            <el-table
                    v-loading = "loading"
                    :border = "true"
                    :data="adTypeList"
                    style="width: 100%">
                <el-table-column
                        label="广告类别ID"
                >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row._id}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="广告类别"
                >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.adType}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="广告名称"
                >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.adName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="是否推荐"
                >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.isRecommend?"是":"否"}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="添加时间"
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
                                   @click="delAdType(scope.row._id)"
                                   size="mini">删 除</el-button>
                        <el-button type="primary"
                                   @click="addAd(scope.row)"
                                   size="mini">添加广告</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <AddAd ref="AddAd"></AddAd>
        </div>
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
        name: "adType",
        data(){
            return{
                adTypeList:[],
                loading:false,
                pageSum:0,
                adType:''
            }
        },
        methods:{
            changeCurrent(pageIndex=1){

            },
            addAdType(){
                this.$refs.AddAdType.dialogFormVisible=true;
            },
            search(){

            },
            delAdType(){

            },
            addAd(){

            }
        }
    }
</script>

<style scoped>

</style>