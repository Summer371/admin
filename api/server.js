const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const db = require("./module/db");
const tools = require("./module/tools");
const fs=require("fs");
const mongodb = require("mongodb");
const formidable = require("formidable");
const {upPic} = require("./module/upPic");
app.use(bodyParser.json());
app.use(express.static(__dirname+"/upload"));
//*********************后台*****************************
app.all("*",function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","*");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200);  //让options尝试请求快速结束
    else {
        next();
    }
});

//登陆注册
app.post("/adminLogin",function (req,res) {
    const {adminName,passWord,ip,location}= req.body;
    db.findOne("adminList",{
        adminName,
        passWord:tools.md5(passWord)
    }).then(async(adminInfo)=>{
        if(adminInfo){
            await db.updateOne("adminList",{
                _id:adminInfo._id
            },{
                $set:{
                    loginTime:Date.now()
                }
            });
            await db.insertOne("adminLog",{
                adminId:adminInfo._id,
                adminName:adminInfo.adminName,
                ip,location,
                createTime:Date.now()
            });
            const token=tools.enToken({
                    adminName
                });
            res.json({
                ok:1,
                adminName,
                token,
                permissions:adminInfo.permissions
            })
        }else{
            tools.json(res,-1,"管理员账号或密码错误")
        }
    }).catch((e)=>{
        console.log(e)
        tools.json(res);
    })
});
app.post("/adminSign", function (req,res) {
    const {adminInfo,creator}= req.body;
    const adminName=adminInfo.adminName;
    const passWord=tools.md5(adminInfo.passWord);
    db.findOne("adminList",{
        adminName
    }).then(data=>{
        if(data){
            res.json({
                ok:-1,
                msg:"账号已注册"
            });
        }else{
            db.insertOne("adminList",{
                adminName,
                passWord,
                creator,
                signTime:Date.now()
            });
            res.json({
                ok:1,
                msg:"注册成功"
            })
        }
    })
});

//********************app登录***************
app.post("/sendCode",async function (req,res) {
    const phoneId=req.body.phoneId;
    const codeInfo = await  db.findOne("phoneCode",{phoneId});
    let code=tools.getRandomNum(100000,999999);
    if(codeInfo){
        if((Date.now()-codeInfo.addTime)/1000>60){
            await db.updateOne("phoneCode",{phoneId},{
                $set:{
                    code,
                    addTime:Date.now()
                }
            });
            res.json({
                ok:1,
                msg:"成功",
                code
            })
        }else{
            res.json({
                ok:-1,
                msg:"请稍后再发"
            })
        }
    }else{
        db.insertOne("phoneCode",{
            phoneId,
            code,
            addtime:Date.now()
        }).then(()=>{
            res.json({
                ok:1,
                msg:"成功",
                code
            })
        })
    }
});

app.post("/userSingn1",function (req,res) {
    const {phoneId,code}=req.body;
    if(phoneId=="" || code==""){
        res.json({
            ok:-1,
            msg:"手机号或密码不能为空"
        })
        return
    }
    db.findOne("phoneCode",{phoneId,code}).then(data=>{
        if(data){
            db.insertOne("userList",{
                phoneId,
                passWord:tools.md5("123456")
            }).then(()=>{
                res.json({
                    ok:1,
                    msg:"注册成功,默认密码123456",
                    token:tools.enToken({
                                phoneId
                            })
                        })
                    })
        }else{
            res.json({
                ok:-1,
                msg:"手机号已注册"
            })
        }
    })
});
app.post("/userLogin",async (req,res)=>{
    const {phoneId,passWord}=req.body;
    const info =await db.findOne("userList",{
        phoneId,
        passWord:tools.md5(passWord)
    });
    if(info){
        res.json({
            ok:1,
            msg:"登录成功",
            phoneId,
            token:tools.enToken(phoneId)
        })
    }else{
        res.json({
            ok:-1,
            msg:"账号或密码错误"
        })
    }
});
app.get("/userSingn2",async (req,res)=>{
    const {phoneId,passWord}=req.query;
    const info =await db.insertOne("userList",{
        phoneId,
        passWord:tools.md5(passWord),
        createTime:Date.now()
    });
    if(info){
        res.json({
            ok:1,
            msg:"注册成功"
        })
    }else{
        res.json({
            ok:-1,
            msg:"注册失败"
        })
    }
});



