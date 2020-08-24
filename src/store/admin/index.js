import axios from "axios";
import { Message } from 'element-ui';
const state = {
    adminName:localStorage.adminName,
    token:localStorage.token,
    adminLog:[],
    ip:returnCitySN["cip"] || '',
    permissions:""
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
        Message.error("登录超时，已退出登录")
    },
    GET_LOG(stage,adminLog){
        state.adminLog = adminLog;
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
    }
}
export default {
    actions,
    state,
    mutations
}