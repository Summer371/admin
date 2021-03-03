const md5 = require("md5");
const jwt = require("jwt-simple");
const key = "*&)(*&(*&(*&";
const request=require("request")
module.exports.getNowTime = function() {
    const data = new Date();
    return data.getFullYear()+"-"+
        (data.getMonth()+1).toString().padStart(2,"0")+"-"+
        (data.getDate()).toString().padStart(2,"0")+" "+
        (data.getHours()).toString().padStart(2,"0")+":"+
        (data.getMinutes()).toString().padStart(2,"0")+":"+
        (data.getSeconds()).toString().padStart(2,"0");
}
// res响应对象
module.exports.json = function (res,ok=-1,msg="网络连接错误") {
    res.json({
        ok,
        msg
    })
}

module.exports.md5 = function (context) {
    const str = "ele.com(*&^(*&^(*&";
    return md5(context+str);
}

// 解密 token
module.exports.deToken =function (token) {
    try{
        const info = jwt.decode(token,key);
        if(info.lastTime > Date.now()){
            return {
                ok:1,
                msg:"正常",
                adminName:info.adminName
            }
        }else{
            return {
                ok:3,
                msg:"toke过期"
            }
        }
    }catch (err){
        return {
            ok:2,// 异常
            msg:"token异常"
        }
    }
}
// 生成token
module.exports.enToken = function (payload) {
    return jwt.encode({
        ...payload,
        ...{
            lastTime:Date.now()+60*1000*30
        }
    },key)
}

module.exports.dePermissions1=function(permissions){
    try{
        if(permissions=="02" || permissions=="01"){
            return {
                ok:1,// 正常
                msg:"权限正常"
            }
        }else{
            return {
                ok:-1,//
                msg:"没有权限"
            }
        }
    }catch (err){
        return {
            ok:0,// 异常
            msg:"权限异常"
        }
    }
}
module.exports.dePermissions2=function(permissions){
    try{
        if(permissions=="02" ){
            return {
                ok:1,// 正常
                msg:"权限正常"
            }
        }else{
            return {
                ok:-1,//
                msg:"没有权限"
            }
        }
    }catch (err){
        return {
            ok:0,// 异常
            msg:"权限异常"
        }
    }
}
module.exports.getRandomNum=function(max,min){
    return Math.floor(Math.random()*(max-min+1)+min);
}
module.exports.sendCode = function (mobile,randomNum) {
    let url = "http://v.juhe.cn/sms/send";
    const params = {
        mobile,
        tpl_id: "164480987098773",
        tpl_value: "#code#=" + randomNum,
        key: "b3549c4531c035d2f2048"
    }
    url = url + "?" + querystring.stringify(params);
    request(url, function (err, response, body) {
        if (!err && response.statusCode === 200) {
            console.log("success");
        } else {
            console.log("error");
        }
    })
}