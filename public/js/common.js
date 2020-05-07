'use strict';

/**
 * Created by Administrator on 2017/3/9.
 */
/**
 * removeSpaceInArr 出去数组中的空格
 * @arr 需要去除空格的数组
 * */
function removeSpaceInArr(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === '' || isNaN(parseFloat(arr[i]))) {
            arr.splice(i, 1);
            i = i - 1;
        }
        arr[i] = parseFloat(arr[i]);
    }
    return arr;
}

function setParameterForOneHtml(comparedtableId, fomulaData, formula) {
    console.log("comparedtableId", comparedtableId);
    var formulaParameterForOneHtml = '<div  class="table-content table-' + comparedtableId + '" data-index="' + comparedtableId + '"><h5><input class="paramName" type="text" value="参数组' + comparedtableId + '" /><span class="delParameterOne" >删除参数</span></h5><div class="table-result"><div><table cellspacing="0" cellpadding="0">';
    console.log(fomulaData[formula].formulaParameterForOne);
    for (var i = 0; i < fomulaData[formula].formulaParameterForOne.length; i++) {
        formulaParameterForOneHtml += "<tr><td>" + fomulaData[formula].formulaParameterForOne[i] + " " + fomulaData[formula].formulaParameterForOneUnit[i] + "</td><td> <input type='text' value='" + fomulaData[formula].formulaParameterForOneDefault[i] + "' id='" + fomulaData[formula].formulaParameterForOne[i] + "'/></td></tr> ";
    }
    formulaParameterForOneHtml += '</table></div><div><p class="result-unit">结果单位：' + fomulaData[formula].resultUnit + '</p><textarea  class="result result-' + comparedtableId + '" ></textarea></div></div></div>';

    return formulaParameterForOneHtml
}


var highcharts1 = null;
var highcharts2 = null;
function setResult(XAxisArr, resistanceVal, resultArr, resultUnit, title, XAxis, XAxisUnit, ParamArr) {

    var Result = [];
    for (var i = 0; i < resultArr.length; i++) {
        Result.push({
            name: ParamArr[i],
            data: resultArr[i]
        })
    }
    console.log("Result", Result)
    highcharts1 = Highcharts.chart('hchartsBox', {
        chart: {
            plotBorderWidth: 1,
            zoomType: 'x'
        },
        exporting: {
            enabled: true //这里false 修改为true
        },
        title: {
            text: title
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                '鼠标拖动可以进行缩放' : '手势操作进行缩放'
        },
        xAxis: {
            title: {
                text: XAxis + ' ' + XAxisUnit
            },
            categories: XAxisArr,
            tickInterval: 1
        },
        yAxis: {
            title: {
                align: 'high',
                rotation: 0,
                offset: 0,
                y: -10,
                text: '结果 ' + resultUnit
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#000'
            }]
        },
        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat: '<span style="font-size: 14px">' + XAxis + ':{point.key}' + XAxisUnit + '</span><table>',
            pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' + '<td style="text-align: right"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            valueDecimals: 6
        },
        series: Result
    });
    highcharts2 = Highcharts.chart('hchartsBox2', {
        chart: {
            plotBorderWidth: 1,
            zoomType: 'x'
        },
        exporting: {
            enabled: true //这里false 修改为true
        },
        credits: {
            enabled: false
        },
        title: {
            text: '温度—电阻值'
        },
        xAxis: {
            title: {
                text: XAxis + ' ' + XAxisUnit
            },
            categories: XAxisArr,
            tickInterval: 1
        },
        yAxis: {
            title: {
                align: 'high',
                rotation: 0,
                offset: 0,
                y: -10,
                text: '电阻值'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#000'
            }]
        },
        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat: '<span style="font-size: 14px">温度:{point.key}</span><table>',
            pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' + '<td style="text-align: right"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
        },
        series: [{
            name: '电阻值',
            data: resistanceVal
        }]
    });
}


$("input[type='file']").on("change", function () {
    var filePath = $(this).val();
    if (filePath.indexOf("xlsx") != -1) {
        $(".fileerrorTip").html("").hide();
        var arr = filePath.split('\\');
        var fileName = arr[arr.length - 1];
        $(".showFileName").html('文件格式正确');
    } else {
        $(".showFileName").html("");
        $(".fileerrorTip").html("文件格式错误,请选择.xlsx文件").show();
        return false
    }
})
function scrollEvent(e) {
    console.log();
    $('.left-parameter .RTextarea').scrollTop($(e).scrollTop())
    $('.table-result textarea').scrollTop($(e).scrollTop())
}
function uploadFile() {
    if (isNaN(parseInt($('.formula-select-box input:radio:checked').val()))) {
        alert("请先选择公式");
        return false;
    }
    if ($('#file').val() === '') {
        alert("请先选择文件");
        return false;
    }
    if ($('#file').val().indexOf("xlsx") === -1) {
        alert("请选择xlsx文件");
        return false;
    }
    var formData = new FormData();
    formData.append("file", $('#file')[0].files[0]);
    $.ajax({
        url: '/api/import',
        type: 'POST',
        data: formData,
        async: false,//(默认: true) 默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
        cache: false,//设置为 false 将不缓存此页面。
        contentType: false,// 告诉jQuery不要去设置Content-Type请求头
        processData: false,// 告诉jQuery不要去处理发送的数据
        success: function (data) {
            console.log('xlsx Uploader upload success, data:', data);
            if ($('.left-parameter>div:not(.result-content)').length === data.length) {
                for (var i = 0; i < data.length; i++) {
                    $('.left-parameter').find('textarea').eq(i).val(data[i].join('\n'));
                }
            } else {
                alert('导入文件参数与公式参数不相同')
            }
        },
        error: function () {
            $("#spanMessage").html("与服务器通信发生错误");
        }
    });
}


