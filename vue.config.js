module.exports={
    devServer:{
        open:true,
        port:3000,
        host:"localhost",
        proxy:{
            "^/ele":{
                target:"http://localhost:8088",
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
        },
        disableHostCheck: true
    },
    configureWebpack(config) {
        // ...

        config.externals = {
            'AMap': 'AMap' // 高德地图配置
        }
    }
}