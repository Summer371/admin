import Vue from 'vue';
import Vuex from 'vuex';
import admin from "./admin";
import  shop from "./shop";
import goods from "./goods";
import axios from "axios";
Vue.use(Vuex);

const modules = {
    admin,
    shop,
    goods
}
const state = {
    loading:false,
    pageInfo:{
        pageIndex:1,
        pageSum:1
    }
};
const mutations = {
    CHANGE_LOADING(state,bol){
        state.loading = bol;
    },
    CHANGE_PAGE_INFO(state,pageInfo){
        state.pageInfo.pageIndex = pageInfo.pageIndex;
        state.pageInfo.pageSum = pageInfo.pageSum;
    }
};
const actions={
    adminHandle(content,data={}){
        const {type,adminName,msg}=data;
        axios.post("/adminHandle",{
            type,adminName,msg
        })
    }
}
export default new Vuex.Store({
    state,
    mutations,
    modules,
    actions
})
