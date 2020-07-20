const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
/*
* req:请求对象
* imgName:图片的名称
* 返回结果：{
*   ok:1  未上传图片  2、上传成功  3、上传图片格式不正确
* }*/
const uploadDir = path.resolve(__dirname,"../upload");
module.exports.upPic = function (req, imgName) {
    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;// 设置上传的文件目录。
    form.keepExtensions = true;// 是否保留上传文件的扩展名。
    return new Promise((resolve, reject) => {
        form.parse(req, function (err, params, file) {
            const imgInfo = file[imgName];
            if (imgInfo.size <= 0) {// 未上传图片
                // 删除空文件
                fs.unlink(imgInfo.path, function (err) {
                    resolve({
                        ok: -2,
                        params,
                        msg: "请上传图片"
                    })
                })
            } else {
                // 限制文件的类型。 .png,.gif,.jpg
                const extArr = [".png", ".gif", ".jpg"];
                // 得到上传图片的扩展名
                const imgExtName = path.extname(imgInfo.path).toLowerCase();
                //判断数组当中是否包含上传文件的扩展名
                if (extArr.includes(imgExtName)) {
                    const newPicName =imgName+ Date.now() + imgExtName;
                    fs.rename(imgInfo.path,uploadDir +"/" + newPicName, function (err) {
                       resolve({
                           ok:1,
                           newPicName,// 最终图片的名字
                           params,
                           msg:"上传成功"
                       })
                    })
                } else {// 格式不正确
                    fs.unlink(imgInfo.path, function (err) {
                        resolve({
                            ok: -1,
                            msg: "请选择正确的图片格式：\".png\",\".gif\",\".jpg\""
                        })
                    })
                }
            }
        })
    })
}
module.exports.delPic=async function (req,coll,info) {
    fs.unlink(__dirname+"/upload/"+info.picName, function (err) {
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
    })
}