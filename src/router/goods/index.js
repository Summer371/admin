export default [
    {
        path:"/goodsType",
        name:"goodsType",
        component:()=>import("@/views/goods/GoodsType"),
        meta:{
            isAuthorization:true
        }
    },
    {
        path: "/goods",
        name: "goods",
        component: () => import("@/views/goods/Goods"),
        meta:{
            isAuthorization:true
        }
    },
    {
        path: "/goodsList",
        name: "goodsList",
        component: () => import("@/views/goods/GoodsList"),
        meta: {
            isAuthorization: true
        }
    }
]