<template>
    <div class="media">
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="type" placeholder="请选择" @change="getMediaList(type)">
                        <el-option
                                v-for="item in typeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addMedia">添加素材</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetWx">获取token</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table
                v-loading = "$store.state.loading"
                :border = "true"
                :data="table"
                style="width: 100%">
            <el-table-column
                    label="创建时间"
            >
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{scope.row.content.create_time*1000 | date}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="用户名称"
            >
                <template slot-scope="scope">
                    <i class="el-icon-user"></i>
                    <span style="margin-left: 10px">{{scope.row.content.news_item[0].author}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="素材id"
            >
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.media_id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="素材名称"
            >
                <template slot-scope="scope">
                    <span >{{scope.row.content.news_item[0].title}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="简介"
            >
                <template slot-scope="scope">
                    <span >{{scope.row.content.news_item[0].digest}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="查看素材"
            >
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.content.news_item[0].url}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="图片预览"
            >
                <template slot-scope="scope">
                    <el-image :src="scope.row.content.news_item[0].thumb_url" style="width: 100px;height: 100px"  :preview-src-list="[scope.row.content.news_item[0].thumb_url]"
                    ></el-image>

                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
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
        <addMedia ref="addMedia"></addMedia>
    </div>
</template>

<script>
    import addMedia from "../../components/dialog/addMedia";
    export default {
        name: "media",
        components:{
            addMedia
        },
        data(){
            return{
                table: [],
                form:{},
                pageSum:1,
                typeList:[//图片（image）、视频（video）、语音 （voice）、图文（news）
                    {
                        label:"图文",
                        value:"news"
                    },
                    {
                        label:"图片",
                        value:"image"
                    },
                    {
                        label:"视频",
                        value:"video"
                    },
                    {
                        label:"语音",
                        value:"voice"
                    },
                ],
                type:"news"
            }
        },
        methods:{
            changeCurrent(){

            },
            addMedia(){
                this.$refs.addMedia.dialogFormVisible=true;
            },
            open(){
                this.$message.error("暂时不能删除")
                this.$goEasy.publish({
                    channel: "my_channel", //替换为您自己的channel
                    message: "Hello, GoEasy!" //替换为您想要发送的消息内容
                });
            },
            resetWx(){
                this.$axios.get("/wx/config").then((data)=>{
                    if(data.ok==1){
                        this.$message.success(data.msg)
                    }else{
                        this.$message.error(data.msg)
                    }
                })
            },
            getMediaList(type){
                this.$axios.get("/wx/getList",{
                    params:{
                        type:type
                    }
                }).then(data=>{
                    console.log(data)
                        this.table=data.item;
                })
            }
        },
        mounted() {
            this.getMediaList()
        }
    }
</script>

<style scoped>
.media .ioc{
    padding: 10px;
}

</style>
<style>
    .media  .el-input__inner{
        width: 240px;
    }
</style>