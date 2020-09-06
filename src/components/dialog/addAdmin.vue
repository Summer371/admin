<template>
    <el-dialog :title="title?'修改管理员':'添加管理员'" :visible.sync="dialogFormVisible" >
        <el-form :model="form" ref="myForm">
            <el-form-item label="管理员名称" prop="userName" label-width="120px">
                <el-input v-model="form.adminName" autocomplete="off" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" label-width="120px">
                <el-input v-model="form.passWord" autocomplete="off" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="头像" label-width="120px">
                <el-upload
                        class="upload-demo"
                        ref="upload"
                        :data="form"
                        name="adminHead"
                        :headers="{authorization:$store.state.admin.token}"
                        :action="title?'/ele/updateAdmin':'/ele/insertAdmin'"
                        :limit="1"
                        :on-success="success"
                        :multiple="false"
                        list-type="picture"
                        :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submitUpload">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "addAdmin",
        data(){
            return{
                title:0,
                dialogFormVisible:false,
                form:{}
            }
        },
        methods:{
            cancel(){
                this.dialogFormVisible=false;
                this.$refs.myForm.resetFields();
                this.$refs.upload.clearFiles();
                //this.form={};
            },
            submitUpload(){
                if(this.$refs.upload.uploadFiles.length>0){
                    if(this.form.userName=="" || this.form.phone=="" || this.form.lat=="" ||  this.form.lng==""){
                        this.$message.error("请完善信息")
                    }else{
                        this.$refs.upload.submit();
                    }
                }else{
                    this.$message.error("请上传文件");
                }
            },
            success(data){
                this.dialogFormVisible=false;
                this.$parent.getLocationList();
                this.$store.dispatch("adminHandle",{type:"添加管理员",adminName:localStorage.adminName,msg:data.msg});
                this.$message.success(data.msg)
            }
        }
    }
</script>

<style scoped>

</style>
