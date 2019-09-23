import Vue from 'vue'
import Router from 'vue-router'

import admin from "./admin"
import shop from "./shop"
import goods from "./goods"
Vue.use(Router)
const router=new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        ...admin,
        ...shop,
        ...goods,
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