//*************************app接口*****************


app.get("/searchShopList",async function (req,res) {
    const whereObj={};
    const keyWord=req.query.keyWord || '';
    if(keyWord.length>0){
        whereObj.shopName=new RegExp(keyWord);
        const shopList=await db.find("shopList",{whereObj});
        res.json({
            ok:1,
            shopList
        })
    }else{
        res.json({
            ok:1,
            shopList:[]
        })
    }
});


app.get("/recommendShopList",async function (req,res) {
    const recommendShopList=await db.getPageInfo("shopList",{
        pageIndex:(req.query.pageIndex || 1)/1,
        sort:{"shopPic":-1},
        resultsName:"recommendShopList",
        limit:8,
        whereObj:{isRecommend:"true"}
    });
    setTimeout(()=>{
        res.json(recommendShopList)
    },1000);
});

app.get("/tabs_shopType",async (req,res)=>{
    const result =await db.find("shopTypeList",{});
    res.json({
        ok:1,
        data:result
    })
});

//
app.get("/tabs_goodsType",async (req,res)=>{
    const {id}=req.query;
    const result =await db.find("goodsTypeList",{
        whereObj:{
            shopTypeId:mongodb.ObjectId(id)
        }
    });
    res.json({
        ok:1,
        data:result
    })
});

app.get("/tabs_goods",async (req,res)=>{
    const {id}=req.query;
    const result =await db.find("goodsList",{
        whereObj:{
            goodsTypeId:mongodb.ObjectId(id)
        }

    });
    res.json({
        ok:1,
        data:result
    })
});
app.get("/swiperShopType",async function (req,res) {
    const limit=(req.query.limit)/1;
    const data=await db.find("shopTypeList",{
        limit,
        sort:{
            shopTypePic:-1
        }
    });
    const shopTypeList  = [];
    const n = Math.ceil(data.length/10);
    const m=10;
    for(let i=0;i<n;i++){
        shopTypeList.push([]);
        for(let j=i*m;j<((1+i)*m>data.length?data.length:(1+i)*m);j++){
            shopTypeList[i].push(data[j])
        }
    }
    res.json({
        ok:1,
        shopTypeList
    })
});


app.get("/getShopByTypeId/:shopTypeId",async function (req,res) {
    const shopTypeId=req.params.shopTypeId;
    const thisTypeShopList =await db.find("shopList",{
        whereObj:{
            shopTypeId:mongodb.ObjectId(shopTypeId)
        }
    });
    res.json({
        thisTypeShopList
    })
});




////////////*********************后台管理系统**************************



