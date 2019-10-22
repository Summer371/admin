module.exports={
    devServer:{
        open:true,
        port:8080,
        host:"127.0.0.1",
        proxy:{
            "^/ele":{
                target:"http://47.98.238.74:8088",
                changeOrigin:true,
                pathRewrite:{
                    "^/ele":""
                }
            }
        }
    }
}