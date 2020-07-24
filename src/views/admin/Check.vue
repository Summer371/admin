<template>
    <div>
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
                prop="msg"
                label="信息">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.msg}}</span>
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
        <el-pagination
                :page-count = "pageSum"
                @current-change="changeCurrent"
                background
                layout="prev, pager, next"
        >
        </el-pagination>
    </div>
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
                    handleTime:'',
                    msg:''
                }],
                pageSum:0
            }
        },
        mounted(){
            this.getList();
        },
        methods:{
            getList(pageIndex=1){
                axios.get("/check",{
                    params:{
                        pageIndex
                    }
                }).then(data=>{
                    this.checkLog=data.data.adminHandle;
                    this.pageSum=data.data.pageSum;
                })
            },
            changeCurrent(v){
                this.getList(v)
            }
        }
    }
</script>

<style scoped>

</style>