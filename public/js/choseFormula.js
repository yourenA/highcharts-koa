'use strict';

/**
 * Created by Administrator on 2017/3/9.
 */
;(function ($) {
    var fomulaData = null;
    var formula = null;
    var formulaParameterForOneHtml = '';
    var formulaParameterForArrHtml = '';
    var canExportExcel = false;
    var comparedtableId = 1;
    var ulWidth=0;
    var formulaBoxWidth=$('.formula-select-box').width();
    $.ajax({
        url: "./../config.json",
        type: "GET",
        cache: false,
        success: function success(data) {
            console.log(data);
            fomulaData = data;

            for (var i = 0; i < data.length; i++) {
                ulWidth+=130;
                $('.formula-select-box ul').append("<li data-formulaName='"+data[i].formulaName+"'><input class='radio' name='radio' type='radio' value='"+data[i].key+"'><img src='./image/"+data[i].formulaImg+"'><h5>"+data[i].formulaLabel+"</h5></li>");
            }

            $('.formula-select-box ul').width(ulWidth)
        }
    });
    $('.formula-select-box ').hover(function () {
        console.log('hover');
        if(ulWidth>formulaBoxWidth){
            $(this).css({
                overflowY: "hidden",
                overflowX: "scroll"
            })
        }
    },function () {
        $(this).css({
            overflow: "hidden"
        })
    });

    $('.formula-select-box ').on('change','.radio',function () {
        $(this).parent('li').addClass('select').siblings().removeClass('select');
        console.log($(this).siblings('img').attr('src'))
        $('.select-pic').css({
            background:"url("+$(this).siblings('img').attr('src')+")",
            backgroundSize:'250px 200px'
        })
        comparedtableId = 1;
        $('.addOneFormulaParam').css({display: 'block'})
        $('#file').val('');
        $(".showFileName").html("");
        $(".fileerrorTip").html("请选择xlsx文件").show();
        canExportExcel = false;
        formula = parseInt($(this).val());
        console.log(formula);
        if (isNaN(formula)) {
            return false;
        }
        formulaParameterForArrHtml = '';
        formulaParameterForOneHtml = setParameterForOneHtml(comparedtableId, fomulaData, formula);


        formulaParameterForArrHtml += "<div>\
                    <input class='paramName' type='text' value='"+fomulaData[formula].XAxis + " " + fomulaData[formula].XAxisUnit +"' />\
                    <textarea name='' id='" + fomulaData[formula].XAxis + "' ></textarea>\
                </div> ";
        for (var i = 0; i < fomulaData[formula].formulaParameterForArr.length; i++) {
            formulaParameterForArrHtml += "<div >\
                    <input class='paramName' type='text' value='"+ fomulaData[formula].formulaParameterForArr[i] + " " + fomulaData[formula].formulaParameterForArrUnit[i] +"' />\
                    <textarea name='' id='" + fomulaData[formula].formulaParameterForArr[i] + "' ></textarea>\
                </div> ";
        }
        $('.left-parameter').html(formulaParameterForArrHtml);
        $('.formulaParameterForOne ').html(formulaParameterForOneHtml);

        for (var z = 0; z < $('.formulaParameterForOne input').length; z++) {
            $('.formulaParameterForOne input').eq(z).bind('keyup change', function () {
                canExportExcel = false;
            })
        }
        for (var y = 0; y < $('.left-parameter textarea').length; y++) {
            $('.left-parameter textarea').eq(y).bind('keyup change', function () {
                canExportExcel = false;
            })
        }

    });

    $('#compute').bind('click', function (e) {
        if(isNaN(parseInt(formula))){
            alert("请先选择公式");
            return false;
        }
        switch (formula) {
            case 0:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                var R2Arr = [];
                var R3Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    R2Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(2).val()));
                    R3Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(3).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Rt = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Rt = $('#Rt').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Rt = removeSpaceInArr(Rt);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Rt",Rt);
                if (VccArr.length === 0 || R1Arr.length === 0 || R2Arr.length === 0 || R3Arr.length === 0 || XAxis.length === 0 || Rt.length === 0 || XAxis.length !== Rt.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(R3/(R3+R2+(R1*Rt/(R1+Rt))))
                            tempResult.push(parseFloat((VccArr[n]*(R3Arr[n]/(R3Arr[n]+R2Arr[n]+(R1Arr[n]*Rt[m]/(R1Arr[n]+Rt[m]))))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Rt, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 1:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                var R2Arr = [];
                var R3Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    R2Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(2).val()));
                    R3Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(3).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Rt = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Rt = $('#Rt').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Rt = removeSpaceInArr(Rt);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Rt",Rt);
                if (VccArr.length === 0 || R1Arr.length === 0 || R2Arr.length === 0 || R3Arr.length === 0 || XAxis.length === 0 || Rt.length === 0 || XAxis.length !== Rt.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(R3/(R3+(R1*(R2+Rt))/(R1+R2+Rt)))
                            tempResult.push(parseFloat((VccArr[n]*(R3Arr[n]/(R3Arr[n]+(R1Arr[n]*(R2Arr[n]+Rt[m]))/(R1Arr[n]+R2Arr[n]+Rt[m])))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Rt, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 2:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                var R2Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    R2Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(2).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Rt = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Rt = $('#Rt').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Rt = removeSpaceInArr(Rt);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Rt",Rt);
                if (VccArr.length === 0 || R1Arr.length === 0 || R2Arr.length === 0 ||  XAxis.length === 0 || Rt.length === 0 || XAxis.length !== Rt.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(R2/(R2+R1*Rt/(R1+Rt)))
                            tempResult.push(parseFloat((VccArr[n]*(R2Arr[n]/(R2Arr[n]+R1Arr[n]*Rt[m]/(R1Arr[n]+Rt[m])))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Rt, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 3:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Rt = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Rt = $('#Rt').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Rt = removeSpaceInArr(Rt);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Rt",Rt);
                if (VccArr.length === 0 || R1Arr.length === 0 || XAxis.length === 0 || Rt.length === 0 || XAxis.length !== Rt.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(R1/(R1+Rt))
                            tempResult.push(parseFloat((VccArr[n]*(R1Arr[n]/(R1Arr[n]+Rt[m]))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Rt, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 4:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                var R2Arr = [];
                var R3Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    R2Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(2).val()));
                    R3Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(3).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Rt = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Rt = $('#Rt').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Rt = removeSpaceInArr(Rt);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Rt",Rt);
                if (VccArr.length === 0 || R1Arr.length === 0 || R2Arr.length === 0 || R3Arr.length === 0 || XAxis.length === 0 || Rt.length === 0 || XAxis.length !== Rt.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(1-(R1/(R3+R1+(R2*Rt/(R2+Rt)))))
                            tempResult.push(parseFloat((VccArr[n]*(1-(R1Arr[n]/(R3Arr[n]+R1Arr[n]+(R2Arr[n]*Rt[m]/(R2Arr[n]+Rt[m])))))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Rt, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 5:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                var R2Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    R2Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(2).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Rt = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Rt = $('#Rt').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Rt = removeSpaceInArr(Rt);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Rt",Rt);
                if (VccArr.length === 0 || R1Arr.length === 0 || R2Arr.length === 0 ||  XAxis.length === 0 || Rt.length === 0 || XAxis.length !== Rt.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(R2*Rt/(R2+Rt)/(R1+R2*Rt/(R2+Rt)))
                            tempResult.push(parseFloat((VccArr[n]*(R2Arr[n]*Rt[m]/(R2Arr[n]+Rt[m])/(R1Arr[n]+R2Arr[n]*Rt[m]/(R2Arr[n]+Rt[m])))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Rt, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 6:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                var R2Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    R2Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(2).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Rt = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Rt = $('#Rt').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Rt = removeSpaceInArr(Rt);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Rt",Rt);
                if (VccArr.length === 0 || R1Arr.length === 0 || R2Arr.length === 0 ||  XAxis.length === 0 || Rt.length === 0 || XAxis.length !== Rt.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(1-R1/(R1+R2+Rt))
                            tempResult.push(parseFloat((VccArr[n]*(1-R1Arr[n]/(R1Arr[n]+R2Arr[n]+Rt[m]))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Rt, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 7:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Rt = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Rt = $('#Rt').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Rt = removeSpaceInArr(Rt);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Rt",Rt);
                if (VccArr.length === 0 || R1Arr.length === 0 || XAxis.length === 0 || Rt.length === 0 || XAxis.length !== Rt.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(Rt/(R1+Rt))
                            tempResult.push(parseFloat((VccArr[n]*(Rt[m]/(R1Arr[n]+Rt[m]))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Rt, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 8:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                var R2Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    R2Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(2).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Rt = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Rt = $('#Rt').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Rt = removeSpaceInArr(Rt);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Rt",Rt);
                if (VccArr.length === 0 || R1Arr.length === 0 || R2Arr.length === 0 ||  XAxis.length === 0 || Rt.length === 0 || XAxis.length !== Rt.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(R2/(R1+R2+Rt))
                            tempResult.push(parseFloat((VccArr[n]*(R2Arr[n]/(R1Arr[n]+R2Arr[n]+Rt[m]))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Rt, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 9:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                var R2Arr = [];
                var R3Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    R2Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(2).val()));
                    R3Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(3).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Rt = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Rt = $('#Rt').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Rt = removeSpaceInArr(Rt);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Rt",Rt);
                if (VccArr.length === 0 || R1Arr.length === 0 || R2Arr.length === 0 || R3Arr.length === 0 || XAxis.length === 0 || Rt.length === 0 || XAxis.length !== Rt.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(1-R1/(R1+(R2*(R3+Rt)/(R2+R3+Rt))))
                            tempResult.push(parseFloat((VccArr[n]*(1-R1Arr[n]/(R1Arr[n]+(R2Arr[n]*(R3Arr[n]+Rt[m])/(R2Arr[n]+R3Arr[n]+Rt[m]))))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Rt, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 10:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                var R2Arr = [];
                var R3Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    R2Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(2).val()));
                    R3Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(3).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Rt = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Rt = $('#Rt').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Rt = removeSpaceInArr(Rt);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Rt",Rt);
                if (VccArr.length === 0 || R1Arr.length === 0 || R2Arr.length === 0 || R3Arr.length === 0 || XAxis.length === 0 || Rt.length === 0 || XAxis.length !== Rt.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(1-R1/(R1+(R2+R3)*Rt/(R2+R3+Rt)))*(R3/(R2+R3))
                            tempResult.push(parseFloat((VccArr[n]*(1-R1Arr[n]/(R1Arr[n]+(R2Arr[n]+R3Arr[n])*Rt[m]/(R2Arr[n]+R3Arr[n]+Rt[m])))*(R3Arr[n]/(R2Arr[n]+R3Arr[n]))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Rt, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 11:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                var R2Arr = [];
                var R3Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    R2Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(2).val()));
                    R3Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(3).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Rt = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Rt = $('#Rt').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Rt = removeSpaceInArr(Rt);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Rt",Rt);
                if (VccArr.length === 0 || R1Arr.length === 0 || R2Arr.length === 0 || R3Arr.length === 0 || XAxis.length === 0 || Rt.length === 0 || XAxis.length !== Rt.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(1-R1/(R1+(Rt+R3)*R2/(R2+R3+Rt)))*(R3/(Rt+R3))
                            tempResult.push(parseFloat((VccArr[n]*(1-R1Arr[n]/(R1Arr[n]+(Rt[m]+R3Arr[n])*R2Arr[n]/(R2Arr[n]+R3Arr[n]+Rt[m])))*(R3Arr[n]/(Rt[m]+R3Arr[n]))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Rt, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 12:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                var R2Arr = [];
                var R3Arr = [];
                var R4Arr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    R2Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(2).val()));
                    R3Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(3).val()));
                    R4Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(4).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var Vin = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                Vin = $('#Vin').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                Vin = removeSpaceInArr(Vin);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                console.log("XAxis",XAxis);
                console.log("Vin",Vin);
                if (VccArr.length === 0 || R1Arr.length === 0 || R2Arr.length === 0 || R3Arr.length === 0 ||R4Arr.length === 0 || XAxis.length === 0 || Vin.length === 0 || XAxis.length !== Vin.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //Vout=Vcc*(1-R1/(R1+R3*(R2+R4)/(R2+R3+R4)))*(R4/(R2+R4))+Vin*(R4/(R2+R4))
                            tempResult.push(parseFloat((VccArr[n]*(1-R1Arr[n]/(R1Arr[n]+R3Arr[n]*(R2Arr[n]+R4Arr[n])/(R2Arr[n]+R3Arr[n]+R4Arr[n])))*(R4Arr[n]/(R2Arr[n]+R4Arr[n]))+Vin[m]*(R4Arr[n]/(R2Arr[n]+R4Arr[n]))).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Vin, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            default:
                return;
        }
    });

    $('#export').bind('click', function (e) {
        if (!canExportExcel) {
            alert('请先计算结果再进行导出');
            return false;
        }
        var formulaName = fomulaData[formula].formulaLabel+":"+$(".select").data('formulaname');
        console.log(formulaName);
        var formulaParameterForOneArr = [];
        var formulaParameterTables= $('.formulaParameterForOne .table-content');
        for(var i=0;i<formulaParameterTables.length;i++){
            var paramName=$('.formulaParameterForOne .table-content h5').eq(i).find('input').val();
            formulaParameterForOneArr.push({
                forOneKey: paramName,
                forOneValue: ''
            });
            var formulaParameterForOneTrs = $('.formulaParameterForOne table').eq(i).find('tr');
            for (var k = 0; k < formulaParameterForOneTrs.length; k++) {
                var forOneKey = $(formulaParameterForOneTrs[k]).find('td :eq(0)').text() ;
                var forOneValue = $(formulaParameterForOneTrs[k]).find('input').val();
                formulaParameterForOneArr.push({
                    forOneKey: forOneKey,
                    forOneValue: forOneValue
                });
            }
        }

        console.log(formulaParameterForOneArr);
        var formulaParameterForArrDivs = $('.left-parameter div');
        var formulaParameterForArrArr = [];
        for (var j = 0; j < (formulaParameterForArrDivs.length + formulaParameterTables.length); j++) {
            var forArrKey;
            var forArrValue;
            if(j<formulaParameterForArrDivs.length ){
                    forArrKey = $(formulaParameterForArrDivs[j]).find('.paramName :eq(0)').val();
                    forArrValue = removeSpaceInArr($(formulaParameterForArrDivs[j]).find('textarea').val().split('\n'));

            }else{
                    forArrKey = $(formulaParameterTables[j-formulaParameterForArrDivs.length]).find('h5  input').eq(0).val()+'('+fomulaData[formula].resultUnit+')';
                    forArrValue = removeSpaceInArr($(formulaParameterTables[j-formulaParameterForArrDivs.length]).find('textarea').val().split('\n'));
            }
            formulaParameterForArrArr.push({
                forArrKey: forArrKey,
                forArrValue: forArrValue
            });

        }
        var sendExportData = {
            formulaName: formulaName,
            formulaParameterForOne: formulaParameterForOneArr,
            formulaParameterForArr: formulaParameterForArrArr
        };
        console.log(sendExportData);
        $.ajax({
            url: "/api/export",
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(sendExportData),
            success: function success(data) {
                console.log(data);
                if (data === true) {
                    $('#exportExcel-mask').css({display: 'block'});
                    $('#exportExcel-content').css({display: 'block'});
                }
            },
            error: function (err) {
                console.log("err", err)
            }
        });
        $("#exportExcel-mask").bind('click', function (e) {
            $('#exportExcel-mask').css({display: 'none'});
            $('#exportExcel-content').css({display: 'none'});
        });
        $("#download").bind('click', function (e) {
            $('#exportExcel-mask').css({display: 'none'});
            $('#exportExcel-content').css({display: 'none'});
        });
    });

    $('#addOneFormulaParam').bind('click', function (e) {
        comparedtableId += 1;
        var addFormulaParameterForOneHtml = setParameterForOneHtml(comparedtableId, fomulaData, formula);
        $('.formulaParameterForOne ').append(addFormulaParameterForOneHtml);
    });

    $('.formulaParameterForOne').on('click', '.delParameterOne', function (e) {
        console.log('delParameterOne');
        var delIndex = parseInt($(this).parents('.table-content').data('index'));
        console.log(delIndex);
        $(".formulaParameterForOne").find('.table-' + delIndex).remove();
        $(".left-parameter").find('.result-' + delIndex).remove();
    });


})(jQuery);
