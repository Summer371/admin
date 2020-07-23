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
        }).then(()=>{
            this.dispatch("getShopTypeList")
        })
    },
    delShop(content,id){
        axios.delete("/shop",{
            params:{
                id
            }
        }).then(()=>{
            this.dispatch("getShop")
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