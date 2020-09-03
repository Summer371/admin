import Vue from 'vue'
import Router from 'vue-router'

import admin from "./admin"
import shop from "./shop"
import goods from "./goods"
import ad from "./ad";
import file from "./file";
import wechat from "./wechat";
import permission from "./permission"
Vue.use(Router)
const router=new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        ...admin,
        ...shop,
        ...goods,
        ...ad,
        ...file,
        ...wechat,
        ...permission
    ]
})

/*router.beforeEach((to,from,next)=>{
    if(to.meta.isAuthorization){
        if(localStorage.token){
            next();
        }else{
            store.commit("OUT_LOGIN")
        }
    }else{
        next();
    }
})*/
export default router;
