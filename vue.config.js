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
            },
            "^/wx":{
                target:"http://47.98.238.74:8081",
                changeOrigin:true,
                pathRewrite:{
                    "^/wx":""
                }
            },
            '/socket.io': {
                target: 'http://127.0.0.1:3000', // target host
                changeOrigin: true, // needed for virtual hosted sites
                ws: true
            },
            'sockjs-node': {
                target: 'http://127.0.0.1:3000',
                ws: false,
                changeOrigin: true
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