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
                token
            })
        }else{
            tools.json(res,-1,"管理员账号或密码错误")
        }
    }).catch(()=>{
        tools.json(res);
    })
});
app.post("/adminSign", function (req,res) {
    const {adminInfo}= req.body;
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
                passWord
            });
            res.json({
                ok:1,
                msg:"注册成功"
            })
        }
    })
});
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
app.get("/searchShopList",async function (req,res) {
    const whereObj={};
    const keyWord=req.query.keyWord || '';
    if(req.query.keyWord.length>0){
        whereObj.shopName=new RegExp(req.query.keyWord);
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
app.get("/swiperShopType",async function (req,res) {
    const limit=req.query.limit/1;
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
    };
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
app.post("/userLogin",function (req,res) {
    const {phoneId,code}=req.body;
    db.findOne("phoneCode",{phoneId,code}).then(data=>{
        if(data){
                    db.insertOne("userList",{phoneId}).then(()=>{
                        res.json({
                            ok:1,
                            msg:"注册成功",
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
app.all("*",function (req,res,next) {
    const {ok,msg}=tools.deToken(req.headers.authorization);
    if(ok==1){
        next();
    }else{
        res.json({
            ok,msg
        })
    }
});
//管理员登录日志
app.get("/adminLog",async function (req,res) {
    let pageIndex=(req.query.pageIndex || 1)/1;
    const count=await db.count("adminLog",{});
    const pageSize=6;
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
    const {type,adminName}=req.body;
    db.insertOne("adminHandle",{
        type,adminName,
        handleTime:Date.now()
    }).then(()=>{
        res.json({
            ok:1,
            msg:"操作成功"
        })
    })
});
app.get("/check",async function (req,res) {
    const data=await db.find("adminHandle",{
        sort:{
            handleTime:-1
        }
    })
    res.json(data)
});
app.delete("/adminLog", function (req,res) {
    const id=req.query.id;
   db.deleteOneById("adminLog",id).then(data=>{
       res.json({
           ok:1,
           msg:"删除成功"
       })
   })
});
//店铺类型
app.post("/shopType",async function (req,res) {
    const {newPicName,params} = await upPic(req,"shopTypePic");
    db.insertOne("shopTypeList",{
        shopTypePic:newPicName,
        shopType:params.shopType
    });
    res.json({
        ok:1,
        msg:"上传成功"
    })
});
app.get("/shopTypeList",async function (req,res) {
    const whereObj={};
    if(req.query.keyWord.length>0){
        whereObj.shopType=new RegExp(req.query.keyWord);
    }
    const shopTypeList=await db.getPageInfo("shopTypeList",{
        pageIndex:(req.query.pageIndex || 1)/1,
        sort:{"shopTypePic":-1},
        resultsName:"shopTypeList",
        limit:3,
        whereObj
    });
    res.json({
        ok:1,
        shopTypeList
    })
});
app.get("/allShopTypeList",async function (req,res) {
   const shopTypeList=await db.find("shopTypeList",{
       sort:{"shopTypePic":-1}
   });
    res.json({
        ok:1,
        shopTypeList
    })
});
//店铺
app.post("/shop",async function (req,res) {
    const {newPicName,params} = await upPic(req,"shopPic");
    const shopTypeInfo = await db.findOneById("shopTypeList",params.shopTypeId);
    db.insertOne("shopList",{
        shopPic:newPicName,
        shopType:shopTypeInfo.shopType,
        shopTypeId:shopTypeInfo._id,
        shopName:params.shopName,
        isRecommend:params.isRecommend,
        createTime:Date.now()
    }).then(data=>{
        res.json({
            ok:1,
            msg:"上传成功"
        })
    })
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
    }).then(data=>{
        res.json({
            ok:1,
            msg:"上传成功"
        })
    })
});
app.get("/shop",async function (req,res) {
    const whereObj={};
    if(req.query.keyWord.length>0){
        whereObj.shopName=new RegExp(req.query.keyWord);
    }
    const shopList=await db.getPageInfo("shopList",{
        pageIndex:(req.query.pageIndex || 1)/1,
        sort:{createTime:-1},
        resultsName:"shopList",
        limit:3,
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
        thisTypeShopList
    })
});
//商品
app.post("/goodsType",async function (req,res) {
    const {goodsType,shopId,shopTypeId,isRecommend}=req.body;
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
        });
        res.json({
            ok:1,
            msg:"添加成功"
        })
    }catch(err){
        res.json(err)
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
        limit:3,
        sort:{createTime:-1},
        whereObj
    })
    res.json({
        ok:1,
        goodsTypeList
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
        thisTypeGoodsList
    });
});
app.post("/goods",async function (req,res) {
    const {newPicName,params} = await upPic(req,"goodsPic");
    const goodsTypeInfo = await db.findOneById("goodsTypeList",params.goodsTypeId);
    const shopInfo=await db.findOneById("shopList",goodsTypeInfo.shopId);
    db.insertOne("goodsList",{
        goodsPic:newPicName,
        goodsName:params.goodsName,
        goodsType:goodsTypeInfo.shopType,
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
    }).then(data=>{
        res.json({
            ok:1,
            msg:"上传成功"
        })
    });
});
app.post("/updateGoods",async function(req,res){
    const {newPicName,params} = await upPic(req,"goodsPic");
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
    }).then(data=>{
        res.json({
            ok:1,
            msg:"修改成功"
        })
    })
});
app.get("/goodsList",async function (req,res) {
    const whereObj={};
    if(req.query.keyWord.length>0){
        whereObj.goodsName=new RegExp(req.query.keyWord);
    }
    const goodsList=await db.getPageInfo("goodsList",{
        pageIndex:(req.query.pageIndex || 1)/1,
        sort:{createTime:-1},
        resultsName:"goodsList",
        limit:3,
        whereObj
    });
    res.json({
        ok:1,
        goodsList
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
    db.deleteOneById("goodsTypeList",id).then((data)=>{
        res.json({
            ok:1,
            msg:"删除成功"
        });
    });
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
                }).catch((err)=>res.json({ok:-1,msg:"删除失败"}));
            }
        })
    }catch{
        res.json({
            ok:-1,
            msg:"删除失败"
        })
    }

});
//*********************前端*************************************

app.listen(8088,function () {
    console.log("success")
});