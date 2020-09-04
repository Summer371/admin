export default [
    {
        path:"/media",
        name:"media",
        component:()=>import("@/views/wechat/media"),
        meta:{
            isAuthorization:true
        }
    },
    {
        path:"/goEasy",
        name:"goEasy",
        component:()=>import("@/views/wechat/goEasy"),
        meta:{
            isAuthorization:true
        }
    },
]