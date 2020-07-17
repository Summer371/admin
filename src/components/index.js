
const components = {
    Pagination:()=>import("@/components/common/Pagination"),
    AddShopType:()=>import("@/components/dialog/AddShopType"),
    AddShop:()=>import("@/components/dialog/AddShop"),
    AddGoodsType:()=>import("@/components/dialog/AddGoodsType"),
    AddGoods:()=>import("@/components/dialog/AddGoods"),
    AddAd:()=>import("@/components/dialog/AddAd"),
    AddAdType:()=>import("@/components/dialog/AddAdType")
}
export default {
    install(Vue){
        for(let key in components){
            Vue.component(key,components[key]);
        }
    }
}