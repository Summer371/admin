<template>
    <el-dialog title="管理员权限" :visible.sync="dialogFormVisible" >
        <el-form  ref="myForm">
            <el-form-item label="管理名称" prop="adminName" label-width="120px">
                <el-input v-model="adminName" autocomplete="off" style="width: 80%" disabled></el-input>
            </el-form-item>
            <el-form-item label="管理权限" prop="permissions" label-width="120px">
                <el-select v-model="permissions" placeholder="请选择管理权限">
                    <el-option v-for="item in permissionsList" :value="item.id" :label="item.permissions" :key="item.id"></el-option>
                </el-select>
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
        name: "setPermissions",
        data(){
            return{
                    adminName:"",
                    permissions:"00",
                id:"",
                dialogFormVisible:false,
                permissionsList:[
                    {
                        id:"00",
                        permissions:"普通",
                    },
                    {
                        id:"01",
                        permissions:"管理"
                    },
                    {
                        id:"02",
                        permissions:"全部"
                    }
                ]
            }
        },
        methods:{
            submitUpload(){
                this.$axios.post("/permissions",{
                    permissions:this.permissions,
                    id:this.id,
                    adminName:this.adminName
                }).then(data=>{
                    if(data.ok==1){
                        this.$message.success(data.msg);
                        this.dialogFormVisible=false;
                        this.$parent.getList();
                        localStorage.permissions=this.permissions;
                        this.$store.dispatch("adminHandle",{type:"修改管理权限",adminName:localStorage.adminName,msg:data.msg});
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            cancel(){
                this.dialogFormVisible=false;
            }
        }
    }
</script>

<style scoped>

</style>