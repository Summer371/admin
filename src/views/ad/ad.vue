<template>
    <div class="ad">
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="adType" placeholder="广告类别">
                        <el-option v-for="item in adTypeList" :value="item._id" :label="item.adType" :key="item._id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="adminName" placeholder="请输入管理名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="addAd">添加广告</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table
                v-loading = "$store.state.loading"
                :border = "true"
                :data="adList"
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
                    label="广告名称"
                   >
                <template slot-scope="scope">
                    <i class="el-icon-user"></i>
                    <span style="margin-left: 10px">{{scope.row.adName}}</span>
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
                    label="广告图"
                    >
                <template slot-scope="scope">
                    <el-image
                            style="width: 100px; height: 100px"
                            :src="'/ele/'+scope.row.adPic" alt="帅哥"
                            :preview-src-list="['/ele/'+scope.row.adPic]">
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
        <AddAd ref="AddAd"></AddAd>
    </div>
</template>

<script>
    export default {
        name: "ad",
        data(){
            return{
                adType:'',
                adTypeList:[],
                pageSum:0,
                adList:[],
                adminName:''
            }
        },
        methods:{
            changeCurrent(v){
                    this.getList(v)
            },
            getList(pageIndex=1,keyWord=""){
                this.$axios.get("/advertisement",{
                    params:{
                        pageIndex,
                        keyWord
                    }
                }).then(data=>{
                    if(data.ok==1){
                        this.adTypeList=data.data.adList;
                        this.pageSum=data.data.pageSum;
                    }else{
                        this.adTypeList=[]
                    }

                }).catch(e=>{
                    this.adTypeList=[]
                })
            },
            update(){

            },
            addAd(){
                this.$refs.AddAd.dialogFormVisible=true;
                this.$refs.AddAd.init();
            },
            search(){

            },
            getAdType(){
                this.$axios.get("/adTypeList").then(data=>{
                    if(data.ok==1){
                        this.adTypeList=data.data.adTypeList;
                    }else{
                        this.adTypeList=[]
                    }

                }).catch(e=>{
                    this.adTypeList=[]
                })
            }
        },
        mounted() {
            this.getList();
            this.getAdType();
        }
    }
</script>

<style scoped>

</style>