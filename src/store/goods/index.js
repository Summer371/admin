import axios from "axios"

const state={
    thisTypeShopList:[],
    goodsTypeList:[],
    thisTypeGoodsList:[],
    goodsList:[],
    allGoodsTypeList:[]
}

const actions={
    getThisShop({commit},{shopTypeId}){
        axios.get("/thisTypeShop",{
            params:{
                shopTypeId
            }
        }).then(({thisTypeShopList})=>{
            commit("CHANGE_THIS_TYPE_SHOP_LIST",thisTypeShopList)
        })
    },
    getThisTypeGoods({commit},{shopId}){
        axios.get("/thisTypeGoods",{
            params:{
                shopId
            }
        }).then(({thisTypeGoodsList})=>{
            commit("CHANGE_THIS_TYPE_GOODS_LIST",thisTypeGoodsList)
        })
    },
    getAllTypeGoods({commit}){
        axios.get("/allGoodsTypeList",{
        }).then(({AllTypeGoodsList})=>{
            commit("CHANGE_ALL_TYPE_GOODS_LIST",AllTypeGoodsList)
        })
    },
    async getGoodsList({commit},data={}){
        const {pageIndex=1,keyWord="",type=""}=data;
        const {goodsList} =await axios.get("/goodsList",{
            params:{
                pageIndex,keyWord,type
            }
        });
        commit("GET_GOODS_LIST",goodsList.goodsList);
        commit("CHANGE_PAGE_INFO",goodsList);
    },
    async getGoodsType({commit},data={}){
        const {pageIndex=1,keyWord=""}=data;
        const {goodsTypeList} =await axios.get("/goodsTypeList",{
            params:{
                pageIndex,keyWord
            }
        });
        commit("GET_GOODS_TYPE_LIST",goodsTypeList.goodsTypeList);
        commit("CHANGE_PAGE_INFO",goodsTypeList);
    },
    delGoodsType(content,id){
        axios.delete("/goodsType",{
            params:{
                id
            }
        }).then(()=>{
            this.dispatch("getGoodsType");
        })
    },
    delGoods(content,id){
    axios.delete("/goods",{
        params:{
            id
        }
    }).then((data)=>{
        if(data.ok==1){
            this.dispatch("getGoodsList");
            this.dispatch("adminHandle",{type:"删除商品",adminName:localStorage.adminName,msg:data.msg});
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
    CHANGE_THIS_TYPE_SHOP_LIST(state,thisTypeShopList){
        state.thisTypeShopList=thisTypeShopList
    },
    GET_GOODS_TYPE_LIST(state,goodsTypeList){
        state.goodsTypeList=goodsTypeList
    },
    CHANGE_THIS_TYPE_GOODS_LIST(state,thisTypeGoodsList){
    state.thisTypeGoodsList=thisTypeGoodsList;
    },
    GET_GOODS_LIST(state,goodsList){
        state.goodsList=goodsList;
    },
    CHANGE_ALL_TYPE_GOODS_LIST(state,allGoodsTypeList){
        state.allGoodsTypeList=allGoodsTypeList;
    }
}




export default {
    state,
    actions,
    mutations
}