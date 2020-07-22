const filters ={
    currency(v,n=2){
        return "$"+v.toFixed(n);
    },
        date(v){
            if(v==undefined){
                return "无"
            }
            const time = new Date(v);
            return time.getFullYear()+"-"+
                (time.getMonth()+1).toString().padStart(2,"0")+"-"+
                (time.getDate()).toString().padStart(2,"0")
    },
    time(v){
        if(v==undefined){
            return "无"
        }
        const time = new Date(v);
        return time.getFullYear()+"-"+
            (time.getMonth()+1).toString().padStart(2,"0")+"-"+
            (time.getDate()).toString().padStart(2,"0")+" "+
            (time.getHours()).toString().padStart(2,"0")+":"+
            (time.getMinutes()).toString().padStart(2,"0")+":"+
            (time.getSeconds()).toString().padStart(2,"0");
    },
    permissions(v){
        if(v=="0"){
            return "全部"
        }else if(v=="1"){
            return "管理"
        }else if(v=="2"){
            return "用户"
        }else if(v=="" || v==undefined){
            return "暂无权限"
        }
    }
}
export  default {
    install(Vue){
        for(let key in filters){
            Vue.filter(key,filters[key])
        }
    }
}