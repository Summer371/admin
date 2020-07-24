import  axios from "axios";

const state={
    shopTypeList:[],
    shopList:[],
    allShopTypeList:[]
};
const actions={
    async getShopTypeList({commit},data={}){
        const {pageIndex=1,keyWord=""}=data;
        const {shopTypeList} =await axios.get("/shopTypeList",{
            params:{
                pageIndex,keyWord
            }
        });
            commit("GET_SHOP_TYPE_LIST",shopTypeList.shopTypeList);
            commit("CHANGE_PAGE_INFO",shopTypeList);
    },
    async getAllShopTypeList({commit},data={}){
        const {keyWord=""}=data;
        const {shopTypeList} =await axios.get("/allShopTypeList",{
            params:{
                keyWord
            }
        });
        commit("GET_ALL_SHOP_TYPE_LIST",shopTypeList);
    },
    async getShop({commit},data={}){
        const {pageIndex=1,keyWord="",type=""}=data;
        const {shopList} =await axios.get("/shop",{
            params:{
                pageIndex,keyWord,type
            }
        });
        commit("GET_SHOP",shopList.shopList);
        commit("CHANGE_PAGE_INFO",shopList);
    },
    delShopTypeList(content,id){
        axios.delete("/shopTypeList",{
            params:{
                id
            }
        }).then((data)=>{
            if(data.ok==1){
                this.dispatch("getShopTypeList");
                this.dispatch("adminHandle",{type:"删除店铺类别",adminName:localStorage.adminName,msg:data.msg});
                this._vm.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }else{
                this._vm.$message({
                    type: 'error',
                    message: '删除失败!'
                });
            }

        })
    },
    delShop(content,id){
        axios.delete("/shop",{
            params:{
                id
            }
        }).then((data)=>{
            if(data.ok==1){
                this.dispatch("getShop")
                this.dispatch("adminHandle",{type:"删除店铺",adminName:localStorage.adminName,msg:data.msg});
                this._vm.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }else{
                this._vm.$message({
                    type: 'error',
                    message: '删除失败!'
                });
            }
        })
    }
};



const mutations={
    GET_SHOP_TYPE_LIST(stage,shopTypeList){
        stage.shopTypeList=shopTypeList;
    },
    GET_SHOP(state,shopList){
        state.shopList=shopList;
    },
    GET_ALL_SHOP_TYPE_LIST(stage,shopTypeList){
        stage.allShopTypeList=shopTypeList;
    }
};



export default {
    actions,
    state,
    mutations
}