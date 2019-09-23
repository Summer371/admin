const filters ={
    currency(v,n=2){
        return "$"+v.toFixed(n);
    },
        date(v){
            const time = new Date(v);
            return time.getFullYear()+"-"+
                (time.getMonth()+1).toString().padStart(2,"0")+"-"+
                (time.getDate()).toString().padStart(2,"0")+" "+
                (time.getHours()).toString().padStart(2,"0")+":"+
                (time.getMinutes()).toString().padStart(2,"0")+":"+
                (time.getSeconds()).toString().padStart(2,"0");
    }
}
export  default {
    install(Vue){
        for(let key in filters){
            Vue.filter(key,filters[key])
        }
    }
}