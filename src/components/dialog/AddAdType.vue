<template>
    <el-dialog :title="title?'修改广告':'添加广告'" :visible.sync="dialogFormVisible" >
        <el-form :model="form" ref="myForm">
            <el-form-item label="广告类别" prop="shopName" label-width="120px">
                <el-input v-model="form.shopName" autocomplete="off" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="是否推荐" label-width="120px">
                <el-radio v-model="form.isRecommend" :label="true">是</el-radio>
                <el-radio v-model="form.isRecommend" :label="false">否</el-radio>
            </el-form-item>
        </el-form>
        <el-upload
                class="upload-demo"
                ref="upload"
                :data="form"
                name="shopPic"
                :headers="{authorization:$store.state.admin.token}"
                :action="title?'/ele/updateAd':'/ele/addAd'"
                :limit="1"
                :on-success="success"
                :multiple="false"
                list-type="picture"
                :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submitUpload">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "AddShop",
        data(){
            return{
                form:{
                    shopTypeId:"",
                    shopName:"",
                    isRecommend:false,
                    updateId:''
                },
                dialogFormVisible:false,
                title:0
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
                    this.dialogFormVisible=false;
                    this.$refs.upload.submit();
                    this.getAdType();
                }else{
                    this.$message.error("请上传文件");
                }
            },
            success(){
                this.$refs.myForm.resetFields();
                this.$refs.upload.clearFiles();
                if(this.$route.name!=="ad"){
                    this.$router.push("/ad")
                }
              this.getAdType();
            },
            getAdType(){
                this.$axios.get("/adType").then(data=>{
                    console.log(data)
                })
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>