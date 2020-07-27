<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="addUser">添加用户</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="map" id="map"></div>
        <addUser ref="addUser"></addUser>
    </div>
</template>

<script>

    export default {
        name: "location",
        data(){
            return{
                    // data中,location是地理编码，color 1绿2黄3红
                map:null,
                markers:[],
                userName:"",
                locationList:[]
            }
        },
        methods:{
            MapInit () {
                let _this = this;
                this.map = new AMap.Map("map", {
                    center: [113.506293,33.26691],
                    mapStyle: "amap://styles/d6bf8c1d69cea9f5c696185ad4ac4c86", //设置地图的显示样式
                    resizeEnable: true,
                    zoom: 18
                });
                this.map.on("contextmenu",(e)=>{
                    this.marker(1,e);
                })
            },
            marker(type,e){
                let _this = this;
                if(type==0){
                    let icon = new AMap.Icon({
                        size: new AMap.Size(38, 40),    // 图标尺寸
                        image: 'ele'+e.headImg,  // Icon的图像地址
                        imageSize: new AMap.Size(38, 40)   // 根据所设置的大小拉伸或压缩图片
                    });
                    var marker = new AMap.Marker({
                        map:_this.map,
                        position: new AMap.LngLat(e.lng,e.lat),
                        title: e.userName,
                        offset: new AMap.Pixel(10, 10),
                        icon,
                    });
                }else if(type==1){
                    let {lng,lat}=e.lnglat;
                    var marker = new AMap.Marker({
                        map:_this.map,
                        position: new AMap.LngLat(lng,lat),
                        title: '添加位置'
                    });
                    marker.on("click",e=>{
                        _this.setLocation(e)
                    })
                }
            },
            newIcon(){
                let icon = new AMap.Icon({
                    size: new AMap.Size(58, 70),    // 图标尺寸
                    image: 'http://localhost:8080/static/img/patrol.png',  // Icon的图像地址
                    imageSize: new AMap.Size(58, 70)   // 根据所设置的大小拉伸或压缩图片
                });
            },
            setLocation(e){
                let {lng,lat}=e.lnglat;
                this.$refs.addUser.dialogFormVisible=true;
                this.$refs.addUser.form.lng=lng;
                this.$refs.addUser.form.lat=lat;
            },
            search(){

            },
            addUser(){

            },
            getLocation(){
                this.$axios.get("/locationList").then(data=>{
                    if(data.ok==1){
                        this.locationList=data.locationList;
                        this.locationList.forEach(e=>{
                            this.marker(0,e);
                        })

                    }else{
                        this.locationList=[]
                    }
                })
            }
        },
        mounted() {
            this.MapInit();
           this.getLocation();
        }
    }
</script>

<style scoped>
.map{
    height: 800px;width: 100%;
}

</style>