app.all("*",function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else {
        const {ok,msg}=tools.deToken(req.headers.authorization);
        if(ok==1){
            next();
        }else{
            res.json({
                ok,msg
            })
        }
    }
});
//管理员登录日志
app.get("/adminLog",async function (req,res) {
    let pageIndex=(req.query.pageIndex || 1)/1;
    const count=await db.count("adminLog",{});
    const pageSize=10;
    let pageSum = Math.ceil(count / pageSize);
    if (pageSum < 1) pageSum = 1;
    if (pageIndex < 1) pageIndex = 1;
    if (pageIndex > pageSum) pageIndex = pageSum;
    const adminLog=await db.find("adminLog",{
        skip: (pageIndex - 1) * pageSize,
        limit: pageSize,
        sort:{
            createTime:-1
        }
    });
        res.json({
        ok:1,
        adminLog,
        pageSum,
        pageIndex,
        count
    })

});
//管理员操作日志
app.post("/adminHandle",function (req,res) {
    const {type,adminName,msg}=req.body;
    db.insertOne("adminHandle",{
        type,adminName,msg,
        handleTime:Date.now()
    }).then(()=>{
        res.json({
            ok:1,
            msg:"操作成功"
        })
    })
});
app.get("/check",async function (req,res) {
    const {pageIndex}=req.query;
    const data=await db.getPageInfo("adminHandle",{
        sort:{
            handleTime:-1
        },
        pageIndex
    });
    res.json({
        ok:1,
        data
    })
});
//管理员列表
app.get("/adminList",async (req,res)=>{
        const adminList=await db.find("adminList",{});
        res.json({
            ok:1,
            msg:"管理员列表",
            adminList
        })
});
//店铺类型
app.post("/shopType",async function (req,res) {
        const {newPicName,params} = await upPic(req,"shopTypePic");
        const result=await db.findOne("shopTypeList",{ shopType:params.shopType});
        if(result){
            fs.unlink(__dirname+"/upload/"+newPicName, function (err) {
                if(err){
                    res.json({
                        ok:-1,
                        msg:"删除失败"
                    })
                }else{
                    res.json({
                        ok:1,
                        msg:"删除成功"
                    })
                }
            });
            res.json({
                ok:-1,
                msg:"店铺类别已存在"
            })
        }else{
            db.insertOne("shopTypeList",{
                shopTypePic:newPicName,
                shopType:params.shopType,
                createTime:Date.now()
            }).then(()=>{
                res.json({
                    ok:1,
                    msg:"添加成功"
                })
            }).catch(()=>{
                res.json({
                    ok:-1,
                    msg:"添加失败"
                })
            })
        }

});
app.get("/shopTypeList",async function (req,res) {
    const whereObj={};
    if(req.query.keyWord.length>0){
        whereObj.shopType=new RegExp(req.query.keyWord);
    }
    const shopTypeList=await db.getPageInfo("shopTypeList",{
        pageIndex:(req.query.pageIndex || 1)/1,
        sort:{"createTime":-1},
        resultsName:"shopTypeList",
        whereObj,limit:5
    });
    res.json({
        ok:1,
        shopTypeList
    })
});
app.get("/allShopTypeList",async function (req,res) {
   const shopTypeList=await db.find("shopTypeList",{
       sort:{"createTime":-1}
   });
    res.json({
        ok:1,
        shopTypeList
    })
});
//店铺
app.post("/shop",async function (req,res) {
    const {newPicName,params} = await upPic(req,"shopPic");
    const result=await db.findOne("shopList",{ shopName:params.shopName});
    if(result){
        fs.unlink(__dirname+"/upload/"+newPicName, function (err) {

        })
        res.json({
            ok:-1,
            msg:"店铺类别已存在"
        })
    }else{
        const shopTypeInfo = await db.findOneById("shopTypeList",params.shopTypeId);
        db.insertOne("shopList",{
            shopPic:newPicName,
            shopType:shopTypeInfo.shopType,
            shopTypeId:shopTypeInfo._id,
            shopName:params.shopName,
            isRecommend:params.isRecommend,
            createTime:Date.now()
        }).then(()=>{
            res.json({
                ok:1,
                msg:"上传成功"
            })
        })
    }

});
app.post("/updateShop",async function (req,res) {
    const {newPicName,params} = await upPic(req,"shopPic");
    const shopTypeInfo = await db.findOneById("shopTypeList",params.shopTypeId);
    db.updateOneById("shopList",params.updateId,{
        $set:{
        shopPic:newPicName,
        shopType:shopTypeInfo.shopType,
        shopTypeId:shopTypeInfo._id,
        shopName:params.shopName,
        isRecommend:params.isRecommend,
        createTime:Date.now()}
    }).then(()=>{
        res.json({
            ok:1,
            msg:"上传成功"
        })
    })
});
app.get("/shop",async function (req,res) {
    const whereObj={};
    const {keyWord,type}=req.query;
    if(keyWord.length>0){
        whereObj.shopName=new RegExp(keyWord);
    }
    if(type.length>0){
        whereObj.shopType=new RegExp(type);
    }
    const shopList=await db.getPageInfo("shopList",{
        pageIndex:(req.query.pageIndex || 1)/1,
        sort:{createTime:-1},
        resultsName:"shopList",
        whereObj
    });
    res.json({
        ok:1,
        shopList
    })
});
app.get("/thisTypeShop",async function (req,res) {
    const shopTypeId=req.query.shopTypeId;
    const thisTypeShopList =await db.find("shopList",{
        whereObj:{
            shopTypeId:mongodb.ObjectId(shopTypeId)
        }
    });
    res.json({
        thisTypeShopList,
        ok:1
    })
});
//商品
app.post("/goodsType",async function (req,res) {
    const {goodsType,shopTypeId,isRecommend}=req.body;
    try{
        const data =await db.findOne("shopList",{
            shopTypeId:mongodb.ObjectId(shopTypeId)
        });
        db.insertOne("goodsTypeList",{
            goodsType,
            shopId:data._id,
            shopName:data.shopName,
            shopType:data.shopType,
            shopTypeId:data.shopTypeId,
            isRecommend,
            createTime:Date.now()
        }).then(()=>{
            res.json({
                ok:1,
                msg:"添加成功"
            })
        })
    }catch(err){
        res.json({
            ok:-1,
            msg:err
        })

    }

});
app.get("/goodsTypeList",async function (req,res) {
    const whereObj={};
    if(req.query.keyWord.length>0){
        whereObj.goodsType=new RegExp(req.query.keyWord);
    }
    const goodsTypeList=await db.getPageInfo("goodsTypeList",{
        pageIndex:(req.query.pageIndex || 1)/1,
        resultsName:"goodsTypeList",
        sort:{createTime:-1},
        whereObj
    });
    res.json({
        ok:1,
        goodsTypeList
    })
});
app.get("/allGoodsTypeList",async function (req,res) {
    const AllTypeGoodsList=await db.find("goodsTypeList",{
        sort:{createTime:-1}
    });
    const arr=[
        {
            goodsType:"全部",
            _id:""
        }
    ]
    res.json({
        ok:1,
        AllTypeGoodsList:[...AllTypeGoodsList,...arr]
    })
});
app.get("/thisTypeGoods",async function (req,res) {
    const shopId=req.query.shopId;
    const thisTypeGoodsList =await db.find("goodsTypeList",{
        whereObj:{
            shopId:mongodb.ObjectId(shopId)
        },
        sort:{
            createTime:-1
        }
    });
    res.json({
        thisTypeGoodsList,
        ok:1
    });
});
app.post("/goods",async function (req,res) {
    const {newPicName,params} = await upPic(req,"goodsPic");

   // const shopInfo=await db.findOneById("shopList",goodsTypeInfo.shopId);
    const result =await db.findOne("goodsList",{
        goodsName:params.goodsName,
        shopName:params.shopName
    });
    if(result){
        fs.unlink(__dirname+"/upload/"+newPicName, function (err) {
                console.log(err)
        })
        res.json({
            ok:-1,
            msg:"商品名已存在"
        });
    }else{
        const goodsTypeInfo = await db.findOneById("goodsTypeList",params.goodsTypeId);
        db.insertOne("goodsList",{
            goodsPic:newPicName,
            goodsName:params.goodsName,
            goodsType:goodsTypeInfo.goodsType,
            goodsTypeId:goodsTypeInfo._id,
            shopId:goodsTypeInfo.shopId,
            shopName:goodsTypeInfo.shopName,
            shopType:goodsTypeInfo.shopType,
            shopTypeId:goodsTypeInfo.shopTypeId,
            goodsOldPrice:params.goodsOldPrice,
            goodsNewPrice:params.goodsNewPrice,
            goodsNum:params.goodsNum,
            isRecommend:params.isRecommend,
            createTime:Date.now()
        }).then(()=>{
            res.json({
                ok:1,
                msg:"添加成功"
            })
        });

    }
});
app.post("/updateGoods",async function(req,res){
    const {newPicName,params} = await upPic(req,"goodsPic");
    const result =await db.find("goodsList",{
        goodsName:params.goodsName,
    });
    if(result){
        fs.unlink(__dirname+"/upload/"+newPicName, function (err) {
            console.log(err)
        })
        res.json({
            ok:-1,
            msg:"商品名已存在"
        });
    }else{
        const goodsInfo=await db.findOneById("goodsList",params.updateId);
        db.updateOneById("goodsList",params.updateId,{
            $set: {
                goodsPic: newPicName,
                goodsName: params.goodsName,
                goodsType: goodsInfo.shopType,
                goodsTypeId: goodsInfo.goodsTypeId,
                shopId: goodsInfo.shopId,
                shopName: goodsInfo.shopName,
                shopType: goodsInfo.shopType,
                shopTypeId: goodsInfo.shopTypeId,
                goodsOldPrice: params.goodsOldPrice,
                goodsNewPrice: params.goodsNewPrice,
                goodsNum: params.goodsNum,
                isRecommend: params.isRecommend,
                createTime: Date.now()
            }
        }).then(()=>{
            res.json({
                ok:1,
                msg:"修改成功"
            })
        })
    }
});
app.get("/goodsList",async function (req,res) {
    const whereObj={};
    const {keyWord,type}=req.query;
    if(keyWord.length>0){
        whereObj.goodsName=new RegExp(keyWord);
    }
    if(type.length>0){
        whereObj.goodsTypeId=type;
    }
    const goodsList=await db.getPageInfo("goodsList",{
        pageIndex:(req.query.pageIndex || 1)/1,
        sort:{createTime:-1},
        resultsName:"goodsList",
        whereObj
    });
    res.json({
        ok:1,
        goodsList
    })
});

