module.exports={
    devServer:{
        open:true,
        port:8080,
        host:"localhost",
        proxy:{
            "^/ele":{
                target:"http://localhost:8088",
                changeOrigin:true,
                pathRewrite:{
                    "^/ele":""
                }
            }
        }
    },
    configureWebpack(config) {
        // ...

        config.externals = {
            'AMap': 'AMap' // 高德地图配置
        }
    }
}