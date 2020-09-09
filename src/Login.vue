<template>
    <div>
        <el-form :model="adminInfo" :rules="rules" ref="adminForm" class="container">
            <h3>个人开发管理登录系<span @click="sig">统</span></h3>
            <el-form-item  prop="adminName">
                <el-input v-model="adminInfo.adminName" placeholder="管理员账号"></el-input>
            </el-form-item>
            <el-form-item  prop="passWord">
                <el-input v-model="adminInfo.passWord" type="password" placeholder="管理员密码" show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm" class="loginBn" :loading="$store.state.loading"  @keyup.enter.native="submitForm">立即登录</el-button>
                <el-button @click="resetForm" class="resetBn">重置</el-button>
            </el-form-item>
            <el-form-item  prop="passWord">
                <div id='text' style="text-align:center">豫ICP备19039785号<br><a href="http://www.beian.miit.gov.cn">工信部网站</a></div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return{
                adminInfo: {
                    adminName: '',
                    passWord: '',
                    ip:returnCitySN["cip"]?returnCitySN["cip"]:'',
                    location:returnCitySN["cname"]?returnCitySN["cname"]:''
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
                            this.$router.push("adminLog")
                        } catch ({msg}) {
                            this.$message.error(msg);
                        }
                    }
                } )
            },
            sig(){
                this.$refs.adminForm.validate( (valid) => {
                    if (valid) {
                        this.$axios.post("/adminSign",{
                            adminInfo:this.adminInfo
                        }).then((data)=>{
                            this.$message({
                                message: data.msg,
                                type: data.ok==1 ? "success":"warning"
                            });
                            if(data.ok==1){
                                this.$router.push("/adminList")
                            }
                            this.adminInfo.adminName="";
                            this.adminInfo.passWord="";
                        })
                    }
                })
            },
            resetForm(){
                this.$refs.adminForm.resetFields();
                this.$store.state.loading=false;
            }
        },
        created () {
            // 回车事件
            var that = this;
            document.onkeydown = function (e) {
                var ev = (typeof event != 'undefined') ? window.event : e;
                if (ev.keyCode == 13) {
                    that.submitForm();
                }
            }
        },
        mounted() {
           // this.$store.dispatch("getLocation")
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
            width: 40%;margin-left: 10%;
        }

    }
</style>
<style>
    .el-input__inner{
        height: 38px!important;
    }
</style>