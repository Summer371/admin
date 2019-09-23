<template>
    <el-dialog title="添加商品类型" :visible.sync="dialogFormVisible" >
        <el-form :model="form"  ref="myForm">
            <el-form-item label="商品类别" prop="goodsType" label-width="120px">
                <el-input v-model="form.goodsType" autocomplete="off" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="店铺类别" label-width="120px">
        <el-select v-model="form.shopTypeId" placeholder="请选择店铺类别" @change="change">
            <el-option  v-for="item in $store.state.shop.allShopTypeList" :value="item._id" :label="item.shopType" :key="item.shopType"></el-option>
        </el-select>
    </el-form-item>
        <el-form-item label="店铺名称" label-width="120px">
            <el-select v-model="form.shopId" placeholder="请选择店铺名称">
                <el-option  v-for="item in $store.state.goods.thisTypeShopList" :value="item._id" :label="item.shopName" :key="item.shopName"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="是否推荐" label-width="120px">
            <el-radio v-model="form.isRecommend" :label="true">是</el-radio>
            <el-radio v-model="form.isRecommend" :label="false">否</el-radio>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import axios from "axios"
    export default {
        name: "AddGoodsType",
        data(){
            return{
                form:{
                    goodsType:"",
                    shopId:"",
                    shopTypeId:"",
                    isRecommend:false
                },
                dialogFormVisible:false
            }
        },
        methods:{
            cancel(){
                this.dialogFormVisible=false;
                this.$refs.myForm.resetFields();
                this.$refs.upload.clearFiles();
            },
            submitForm(){
                this.dialogFormVisible=false;
                axios.post("/goodsType",this.form).then(()=>{
                    this.success()
                })
            },
            change(){
                this.form.shopId="";
                this.$store.dispatch("getThisShop",{shopTypeId:this.form.shopTypeId})
            },
            success(){
                if(this.$route.name!=="goodsType"){
                    this.$router.push("/goodsType")
                }
                this.$store.dispatch("getGoodsType")
            }
        },
        mounted(){
           this.$store.dispatch("getGoodsType");

        }
    }
</script>

<style scoped>

</style>