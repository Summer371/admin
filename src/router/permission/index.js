export default [
    {
        path: "/menus",
        name: "menus",
        component: () => import("@/views/permission/menu"),
        meta:{
            isAuthorization:true
        }
    }
]