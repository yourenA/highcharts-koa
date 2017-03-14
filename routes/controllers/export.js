/**
 * Created by Administrator on 2017/3/10.
 */
import xlsx from 'node-xlsx';
import {rotateArr} from './common';
let buffer;
exports.exportResult = async (ctx) =>{
    let xlsxData=[];
    let resultHead=[];
    let resultDate=[];
    let body =ctx.request.body ;
    const formulaName=body.formulaName,
        formulaParameterForOne=body.formulaParameterForOne,
        formulaParameterForArr=body.formulaParameterForArr;

    let formulaNameArr=["formulaName",formulaName];
    console.log("body",body);
    xlsxData.push(formulaNameArr);
    for(let i =0;i<formulaParameterForOne.length;i++){
        xlsxData.push([formulaParameterForOne[i].forOneKey,formulaParameterForOne[i].forOneValue]);
    }
    for(let j=0;j<formulaParameterForArr.length;j++){
        resultHead.push(formulaParameterForArr[j].forArrKey);
        resultDate.push(formulaParameterForArr[j].forArrValue);
        console.log('resultDate',formulaParameterForArr[j].forArrValue.length)
    }
    xlsxData.push(resultHead);
    resultDate=rotateArr(resultDate);
    for(let k=0;k<resultDate.length;k++){
        xlsxData.push(resultDate[k]);
    }

    buffer = xlsx.build([{name: "result", data: xlsxData}]);
    ctx.body = true;

};
exports.getExportResult = async (ctx) =>{
    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set('Content-Disposition', 'attachment; filename=result.xlsx');
    ctx.body = buffer;
};

