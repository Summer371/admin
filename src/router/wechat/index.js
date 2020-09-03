export default [
    {
        path:"/media",
        name:"media",
        component:()=>import("@/views/wechat/media"),
        meta:{
            isAuthorization:true
        }
    },
]