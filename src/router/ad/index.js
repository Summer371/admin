export default [
    {
        path:"/adType",
        name:"adType",
        component:()=>import("@/views/ad/adType"),
        meta:{
            isAuthorization:true
        }
    },
    {
        path: "/ad",
        name: "ad",
        component: () => import("@/views/ad/ad"),
        meta:{
            isAuthorization:true
        }
    }
]