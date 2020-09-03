module.exports={
    devServer:{
        open:false,
        port:8081,
        host:"localhost",
        proxy:{
            "^/ele":{
                target:"http://47.98.238.74:8088",
                changeOrigin:true,
                pathRewrite:{
                    "^/ele":""
                }
            },
            "^/wx":{
                target:"http://47.98.238.74:8081",
                changeOrigin:true,
                pathRewrite:{
                    "^/wx":""
                }
            },
        }
    },
    configureWebpack(config) {
        // ...

        config.externals = {
            'AMap': 'AMap' // 高德地图配置
        }
    }
}