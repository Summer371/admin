<template>
    <el-dialog title="添加店铺类别" :visible="dialogFormVisible" >
        <el-form :model="form">
            <el-form-item label="店铺类别" label-width="120px">
                <el-input v-model="form.shopType" autocomplete="off" style="width: 80%"></el-input>
            </el-form-item>
        </el-form>
        <el-upload
                class="upload-demo"
                ref="upload"
                :data="form"
                name="shopTypePic"
                :headers="{authorization:$store.state.admin.token}"
                action="/ele/shopType"
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
        name: "addShopType",
        data(){
            return{
                form:{
                    shopType:""
                },
                dialogFormVisible:false
            }
        },
        props:{
            shopTypeVisible:{
                type:Boolean,
                default:false
            },
        },
        methods:{
            cancel(){
              this.dialogFormVisible=false;
            },
            submitUpload() {
                if(this.$refs.upload.uploadFiles.length>0){
                    this.dialogFormVisible=false;
                    this.$refs.upload.submit();
                    this.$store.dispatch("getShopTypeList")
                }else{
                    this.$message.error("请上传文件");
                }
            },
            success(res){
                if(res.ok === 2 || res.ok === 3){
                    this.$store.commit("OUT_LOGIN")
                }else{
                    this.$emit("update:shop-type-visible",false);
                    this.$store.dispatch("getShopTypeList");
                    if(this.$route.name==="shopType")
                        this.$store.dispatch("getShopTypeList");
                    else
                        this.$router.push({name:"shopType"})
                }
            }
        }
    }
</script>

<style scoped>

</style>