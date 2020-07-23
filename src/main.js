import Vue from 'vue'
import App from './App.vue'
import Login from './Login.vue'
import router from './router/'
import store from './store/'
import  ElementUI from"element-ui"
import 'element-ui/lib/theme-chalk/index.css';
import  axios from "axios"
import filter from "@/filters"
import components from "@/components"

Vue.prototype.$axios=axios;

Vue.use(ElementUI);
Vue.use(filter);
Vue.use(components);

//请求拦截
axios.interceptors.request.use(config=>{
    if(localStorage.token){
        config.headers={
            authorization:localStorage.token,
            permissions:localStorage.permissions || store.admin.permissions
        }
    }
    store.commit("CHANGE_LOADING",true);
    config.url = "/ele"+config.url;
    return config;
})
//响应拦截
axios.interceptors.response.use(({data})=>{
    store.commit("CHANGE_LOADING",false);
    if(data.ok === 2 || data.ok === 3){
        store.commit("OUT_LOGIN");
    }else{
        return data;
    }
});

router.beforeEach((to,from,next)=>{
    if(to.meta.isAuthorization){
        if(localStorage.token){
            next();
        }else{
            store.commit("OUT_LOGIN")
        }
    }else{
        next();
    }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(store.state.admin.token?App:Login)
}).$mount('#app');