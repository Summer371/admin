<template>
    <el-dialog :title="title?'修改店铺':'添加店铺'" :visible.sync="dialogFormVisible" >
        <el-form :model="form" ref="myForm">
            <el-form-item label="店铺名称" prop="shopName" label-width="120px">
                <el-input v-model="form.shopName" autocomplete="off" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="店铺类别" prop="shopTypeId" label-width="120px">
                <el-select v-model="form.shopTypeId" placeholder="请选择店铺类别">
                    <el-option v-for="item in $store.state.shop.allShopTypeList" :value="item._id" :label="item.shopType" :key="item._id"></el-option>
                </el-select>
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
                :action="title?'/ele/updateShop':'/ele/shop'"
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
                    this.$store.dispatch("getShop")
                }else{
                    this.$message.error("请上传文件");
                }
            },
            success(data){
                this.$refs.myForm.resetFields();
                this.$refs.upload.clearFiles();
                this.$store.dispatch("adminHandle",{type:"添加店铺",adminName:localStorage.adminName,msg:data.msg});
                if(this.$route.name!=="shop"){
                    this.$router.push("/shop")
                }
                this.$store.dispatch("getShop")
            }
        }
    }
</script>

<style scoped>

</style>