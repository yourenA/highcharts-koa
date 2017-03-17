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
                ulWidth+=90;
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
                    <h4>" + fomulaData[formula].XAxis + " " + fomulaData[formula].XAxisUnit + "</h4>\
                    <textarea name='' id='" + fomulaData[formula].XAxis + "' ></textarea>\
                </div> ";
        for (var i = 0; i < fomulaData[formula].formulaParameterForArr.length; i++) {
            formulaParameterForArrHtml += "<div >\
                    <h4>" + fomulaData[formula].formulaParameterForArr[i] + " " + fomulaData[formula].formulaParameterForArrUnit[i] + "</h4>\
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
                var KArr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    KArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5  input').eq(i).val())
                }
                var XAxis = [];
                var R = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                R = $('#R').val().split('\n');

                XAxis = removeSpaceInArr(XAxis);
                R = removeSpaceInArr(R);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                if ( KArr.length===0||XAxis.length === 0 || R.length === 0 || XAxis.length !== R.length) {
                    alert("参数为空,参数长度不同或参数为非数字");
                    return false;
                } else {
                    for (var n = 0; n < KArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //ROUND(4096*$B2/($B2+10),0)
                            tempResult.push(Math.round(4096*R[m]/(R[m] + KArr[n])));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, R, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;

                }
                return;
            case 1:
                var ParamArr = [];
                var VccArr = [];
                var R1Arr = [];
                var R2Arr = [];
                var R3Arr = [];
                var RxArr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    VccArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    R1Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(1).val()));
                    R2Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(2).val()));
                    R3Arr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(3).val()));
                    RxArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(4).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5 input').eq(i).val())
                }
                var XAxis = [];
                var R = [];
                var Result = [];
                XAxis = $('#T').val().split('\n');
                R = $('#R').val().split('\n');
                XAxis = removeSpaceInArr(XAxis);
                R = removeSpaceInArr(R);
                for(var j=0;j<($('.formulaParameterForOne table input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                if (VccArr.length === 0 || R1Arr.length === 0 || R2Arr.length === 0 || R3Arr.length === 0 || RxArr.length === 0 || XAxis.length === 0 || R.length === 0 || XAxis.length !== R.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < VccArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //(Vcc /(R1 + ((R2+R3) * R)/((R2+R3) + R))*R/((R2+R3)+R))*R3 (Math.round(R[m] + (R[m] + KArr[n])));
                            tempResult.push(parseFloat((VccArr[n] / (R1Arr[n] + (R2Arr[n] + R3Arr[n]) * R[m] / (R2Arr[n] + R3Arr[n] + R[m])) * R[m] / (R2Arr[n] + R3Arr[n] + R[m]) * R3Arr[n]).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, R, Result, fomulaData[formula].resultUnit, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
                    canExportExcel = true;
                }

                return;
            case 2:
                var ParamArr = [];
                var YArr = [];
                for (var i = 0; i < $('.formulaParameterForOne table').length; i++) {
                    YArr.push(parseFloat($('.formulaParameterForOne table').eq(i).find('input').eq(0).val()));
                    ParamArr.push($('.formulaParameterForOne ').find('h5  input').eq(i).val())
                }
                var Z = [];
                var K = [];
                var XAxis = [];
                var Result = [];
                XAxis = $('#X').val().split('\n');
                Z = $('#Z').val().split('\n');
                K = $('#K').val().split('\n');

                XAxis = removeSpaceInArr(XAxis);
                K = removeSpaceInArr(K);
                Z = removeSpaceInArr(Z);
                for(var j=0;j<($('.formulaParameterForOne  table  input').length);j++){
                    if (isNaN(parseFloat($('.formulaParameterForOne   table input').eq(j).val()))) {
                        alert("参数为空,参数长度不同或参数为非数字");
                        return false;
                    }
                }
                if (YArr.length===0 || XAxis.length === 0 || K.length === 0 || Z.length === 0 || Z.length !== K.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var n = 0; n < YArr.length; n++) {
                        var tempResult = [];
                        for (var m = 0; m < XAxis.length; m++) {
                            //ROUND(4096*$B2/($B2+10),0)
                            tempResult.push(parseFloat((XAxis[m] + YArr[n] + Z[m] + K[m]).toFixed(6)));
                        }
                        $('.result').eq(n).val(tempResult.join('\n'));
                        $('.formulaParameterForOne textarea').eq(n).val(tempResult.join('\n'));
                        Result.push(tempResult)
                    }
                    console.log("result", Result);
                    setResult(XAxis, Z, Result,fomulaData[formula].resultUnit,fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit, ParamArr);
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
        var formulaName = $(".select").data('formulaname');
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
                    forArrKey = $(formulaParameterForArrDivs[j]).find('h4 :eq(0)').text();
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
        // $(".formulaParameterForOne table").eq(delIndex-1).remove()
    });


})(jQuery);
