<template>
    <el-pagination
            :page-count = "$store.state.pageInfo.pageSum"
            @current-change="changeCurrent"
            background
            layout="prev, pager, next"
    >
    </el-pagination>
</template>

<script>
    export default {
        name: "pagination",
        props:["actionsName","keyword"],
        methods:{
            changeCurrent(pageIndex=1){
                this.$store.dispatch(this.actionsName, {pageIndex,keyWord:this.keyword})
            }
        },
        mounted(){
            this.changeCurrent();
        }
    }
</script>

<style scoped>

</style>