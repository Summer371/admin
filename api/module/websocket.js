
module.exports=()=>{
    var ws = require("nodejs-websocket");
    console.log("websocket开始建立连接...")
    var game1 = null,game2 = null , game1Ready = false , game2Ready = false;
    var server = ws.createServer(function(con){
        con.on("text", function (str) {
            console.log("收到的信息为:"+str)
            con.sendText(str)
        })
        con.on("close", function (code, reason) {
            console.log("关闭连接")
        });
        con.on("error", function (code, reason) {
            console.log("异常关闭")
        });
    }).listen(8089)
    console.log("WebSocket建立完毕")
}
