const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;// 属性，类型是一个对象。
// 以下划线开头一般代表的是你的模块私有属性。不对外暴露
function _connect() {
    return new Promise(function (resolve,reject) {
        mongoClient.connect("mongodb://127.0.0.1:27017",{ useUnifiedTopology: true,useNewUrlParser: true },function (err,client) {
            // 保证你的数据库是挂起状态
            if(err){
                reject("连接数据库失败");
            }else{
                // 你要操作的数据库
                const db = client.db("ele");
                resolve(db);
            }
        })
    })
}
/*
* 插入一条记录
* coll:集合
* insertObj:插入的内容
* 返回的是一个promise*/
module.exports.insertOne = async (coll,insertObj) => {
    const db = await _connect();
    return new Promise(function (resolve,reject) {
        db.collection(coll).insertOne(insertObj,function (err,results) {
            if(err) reject(err);
            else resolve(results);
        })
    })
}
/*
* 根据条件查找相关信息（多条）*/
module.exports.find = async function (coll,{whereObj={},sort={},skip=0,limit=0}) {
    const db = await _connect();
    return new Promise(function (resolve,reject) {
        db.collection(coll).find(whereObj).sort(sort).skip(skip).limit(limit).toArray(function (err,results) {
            if(err) reject(err);
            else resolve(results);
        })
    })
}
// 根据条件获得总条数
module.exports.count = async function (coll,whereObj = {}) {
    const db = await _connect();
    return new Promise(function (resolve,reject) {
        db.collection(coll).countDocuments(whereObj).then(function (count) {
            resolve(count);
        })
    })
}
module.exports.getPageInfo = async function (coll,obj={}) {
    let {whereObj = {}, limit = 10, pageIndex = 1, sort = {}, resultsName = coll} = obj;
    const count = await this.count(coll, whereObj);
    let pageSum = Math.ceil(count / limit);// 总页数
    if (pageSum < 1) pageSum = 1;
    if (pageIndex < 1) pageIndex = 1;
    if (pageIndex > pageSum) pageIndex = pageSum;

    const results = await this.find(coll, {
        whereObj,
        limit,
        skip: (pageIndex - 1) * limit,
        sort
    })
    return {
        pageIndex,
        pageSum,
        count,
        ok: 1,
        [resultsName]: results
    };
}
// 根据ID进行删除一条
module.exports.deleteOneById = async function (coll,id) {
    const db = await _connect();
    return new Promise((resolve,reject)=>{
        db.collection(coll).deleteOne({
            _id:mongodb.ObjectId(id)
        },(err,results)=>{
            if(err) reject(err);
            else resolve(results)
        })
    })
}
// 根据ID查找一条信息
module.exports.findOneById = async function (coll,id) {
    const db = await _connect();
    return new Promise((resolve,reject)=>{
        db.collection(coll).findOne({
            _id:mongodb.ObjectId(id)
        },(err,results)=>{
            if(err) reject(err);
            else resolve(results)
        })
    })
}
// 查找一条记录
module.exports.findOne = async function (coll,whereObj) {
    const db = await _connect();
    return new Promise((resolve,reject)=>{
        db.collection(coll).findOne(whereObj,(err,results)=>{
            if(err) reject(err);
            else resolve(results)
        })
    })
}
// 根据ID进行修改
module.exports.updateOneById = async function (coll,id,upObj) {
    const db = await _connect();
    return new Promise((resolve,reject)=>{
        db.collection(coll).updateOne({
            _id:mongodb.ObjectId(id)
        },upObj,(err,results)=>{
            if(err) reject(err);
            else resolve(results)
        })
    })
}
// 更新一条
module.exports.updateOne = async function (coll,whereObj,upObj) {
    const db = await _connect();
    return new Promise((resolve,reject)=>{
        db.collection(coll).updateOne(whereObj,upObj,(err,results)=>{
            if(err) reject(err);
            else resolve(results)
        })
    })
}






