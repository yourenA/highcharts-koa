/**
 * Created by daijiaru on 2017/3/11.
 */
var router = require('koa-router')();
const multer = require('koa-multer');
import xlsx from 'node-xlsx';
import fs from 'fs';
import {rotateArr} from './common';

exports.importExcel =  (ctx) =>{
    try {
        /**
         * ctx.req  Node 的 request 对象。
         * ctx.request Koa 的 Request 对象。
         * 注意一个node,一个是koa
         * */
        let body = ctx.req.file ;/*这里是req,不是request*/
        console.log("body:",body)
        let fileurl=body.path;
        const workSheetsFromFile = xlsx.parse(`${__dirname}/../../${fileurl}`);
        workSheetsFromFile[0].data.shift();
        let  importData=rotateArr(workSheetsFromFile[0].data);
        fs.unlink(`${__dirname}/../../${fileurl}`, function(err) {
            if (err) {
                console.log(err);
            }else{
                console.log(`del ${__dirname}/../../${fileurl} success`);
            }

        });

        ctx.body=importData;
    }
    catch(err)
    {
        console.log("err:",err)
    }

}