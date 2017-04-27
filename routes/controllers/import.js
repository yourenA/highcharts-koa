/**
 * Created by daijiaru on 2017/3/11.
 */
var router = require('koa-router')();
const multer = require('koa-multer');
import xlsx from 'node-xlsx';
import fs from 'fs';
import {rotateArr} from './common';

exports.importExcel =  (ctx) =>{
    let body = ctx.req.file ;/*这里是req,不是request*/
    let fileurl=body.path;
    console.log("body:",body)
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