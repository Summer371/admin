<template>
    <el-dialog :title="title?'修改商品':'添加商品'" :visible.sync="dialogFormVisible" >
        <el-form :model="form" ref="myForm">
            <el-form-item label="商品名称" prop="goodsName" label-width="120px">
                <el-input v-model="form.goodsName" autocomplete="off" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="店铺类别" prop="goodsType" label-width="120px">
                <el-select v-model="form.shopTypeId" placeholder="请选择店铺类别" @change="getShopList">
                    <el-option v-for="item in $store.state.shop.allShopTypeList" :value="item._id" :label="item.shopType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="店铺名称" prop="goodsType" label-width="120px" >
                <el-select v-model="form.shopId" placeholder="请选择店铺名称" @change="getGoodsList">
                    <el-option v-for="item in $store.state.goods.thisTypeShopList" :value="item._id" :label="item.shopName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品类型" prop="goodsType" label-width="120px">
                <el-select v-model="form.goodsTypeId" placeholder="请选择商品类别">
                    <el-option v-for="item in $store.state.goods.thisTypeGoodsList" :value="item._id" :label="item.goodsType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品原价" prop="goodsOldPrice" label-width="120px">
                <el-input v-model="form.goodsOldPrice" autocomplete="off" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="商品现价" prop="goodsNewPrice" label-width="120px">
                <el-input v-model="form.goodsNewPrice" autocomplete="off" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="商品库存" prop="goodsNum" label-width="120px">
                <el-input v-model="form.goodsNum" autocomplete="off" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="是否推荐" prop="isRecommend" label-width="120px">
                <el-radio v-model="form.isRecommend" :label="true">是</el-radio>
                <el-radio v-model="form.isRecommend" :label="false">否</el-radio>
            </el-form-item>
        </el-form>
        <el-upload
                class="upload-demo"
                ref="upload"
                :data="form"
                name="goodsPic"
                :headers="{authorization:$store.state.admin.token}"
                :action="title?'ele/updateGoods':'/ele/goods'"
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
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "AddGoods",
        data(){
            return{
                form:{
                    goodsName:'',
                    goodsType:'',
                    goodsNum:"",
                    goodsTypeId:"",
                    shopName:'',
                    shopType:'',
                    shopId:"",
                    shopIdType:"",
                    goodsOldPrice:"",
                    goodsNewPrice:"",
                    isRecommend:false,
                    updateId:''
                },
                title:0,
                dialogFormVisible:false
            }
        },
        methods:{
            cancel(){
                this.dialogFormVisible=false;
                this.$refs.myForm.resetFields();
                this.$refs.upload.clearFiles();
            },
            success(){
                this.$refs.myForm.resetFields();
                this.$refs.upload.clearFiles();
                this.$store.dispatch("getGoodsList");
                if(this.$route.name!=="goods"){
                    this.$router.push("/goods")
                }
            },
            submitForm(){
                if(this.$refs.upload.uploadFiles.length>0){
                    this.dialogFormVisible=false;
                    this.$refs.upload.submit();
                }else{
                    this.$message.error("请上传商品图片");
                }

            },
            getShopList(){
                this.form.shopId="";
                this.$store.dispatch("getThisShop",{shopTypeId:this.form.shopTypeId});
            },
            getGoodsList(){
                this.form.goodsTypeId="";
                this.$store.dispatch("getThisTypeGoods",{shopId:this.form.shopId});
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>

</style>