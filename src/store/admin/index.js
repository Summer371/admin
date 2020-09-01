import axios from "axios";
import { Message } from 'element-ui';
const state = {
    adminName:localStorage.adminName,
    token:localStorage.token,
    adminLog:[],
    ip:returnCitySN["cip"]?returnCitySN["cip"]:'',
    permissions:"",
    locationInfo:{}
};
const mutations={
    CHANGE_ADMIN_TOKEN(state,{adminName,token,permissions}){
        state.token=localStorage.token=token;
        state.adminName=localStorage.adminName=adminName;
        state.permissions=localStorage.permissions=permissions;
    },
    OUT_LOGIN(state){
        localStorage.clear();
        state.adminName=state.token=null;
        /*Message({
            type:"success",
            message:"退出成功",
            center:false
        })*/
    },
    GET_LOG(stage,adminLog){
        state.adminLog = adminLog;
    },
    GET_LOCATION(state,location){
        state.locationInfo=location
    }
};
const actions={
    adminLogin(content,{adminInfo}){
        return new Promise(async (resolve,reject)=>{
            const data= await axios.post("/adminLogin",adminInfo);
            if(data.ok===1){
                content.commit("CHANGE_ADMIN_TOKEN",data);
                resolve(data)
            }else{
                reject(data)
            }
        })
    },
    async adminLog(content,data={}){
        const {pageIndex}=data;
        const results =await axios.get("/adminLog",{
            params:{
                pageIndex
            }
        });
        content.commit("GET_LOG",results.adminLog);
        content.commit("CHANGE_PAGE_INFO",results);
    },
    adminLogDel(content,id){
        axios.delete("/adminLog",{
            params:{id}
        }).then((data)=>{
            if(data.ok==1){
                this.dispatch("adminLog");
                this.dispatch("adminHandle",{type:"删除管理员登陆日志",adminName:localStorage.adminName,msg:data.msg});
            }else{
                this._vm.$message.error(data.msg);
                this.dispatch("adminHandle",{type:"删除管理员登陆日志",adminName:localStorage.adminName,msg:data.msg});
            }

        })
    },
    getLocation({commit}){
        var map,geolocation;
        map = new AMap.Map('container', {
            resizeEnable: true
        });
        let _this=this;
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
            AMap.event.addListener(geolocation, 'complete',_this.dispatch("onComplete")); //返回定位信息
            AMap.event.addListener(geolocation, 'error', _this.dispatch("onError")); //返回定位出错信息
        });
    },
    onComplete({commit},data){
            commit("GET_LOCATION",data)
        console.log(data)
    },
    onError({commit},data){
        console.log(data)
    }
}
export default {
    actions,
    state,
    mutations
}