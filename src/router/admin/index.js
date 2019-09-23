export default [
    {
        path:"/adminLog",
        name:"adminLog",
        alias:"/",
        component:()=>import("@/views/admin/AdminLog"),
        meta:{
            isAuthorization:true
        }
    },
    {
        path: "/singn",
        name: "singn",
        component: () => import("@/views/admin/singn"),
        meta:{
            isAuthorization:true
        }
    },
    {
        path: "/check",
        name: "check",
        component: () => import("@/views/admin/Check"),
        meta:{
            isAuthorization:true
        }
    }

]