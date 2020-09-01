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
                <el-form-item>
                    <span style="color:red"><b>说明:</b> 在地图上鼠标单击右键选定位置，单击位置坐标添加用户信息</span>
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
                locationList:[],
                locationInfo:{},
                infoWindow:null
            }
        },
        methods:{
            MapInit () {
                let _this = this;
                this.map = new AMap.Map("map", {
                    center: [113.65, 34.76],//113.65, 34.76   ///113.506293,33.26691
                    mapStyle: "amap://styles/d6bf8c1d69cea9f5c696185ad4ac4c86", //设置地图的显示样式
                    resizeEnable: true,
                    zoom: 10
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
                        image: e.picPath,  // Icon的图像地址
                        imageSize: new AMap.Size(38, 40)   // 根据所设置的大小拉伸或压缩图片
                    });
                    var marker = new AMap.Marker({
                        map:_this.map,
                        position: new AMap.LngLat(e.lng,e.lat),
                        title: e.userName,
                        offset: new AMap.Pixel(10, 10),
                        icon,
                    });
                    let mapContent= `<div class="sp11 " style="width: 65%"><h5 class="sp12">${e.userName}</h5><h5 class="sp12">${e.phone}</h5></div>`;
                    var infoWindow = new AMap.InfoWindow({
                        content: mapContent,
                        autoMove: false,
                        offset: new AMap.Pixel(0, -10)
                    });
                    marker.on("click",()=>{
                        // 打开信息窗口
                       infoWindow.open(_this.map,[e.lng,e.lat]);
                    })
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
            setLocation(e){
                let {lng,lat}=e.lnglat;
                this.$refs.addUser.dialogFormVisible=true;
                this.$refs.addUser.form.lng=lng;
                this.$refs.addUser.form.lat=lat;
            },
            search(){
                   this.$axios.get("/locationSearch",{
                       params:{
                           userName:this.userName
                       }
                   }) .then(data=>{
                       if(data.ok==1){
                           this.map.setCenter([data.locationList[0].lng,data.locationList[0].lat]);
                           this.map.setZoom(18)

                       }
                   })
            },
            addUser(){
                this.$message.error("在地图上鼠标单击右键选定位置，单击位置坐标添加用户信息")
            },
            getLocationList(){
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
            },
            getLocation(){
                var map,geolocation;
                let _this=this;
                map = new AMap.Map('container', {
                    resizeEnable: true
                });
                map.plugin('AMap.Geolocation', function() {
                    geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                        buttonPosition:'RB',    //定位按钮的停靠位置
                        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true,   //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    });
                    map.addControl(geolocation);
                    geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', _this.onComplete); //返回定位信息
                    AMap.event.addListener(geolocation, 'error', _this.onError); //返回定位出错信息
                });

            },
            onComplete(data){
                this.locationInfo=data;
                let {lng,lat}=data.position;
                this.map.setCenter([lng,lat]);
                this.map.setZoom(18);
                this.marker(1,{lnglat:{lng,lat}})
            },
            onError(data){
                console.log(data)
            }
        },
        mounted() {
            this.MapInit();
           this.getLocation();
            this.getLocationList();
        }
    }
</script>

<style scoped>
.map{
    height: 800px;width: 100%;
}
.sp11 {
    width: 100%;
display: flex;
    flex-direction: column;
    margin-bottom: 5px;
    color: #848ca4;
    font-size: 8px;
}
.sp12 {
    color: #333333;
    width: 100%;
}

</style>