//广告
app.post("/adType",async (req,res)=>{
    // const {newPicName,params} = await upPic(req,"adTypePic");
    const {adType,isRecommend}=req.body;
    const result=await db.findOne("adTypeList",{
        adType
    });
    if(result){
        res.json({
            ok:-1,
            msg:'广告类别已存在',
            result
        })
    }else{
        db.insertOne("adTypeList",{
            //  adTypePic:newPicName,
            adType,
            isRecommend,
            createTime:Date.now()
        }).then((data)=>{
            if(data){
                res.json({
                    ok:1,
                    msg:"添加成功"
                })
            }else{
                res.json({
                    ok:-1,
                    msg:"添加失败"
                })
            }
        })
    }
});
app.get("/adType",async (req,res)=> {
    const whereObj={};
    const keyWord=req.query.keyWord || "";
    if(keyWord.length>0){
        whereObj.adName=new RegExp(keyWord);
    }
    const data=await db.getPageInfo("adTypeList",{
        pageIndex:(req.query.pageIndex || 1)/1,
        sort:{createTime:-1},
        resultsName:"adTypeList",
        whereObj
    });
    res.json({
        ok:1,
        data
    })
});
app.get("/adTypeList",async (req,res)=> {
   const adTypeList=await db.find("adTypeList",{
       sort:{
           createTime:-1
       }
   });
    res.json({
        ok:1,
        adTypeList
    })
});
app.post("/advertisement",async (req,res)=>{
    const {newPicName,params} = await upPic(req,"adPic");
    const {adName,adTypeId,isRecommend,shopId}=params;
    const result=await db.findOne("adList",{
        adTypeId,
        adName
    });
    if(result){
        fs.unlink(__dirname+"/upload/"+newPicName, function (err) {
            console.log(err)
        })
        res.json({
            ok:-1,
            msg:'此广告已存在',
            result
        })

    }else{
        const shopInfo=await db.findOneById("shopList",shopId);
        const adTypeInfo=await db.findOneById("adTypeList",adTypeId);
        db.insertOne("adList",{
            adPic:newPicName,
            shopTypeId:shopInfo.shopTypeId,
            shopName:shopInfo.shopName,
            shopId:shopInfo.shopId,
            shopType:shopInfo.shopType,
            adType:adTypeInfo.adType,
            adTypeId,
            adName,
            isRecommend,
            createTime:Date.now()
        }).then((data)=>{
            if(data){
                res.json({
                    ok:1,
                    msg:"添加成功"
                })
            }else{
                res.json({
                    ok:-1,
                    msg:"添加失败"
                })
            }
        })
    }
});
app.get("/advertisement",async (req,res)=> {
    const whereObj={};
    const keyWord=req.query.keyWord || "";
    const type=req.query.type || "";
    if(keyWord.length>0){
        whereObj.adName=new RegExp(keyWord);
    }
    if(type.length>0){
        whereObj.adType=type;
    }
    const data=await db.getPageInfo("adList",{
        pageIndex:(req.query.pageIndex || 1)/1,
        sort:{createTime:-1},
        resultsName:"adList",
        whereObj
    });
    res.json({
        ok:1,
        data
    })
});


