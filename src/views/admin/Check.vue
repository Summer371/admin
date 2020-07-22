<template>
    <el-table
            :data="checkLog"
            stripe
            style="width: 100%">
        <el-table-column
                prop="adminName"
                label="管理员"
                width="180">
            <template slot-scope="scope">
                <i class="el-icon-s-custom"></i>
                <span style="margin-left: 10px">{{ scope.row.adminName }}</span>
            </template>
        </el-table-column>
        <el-table-column
                prop="type"
                label="操作"
                width="180">
            <template slot-scope="scope">
                <i class="el-icon-edit"></i>
                <span style="margin-left: 10px">{{ scope.row.type }}</span>
            </template>
        </el-table-column>
        <el-table-column
                prop="handleTime"
                label="日期">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.handleTime | time }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import axios from "axios"
    export default {
        name: "Check",
        data(){
            return{
                checkLog:[{
                    adminName:'',
                    type:"",
                    handleTime:''
                }]
            }
        },
        mounted(){
            axios.get("/check").then(data=>{
               this.checkLog=data
            })
        }
    }
</script>

<style scoped>

</style>