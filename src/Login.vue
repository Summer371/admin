<template>
    <el-form :model="adminInfo" :rules="rules" ref="adminForm" class="container">
        <h3>饿了么管理员登录系统</h3>
        <el-form-item  prop="adminName">
            <el-input v-model="adminInfo.adminName" placeholder="管理员账号"></el-input>
        </el-form-item>
        <el-form-item  prop="passWord">
            <el-input v-model="adminInfo.passWord" type="password" placeholder="管理员密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" class="loginBn" :loading="$store.state.loading">立即登录</el-button>
            <el-button @click="resetForm" class="resetBn">重置</el-button>
        </el-form-item>

    </el-form>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return{
                adminInfo: {
                    adminName: '',
                    passWord: '',
                    ip:returnCitySN["cip"],
                    location:returnCitySN["cname"]
                },
                rules: {
                    adminName: [
                        {required: true, message: '请输入管理员账号', trigger: 'blur'},
                        {min: 3, max: 12, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    passWord: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 16, message: '长度在 6 到 10 个字符', trigger: 'blur'}
                    ],
                }
            }
        },
        methods:{
            submitForm(){
                this.$refs.adminForm.validate(async (valid) => {
                    if (valid) {
                        try {
                            await this.$store.dispatch("adminLogin", {
                                adminInfo: this.adminInfo
                            });
                            this.$message({
                                message: '恭喜您，登陆成功！',
                                type: 'success'
                            });

                        } catch ({msg}) {
                            this.$message.error(msg);
                        }
                    }
                } )
            },
            resetForm(){
                this.$refs.adminForm.resetFields();
                this.$store.state.loading=false;
            }
        }
    }
</script>

<style scoped lang="less">
    .container{
        width: 400px;height: 250px;border: 1px solid #eaeaea;padding: 10px;margin: 200px auto;box-shadow: 0 0 20px purple;
        h3{
            text-align: center;padding: 20px;
        }
        .loginBn{
            width: 40%;
        }
        .resetBn{
            width: 40%;margin-left: 20%;
        }
    }
</style>