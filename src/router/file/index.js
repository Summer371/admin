export default[
    {
        path:"/saveFile",
        name:"saveFile",
        component:()=>import("@/views/file/saveFile"),
        meta:{
            isAuthorization:true
        }
    },
]