//添加位置信息
app.post("/Location",async (req,res)=>{
    const {newPicName,params} = await upPic(req,"headImg");
    const {userName,phone,lng,lat}=params;
    db.insertOne("locationList",{
        userName,
        phone,
        headImg:newPicName,
        lng,
        lat,
        createTime:Date.now()
    }).then((data)=>{
        if(data){
            res.json({
                ok:1,
                msg:userName+"位置信息添加成功"
            })
        }else{
            res.json({
                ok:-1,
                msg:"添加失败"
            })
        }
    })

});
app.get("/locationList",async (req,res)=>{
    const locationList=await db.find("locationList",{
        sort:{
            createTime:-1
        },
    });
    res.json({
        ok:1,
        locationList
    })

});

app.get("/locationSearch",async (req,res)=>{
    const {userName}=req.query;
    const whereObj={};
    whereObj.userName=new RegExp(userName);
    const locationList=await db.find("locationList",{
            whereObj
        }
        );
    res.json({
        ok:1,
        locationList
    })

});

app.all("*",function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","*");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else {
        const {ok,msg}=tools.dePermissions1(req.headers.permissions);
        if(ok==1){
            next();
        }else{
            res.json({
                ok,msg
            })
        }
    }
});

app.get('/allLocationList',async (req,res)=>{
    const whereObj={};
    const keyWord=req.query.keyWord || "";
    if(keyWord.length>0){
        whereObj.userName=new RegExp(keyWord);
    }
    const data=await db.getPageInfo("locationList",{
        pageIndex:(req.query.pageIndex || 1)/1,
        sort:{createTime:-1},
        resultsName:"locationList",
        whereObj
    });
    res.json({
        ok:1,
        data
    })

});


