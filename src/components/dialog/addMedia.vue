<template>
    <el-dialog :title="title?'修改素材':'添加素材'" :visible.sync="dialogFormVisible" >
        <el-form :model="form" ref="myForm">
            <el-form-item label="素材名称" prop="shopName" label-width="120px">
                <el-input v-model="form.Name" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item label="素材类别" prop="shopTypeId" label-width="120px">
                <el-select v-model="form.type" placeholder="请选择" @change="getMediaList(type)">
                    <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="素材类别" prop="shopTypeId" label-width="120px">
                <el-upload
                        class="upload-demo"
                        action="/wx/upload"
                        :data="form"
                        ref="upload"
                        name="file"
                        :multiple="false"
                        list-type="picture"
                        :limit="3"
                        :auto-upload="false"
                        :on-success="success"
                        :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="素材类别" prop="shopTypeId" label-width="120px">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submitUpload">确 定</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>
</template>

<script>
    export default {
        name: "AddAd",
        data(){
            return{
                fileList: [],
                form:{
                    type:"news",
                    name:""
                },
                dialogFormVisible:false,
                title:0,
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

            }
        },
        methods:{
            cancel(){
                this.dialogFormVisible=false;
                this.$refs.myForm.resetFields();
                this.$refs.upload.clearFiles();
            },
            submitUpload(){
                if(this.$refs.upload.uploadFiles.length>0){
                    this.$refs.upload.submit();
                }else{
                    this.$message.error("请上传文件");
                }
            },
            success(data){
                this.$refs.myForm.resetFields();
                this.$refs.upload.clearFiles();
                this.$message.success(data.msg);
                if(this.$route.name!=="ad"){
                    this.$router.push("/ad")
                }else{
                    this.$parent.getList();
                }
                this.dialogFormVisible=false;
                this.$store.dispatch("adminHandle",{type:"添加广告类别",adminName:localStorage.adminName,msg:data.msg});
            },
            init(){
                this.$axios.get("/allShopTypeList").then(data=>{
                    if(data.ok==1){
                        this.shopTypeList=data.shopTypeList;
                    }else{
                        this.shopTypeList=[];
                    }
                }).catch(()=>{
                    this.shopTypeList=[];
                });
                this.$axios.get("/adTypeList").then(data=>{
                    if(data.ok==1){
                        this.adTypeList=data.adTypeList;
                    }else{
                        this.adTypeList=[];
                    }
                }).catch(()=>{
                    this.adTypeList=[];
                });
            },
            shopTypeChange(){
                this.$axios.get("/thisTypeShop",{
                    params:{
                        shopTypeId:this.form.shopTypeId
                    }
                }).then(data=>{
                    if(data.ok==1){
                        this.shopList=data.thisTypeShopList;
                    }else{
                        this.shopList=[];
                    }
                }).catch(()=>{
                    this.shopList=[];
                });
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>