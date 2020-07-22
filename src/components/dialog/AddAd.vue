<template>
    <el-dialog :title="title?'修改广告':'添加广告'" :visible.sync="dialogFormVisible" >
        <el-form :model="form" ref="myForm">
            <el-form-item label="广告名称" prop="shopName" label-width="120px">
                <el-input v-model="form.adName" autocomplete="off" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="广告类别" prop="shopTypeId" label-width="120px">
                <el-select v-model="form.adTypeId" placeholder="请选择广告类别">
                    <el-option v-for="item in adTypeList" :value="item._id" :label="item.adType" :key="item._id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="店铺类别" prop="goodsType" label-width="120px">
                <el-select v-model="form.shopTypeId" placeholder="请选择店铺类别" @change="shopTypeChange">
                    <el-option v-for="item in shopTypeList" :key="item._id" :value="item._id" :label="item.shopType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发布店铺" prop="shopId" label-width="120px">
                <el-select v-model="form.shopId" placeholder="请选择广告类别">
                    <el-option v-for="item in shopList" :value="item._id" :label="item.shopName" :key="item._id"></el-option>
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
                :action="title?'/ele/updateAdvertisement':'/ele/advertisement'"
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
        name: "AddAd",
        data(){
            return{
                form:{
                    shopTypeId:"",
                    shopName:"",
                    isRecommend:false,
                    updateId:'',
                    adTypeId:''
                },
                shopList:[],
                adTypeList:[],
                shopTypeList:[],
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
            success(){
                this.$refs.myForm.resetFields();
                this.$refs.upload.clearFiles();
                if(this.$route.name!=="shop"){
                    this.$router.push("/shop")
                }
                this.$store.dispatch("getShop")
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
                this.$sxios.get("/thisTypeShop",{
                    params:{
                        id:this.form.shopTypeId
                    }
                }).then(data=>{
                    if(data.ok==1){
                        this.shopList=data.shopList;
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