//删除
app.delete("/shopTypeList",async function (req,res) {
    const id=req.query.id;
    const info =await db.findOneById("shopTypeList",id);
    fs.unlink(__dirname+"/upload/"+info.shopTypePic,async function (err) {
        if(err){
            res.json({
                ok:-1,
                msg:"删除失败"
            })
        }else{
            await db.deleteOneById("shopTypeList",info._id).then((data)=>{
                res.json({
                    ok:1,
                    msg:"删除成功"
                });
            }).catch((err)=>res.json({ok:-1,msg:"删除失败"}));
        }
    })
});
app.delete("/shop",async function (req,res) {
    const id=req.query.id;
    const info =await db.findOneById("shopList",id);
    fs.unlink(__dirname+"/upload/"+info.shopPic,async function (err) {
        if(err){
            res.json({
                ok:-1,
                msg:"删除失败"
            })
        }else{
            await db.deleteOneById("shopList",info._id).then((data)=>{
                res.json({
                    ok:1,
                    msg:"删除成功"
                });
            }).catch((err)=>res.json({ok:-1,msg:"删1除失败"}));
        }
    })
});
app.delete("/goodsType",function (req,res) {
    const id=req.query.id;
    db.deleteOneById("goodsTypeList",id).then(()=>{
        res.json({
            ok:1,
            msg:"删除成功"
        });
    }).catch(()=>{
        res.json({
            ok:-1,
            msg:"删除失败"
        });
    })
});
app.delete("/goods",async function (req,res) {
    const id=req.query.id;
    const info =await db.findOneById("goodsList",id);
    try{
        fs.unlink(__dirname+"/upload/"+info.goodsPic,async function (err) {
            if(err){
                res.json({
                    ok:-1,
                    msg:"删除失败"
                })
            }else{
                await db.deleteOneById("goodsList",info._id).then((data)=>{
                    res.json({
                        ok:1,
                        msg:"删除成功"
                    });
                }).catch(()=>res.json({ok:-1,msg:"删除失败"}));
            }
        })
    }catch{
        res.json({
            ok:-1,
            msg:"删除失败"
        })
    }

});
app.delete("/adType",function (req,res) {
    const id=req.query.id;
    db.deleteOneById("adTypeList",id).then((data)=>{
        res.json({
            ok:1,
            msg:"删除成功"
        });
    }).catch(()=>{
        res.json({
            ok:-1,
            msg:"删除失败"
        });
    })
});
app.delete("/advertisement",async function (req,res) {
    const id=req.query.id;
    const info =await db.findOneById("adList",id);
    try{
        fs.unlink(__dirname+"/upload/"+info.adPic,async function (err) {
            if(err){
                res.json({
                    ok:-1,
                    msg:"删除失败"
                })
            }else{
                await db.deleteOneById("adList",info._id).then((data)=>{
                    res.json({
                        ok:1,
                        msg:"删除成功"
                    });
                }).catch(()=>res.json({ok:-1,msg:"删除失败"}));
            }
        })
    }catch{
        res.json({
            ok:-1,
            msg:"删除失败"
        })
    }

});

