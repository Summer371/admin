<template>
    <div>
        <el-upload
                class="upload-demo"
                action="/ele/saveFile"
                ref="upload"
                name="file"
                :headers="{authorization:$store.state.admin.token,permissions:$store.state.admin.permissions}"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="3"
                :on-success="successUp"
                :on-error="upError"
                :on-exceed="handleExceed"
                :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
         <!--   <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>
    </div>
</template>

<script>
    export default {
        name: "saveFile",
        data(){
            return{
                fileList:[]
            }
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            successUp(v){
                this.$message.success(v.msg)
                this.$refs.upload.clearFiles();
            },
            upError(v){
                this.$message.error(v.msg)
            }
        }
    }
</script>

<style scoped>

</style>