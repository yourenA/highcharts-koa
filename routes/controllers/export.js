/**
 * Created by Administrator on 2017/3/10.
 */
import xlsx from 'node-xlsx';
import fs from 'fs';
let buffer
exports.exportResult = async (ctx) =>{
    let xlsxData=[];
    let resultHead=[];
    let resultDate=[];
    let body = ctx.request.body;
    console.log(body)
    const formulaName=body.formulaName,
        formulaParameterForOne=body.formulaParameterForOne,
        formulaParameterForArr=body.formulaParameterForArr;
    let formulaNameArr=["formulaName",formulaName];
    xlsxData.push(formulaNameArr);
    for(let i =0;i<formulaParameterForOne.length;i++){
        xlsxData.push([formulaParameterForOne[i].forOneKey,formulaParameterForOne[i].forOneValue]);
    }
    for(let j=0;j<formulaParameterForArr.length;j++){
        resultHead.push(formulaParameterForArr[j].forArrKey);
        resultDate.push(formulaParameterForArr[j].forArrValue)
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
function rotateArr (arr) {
    let newArr = [];
    for (let i = 0; i <= arr[0].length - 1; i++) {
        let temArr = [];
        for (let j = 0; j <=arr.length - 1 ;j++) {
            temArr.push(arr[j][i]);
        }
        newArr.push(temArr)
    }
    return newArr
}