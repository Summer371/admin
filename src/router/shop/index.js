export default [
    {
        path:"/shopType",
        name:"shopType",
        component:()=>import("@/views/shop/ShopType"),
        meta:{
            isAuthorization:true
        }
    },
    {
        path: "/shop",
        name: "shop",
        component: () => import("@/views/shop/Shop"),
        meta:{
            isAuthorization:true
        }
    },
    {
        path: "/shopList",
        name: "shopList",
        component: () => import("@/views/shop/ShopList"),
        meta:{
            isAuthorization:true
        }
    }
]