import {Message} from "element-ui"

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
        },
        beforeEnter: (to, from, next) => {
            if(localStorage.permissions!=="02"){
                Message.error("您暂时无权访问")
                return
            }
            next();
        }
    },
    {
        path: "/check",
        name: "check",
        component: () => import("@/views/admin/Check"),
        meta:{
            isAuthorization:true
        },
        beforeEnter: (to, from, next) => {
            if(localStorage.permissions!=="02"){
                return
            }
            next();
        }
    },
    {
        path: "/adminList",
        name: "adminList",
        component: () => import("@/views/admin/adminList"),
        meta:{
            isAuthorization:true,
            permissions:true
        }
    },
    {
        path: "/location",
        name: "location",
        component: () => import("@/views/admin/location"),
        meta:{
            isAuthorization:true,
            permissions:true
        }
    },
    {
        path: "/userList",
        name: "userList",
        component: () => import("@/views/admin/userList"),
        meta:{
            isAuthorization:true,
            permissions:true
        }
    }

]