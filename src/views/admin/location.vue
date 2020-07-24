<template>
    <div>
        <div class="map" id="map"></div>
    </div>
</template>

<script>

    export default {
        name: "location",
        data(){
            return{
                    // data中,location是地理编码，color 1绿2黄3红
                dataList: [
                    { location: "113.772,22.785", color: 1 },
                    { location: "114.772,22.785", color: 3 },
                    { location: "116.410778,39.897614", color: 2 },
                    { location: "123.499706,41.857793", color: 2 },
                    { location: "111.722363,40.868346", color: 1 },
                    { location: "103.987988,30.662124", color: 3 }
                ]
            }
        },
        methods:{
            MapInit () {
                let _this = this;
                let map = new AMap.Map("map", {
                    center: [105.397428, 35.90923],
                    mapStyle: "amap://styles/bb7f5165253f57515d7ba226b25ad7ec", //设置地图的显示样式
                    resizeEnable: true,
                    zoom: 5
                });
                const style = [
                    {
                        // 1
                        url: "此处放一张图的url",
                        anchor: new AMap.Pixel(5, 5),   // 位移
                        size: new AMap.Size(10, 10) // 图片大小
                    },
                    {
                        // 2
                        url: "此处放另外一张图的url",
                        anchor: new AMap.Pixel(5, 5),
                        size: new AMap.Size(10, 10)
                    },
                    {
                        // 3
                        url: "此处再放一张图的url",
                        anchor: new AMap.Pixel(5, 5),
                        size: new AMap.Size(10, 10)
                    }
                ];

                let locationData = []; //存放经纬度的数组
                let status = null;
                for (let i = 0; i < _this.dataList.length; i++) {
                    let locationArr = _this.dataList[i].location.split(",");
// 判断需要展示的颜色类型
                    if (_this.dataList[i].dataList === 1) {
                        status = 0; //根据下标来相对应样式 例如：绿色对应style数组中的第0个样式
                    } else if (_this.dataList[i].color === 2) {
                        status = 1;
                    } else if (_this.dataList[i].color === 3) {
                        status = 2;
                    }

                    locationData.push({
                        lnglat: locationArr,
                        style: status // 对应的status相对应的样式 style
                    });
                }

// 点放置
                let mass = new AMap.MassMarks(locationData, {
                    opacity: 0.8,
                    zIndex: 111,
                    cursor: "pointer",
                    style: style
                });

                let marker = new AMap.Marker({ content: " ", map: map });
                mass.on("mouseover", function(e) {
                    marker.setPosition(e.data.lnglat); //用户相对应的经纬度
                    marker.setLabel({ content: e.data.name }); //用户相对应的名字
                });

                mass.setMap(map);
            }
        },
        mounted() {
            this.MapInit();
        }
    }
</script>

<style scoped>
.map{
    height: 800px;width: 100%;
}
</style>