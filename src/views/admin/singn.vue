<template>
    <el-form :model="adminInfo" :rules="rules" ref="adminForm" class="container">
        <h3>管理员注册系统</h3>
        <el-form-item  prop="adminName">
            <el-input v-model="adminInfo.adminName" placeholder="管理员账号"></el-input>
        </el-form-item>
        <el-form-item  prop="passWord">
            <el-input v-model="adminInfo.passWord" type="password" placeholder="管理员密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="resetForm" class="singnBn" :loading="$store.state.loading">注册</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import axios from "axios"
    export default {
        name: "singn",
    data(){
        return{
            adminInfo: {
                adminName: '',
                passWord: ''
            },
            rules: {
                adminName: [
                    {required: true, message: '请输入管理员账号', trigger: 'blur'},
                    {min: 3, max: 12, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                ],
                passWord: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 6, max: 16, message: '长度在 6 到 10 个字符', trigger: 'blur'}
                ]
            }
        }
    },
    methods:{
        resetForm(){
            this.$refs.adminForm.validate( (valid) => {
                if (valid) {
                    axios.post("/adminSign",{
                        adminInfo:this.adminInfo,
                        creator:localStorage.adminName || ""
                    }).then((data)=>{
                        this.$message({
                            message: data.msg,
                            type: data.ok==1 ? "success":"warning"
                        });
                        this.adminInfo.adminName="";
                        this.adminInfo.passWord="";
                        this.$router.push("/adminList")
                    })
                }
            })
        }
    }
    }
</script>

<style scoped lang="less">
    .container{
        width: 400px;height: 250px;border: 1px solid #eaeaea;padding: 10px;margin: 100px auto;box-shadow: 0 0 20px purple;
    h3{
        text-align: center;padding: 20px;
    }
    .loginBn{
        width: 40%;
    }
    .resetBn{
        width: 40%;margin-left: 20%;
    }
        .singnBn{
            width: 80%;margin-left: 10%;
        }
    }
</style>