app.all("*",function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else {
        const {ok,msg}=tools.dePermissions2(req.headers.permissions);
        if(ok==1){
            next();
        }else{
            res.json({
                ok,msg
            })
        }
    }
});
//管理员权限
app.post("/permissions",async (req,res)=>{
    const {adminName,id,permissions}=req.body;
    db.updateOneById("adminList",id,{
        $set:{
            permissions,
            adminName
        }
    }).then(()=>{
        res.json({
            msg:"修改成功",
            ok:1
        })
    })
});
app.delete("/admin",async (req,res)=>{
    const {id}=req.query;
    db.deleteOneById("adminList",id).then(()=>{
        res.json({
            ok:1,
            msg:"删除成功"
        })
    })
});

app.delete("/userLocation",async (req,res)=>{
    const {id}=req.query;
    const info =await db.findOneById("locationList",id);
    try{
        fs.unlink(__dirname+"/upload/"+info.headImg,async function (err) {
            if(err){
                res.json({
                    ok:-1,
                    msg:"删除失败"
                })
            }else{
                db.deleteOneById("locationList",id).then(()=>{
                    res.json({
                        ok:1,
                        msg:"删除成功"
                    })
                }).catch(()=>res.json({ok:-1,msg:"删除失败"}));
            }
        })
    }catch{
        res.json({
            ok:-1,
            msg:"删除失败"
        })
    }

});

app.delete("/adminLog", function (req,res) {
    const id=req.query.id;
    db.deleteOneById("adminLog",id).then(()=>{
        res.json({
            ok:1,
            msg:"删除成功"
        })
    })
});
//*********************前端*************************************
app.listen(8088,function () {
    console.log("server start success on 8088")
});