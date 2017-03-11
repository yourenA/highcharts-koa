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

var highcharts1 = null;
var highcharts2 = null;
function setResult(XAxisArr, resistanceVal, resultArr, title, XAxis, XAxisUnit) {

    console.log(resultArr);

    highcharts1 = Highcharts.chart('hchartsBox', {
        chart: {
            plotBorderWidth: 1
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: true //这里false 修改为true
        },
        title: {
            text: title
        },
        subtitle: {
            text: '公式'
        },
        xAxis: {
            title: {
                text: XAxis
            },
            categories: XAxisArr,
            tickInterval: 1
        },
        yAxis: {
            title: {
                text: '结果'
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
            valueDecimals: 2
        },
        series: [{
            name: title,
            data: resultArr
        }]
    });
    highcharts2 = Highcharts.chart('hchartsBox2', {
        chart: {
            plotBorderWidth: 1
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
                text: XAxis
            },
            categories: XAxisArr,
            tickInterval: 1
        },
        yAxis: {
            title: {
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
            valueDecimals: 2
        },
        series: [{
            name: '电阻值',
            data: resistanceVal
        }]
    });
}

$(".a-upload").on("change","input[type='file']",function(){
    var filePath=$(this).val();
    if(filePath.indexOf("xlsx")!=-1 ){
        $(".fileerrorTip").html("").hide();
        var arr=filePath.split('\\');
        var fileName=arr[arr.length-1];
        $(".showFileName").html(fileName);
    }else{
        $(".showFileName").html("");
        $(".fileerrorTip").html("您未上传文件，或者您上传文件类型有误！").show();
        return false
    }
})

function uploadFile(){
    var formData = new FormData();
    formData.append("file",$('#file')[0].files[0]);
    console.log($('#file')[0].files[0])
    console.log(formData);
    $.ajax({
        url: '/api/import',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data){
            console.log('imgUploader upload success, data:', data);
            if($('.left-parameter>div').length - 1 === data.length){
                for(var i=0;i<data.length;i++){
                    $('.left-parameter').find('textarea').eq(i).val(data[i].join('\n'));
                }
            }
        },
        error: function(){
            $("#spanMessage").html("与服务器通信发生错误");
        }
    });
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi5qcyJdLCJuYW1lcyI6WyJyZW1vdmVTcGFjZUluQXJyIiwiYXJyIiwiaSIsImxlbmd0aCIsImlzTmFOIiwicGFyc2VGbG9hdCIsInNwbGljZSIsImhpZ2hjaGFydHMxIiwiaGlnaGNoYXJ0czIiLCJzZXRSZXN1bHQiLCJYQXhpc0FyciIsInJlc2lzdGFuY2VWYWwiLCJyZXN1bHRBcnIiLCJ0aXRsZSIsIlhBeGlzIiwiWEF4aXNVbml0IiwiY29uc29sZSIsImxvZyIsIkhpZ2hjaGFydHMiLCJjaGFydCIsInBsb3RCb3JkZXJXaWR0aCIsImNyZWRpdHMiLCJlbmFibGVkIiwiZXhwb3J0aW5nIiwidGV4dCIsInN1YnRpdGxlIiwieEF4aXMiLCJjYXRlZ29yaWVzIiwidGlja0ludGVydmFsIiwieUF4aXMiLCJwbG90TGluZXMiLCJ2YWx1ZSIsIndpZHRoIiwiY29sb3IiLCJ0b29sdGlwIiwic2hhcmVkIiwidXNlSFRNTCIsImhlYWRlckZvcm1hdCIsInBvaW50Rm9ybWF0IiwiZm9vdGVyRm9ybWF0IiwidmFsdWVEZWNpbWFscyIsInNlcmllcyIsIm5hbWUiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7QUFHQTs7OztBQUlBLFNBQVNBLGdCQUFULENBQTBCQyxHQUExQixFQUErQjtBQUMzQixTQUFJLElBQUlDLElBQUUsQ0FBVixFQUFZQSxJQUFFRCxJQUFJRSxNQUFsQixFQUF5QkQsR0FBekIsRUFBNkI7QUFDekIsWUFBR0QsSUFBSUMsQ0FBSixNQUFXLEVBQVgsSUFBaUJFLE1BQU1DLFdBQVdKLElBQUlDLENBQUosQ0FBWCxDQUFOLENBQXBCLEVBQWlEO0FBQzdDRCxnQkFBSUssTUFBSixDQUFXSixDQUFYLEVBQWEsQ0FBYjtBQUNBQSxnQkFBR0EsSUFBRSxDQUFMO0FBQ0g7QUFDREQsWUFBSUMsQ0FBSixJQUFPRyxXQUFXSixJQUFJQyxDQUFKLENBQVgsQ0FBUDtBQUNIO0FBQ0QsV0FBT0QsR0FBUDtBQUNIOztBQUVELElBQUlNLGNBQVksSUFBaEI7QUFDQSxJQUFJQyxjQUFZLElBQWhCO0FBQ0EsU0FBU0MsU0FBVCxDQUFtQkMsUUFBbkIsRUFBNEJDLGFBQTVCLEVBQTBDQyxTQUExQyxFQUFvREMsS0FBcEQsRUFBMERDLEtBQTFELEVBQWdFQyxTQUFoRSxFQUEyRTs7QUFFdkVDLFlBQVFDLEdBQVIsQ0FBWUwsU0FBWjs7QUFFQUwsa0JBQWNXLFdBQVdDLEtBQVgsQ0FBaUIsWUFBakIsRUFBK0I7QUFDekNBLGVBQU87QUFDSEMsNkJBQWlCO0FBRGQsU0FEa0M7QUFJekNDLGlCQUFTO0FBQ0xDLHFCQUFTO0FBREosU0FKZ0M7QUFPekNDLG1CQUFVO0FBQ05ELHFCQUFRLElBREYsQ0FDUTtBQURSLFNBUCtCO0FBVXpDVCxlQUFPO0FBQ0hXLGtCQUFNWDtBQURILFNBVmtDO0FBYXpDWSxrQkFBVTtBQUNORCxrQkFBTTtBQURBLFNBYitCO0FBZ0J6Q0UsZUFBTztBQUNIYixtQkFBTztBQUNIVyxzQkFBTVY7QUFESCxhQURKO0FBSUhhLHdCQUFXakIsUUFKUjtBQUtIa0IsMEJBQWM7QUFMWCxTQWhCa0M7QUF1QnpDQyxlQUFPO0FBQ0hoQixtQkFBTztBQUNIVyxzQkFBTTtBQURILGFBREo7QUFJSE0sdUJBQVcsQ0FBQztBQUNSQyx1QkFBTyxDQURDO0FBRVJDLHVCQUFPLENBRkM7QUFHUkMsdUJBQU87QUFIQyxhQUFEO0FBSlIsU0F2QmtDO0FBaUN6Q0MsaUJBQVM7QUFDTEMsb0JBQVEsSUFESDtBQUVMQyxxQkFBUyxJQUZKO0FBR0xDLDBCQUFjLG1DQUFpQ3ZCLEtBQWpDLEdBQXVDLGNBQXZDLEdBQXVEQyxTQUF2RCxHQUFpRSxnQkFIMUU7QUFJTHVCLHlCQUFhLCtEQUNiLDBEQUxLO0FBTUxDLDBCQUFjLFVBTlQ7QUFPTEMsMkJBQWU7QUFQVixTQWpDZ0M7QUEwQ3pDQyxnQkFBUSxDQUFDO0FBQ0xDLGtCQUFNN0IsS0FERDtBQUVMOEIsa0JBQU0vQjtBQUZELFNBQUQ7QUExQ2lDLEtBQS9CLENBQWQ7QUErQ0FKLGtCQUFjVSxXQUFXQyxLQUFYLENBQWlCLGFBQWpCLEVBQWdDO0FBQzFDQSxlQUFPO0FBQ0hDLDZCQUFpQjtBQURkLFNBRG1DO0FBSTFDRyxtQkFBVTtBQUNORCxxQkFBUSxJQURGLENBQ1E7QUFEUixTQUpnQztBQU8xQ0QsaUJBQVM7QUFDTEMscUJBQVM7QUFESixTQVBpQztBQVUxQ1QsZUFBTztBQUNIVyxrQkFBTTtBQURILFNBVm1DO0FBYTFDRSxlQUFPO0FBQ0hiLG1CQUFPO0FBQ0hXLHNCQUFNVjtBQURILGFBREo7QUFJSGEsd0JBQVdqQixRQUpSO0FBS0hrQiwwQkFBYztBQUxYLFNBYm1DO0FBb0IxQ0MsZUFBTztBQUNIaEIsbUJBQU87QUFDSFcsc0JBQU07QUFESCxhQURKO0FBSUhNLHVCQUFXLENBQUM7QUFDUkMsdUJBQU8sQ0FEQztBQUVSQyx1QkFBTyxDQUZDO0FBR1JDLHVCQUFPO0FBSEMsYUFBRDtBQUpSLFNBcEJtQztBQThCMUNDLGlCQUFTO0FBQ0xDLG9CQUFRLElBREg7QUFFTEMscUJBQVMsSUFGSjtBQUdMQywwQkFBYyw0REFIVDtBQUlMQyx5QkFBYSwrREFDYiwwREFMSztBQU1MQywwQkFBYyxVQU5UO0FBT0xDLDJCQUFlO0FBUFYsU0E5QmlDO0FBdUMxQ0MsZ0JBQVEsQ0FBQztBQUNMQyxrQkFBTSxLQUREO0FBRUxDLGtCQUFNaEM7QUFGRCxTQUFEO0FBdkNrQyxLQUFoQyxDQUFkO0FBNENIIiwiZmlsZSI6ImNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEFkbWluaXN0cmF0b3Igb24gMjAxNy8zLzkuXHJcbiAqL1xyXG4vKipcclxuICogcmVtb3ZlU3BhY2VJbkFyciDlh7rljrvmlbDnu4TkuK3nmoTnqbrmoLxcclxuICogQGFyciDpnIDopoHljrvpmaTnqbrmoLznmoTmlbDnu4RcclxuICogKi9cclxuZnVuY3Rpb24gcmVtb3ZlU3BhY2VJbkFycihhcnIpIHtcclxuICAgIGZvcih2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGlmKGFycltpXSA9PT0gJycgfHwgaXNOYU4ocGFyc2VGbG9hdChhcnJbaV0gKSkgICl7XHJcbiAgICAgICAgICAgIGFyci5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgICAgaT0gaS0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhcnJbaV09cGFyc2VGbG9hdChhcnJbaV0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyclxyXG59XHJcblxyXG52YXIgaGlnaGNoYXJ0czE9bnVsbDtcclxudmFyIGhpZ2hjaGFydHMyPW51bGw7XHJcbmZ1bmN0aW9uIHNldFJlc3VsdChYQXhpc0FycixyZXNpc3RhbmNlVmFsLHJlc3VsdEFycix0aXRsZSxYQXhpcyxYQXhpc1VuaXQpIHtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhyZXN1bHRBcnIpO1xyXG5cclxuICAgIGhpZ2hjaGFydHMxID0gSGlnaGNoYXJ0cy5jaGFydCgnaGNoYXJ0c0JveCcsIHtcclxuICAgICAgICBjaGFydDoge1xyXG4gICAgICAgICAgICBwbG90Qm9yZGVyV2lkdGg6IDFcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNyZWRpdHM6IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIGV4cG9ydGluZzp7XHJcbiAgICAgICAgICAgIGVuYWJsZWQ6dHJ1ZSAgLy/ov5nph4xmYWxzZSDkv67mlLnkuLp0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICB0ZXh0OiB0aXRsZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VidGl0bGU6IHtcclxuICAgICAgICAgICAgdGV4dDogJ+WFrOW8jydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBYQXhpc1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjYXRlZ29yaWVzOlhBeGlzQXJyLFxyXG4gICAgICAgICAgICB0aWNrSW50ZXJ2YWw6IDFcclxuICAgICAgICB9LFxyXG4gICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAn57uT5p6cJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwbG90TGluZXM6IFt7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogMCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAxLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjMDAwJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICBzaGFyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHVzZUhUTUw6IHRydWUsXHJcbiAgICAgICAgICAgIGhlYWRlckZvcm1hdDogJzxzcGFuIHN0eWxlPVwiZm9udC1zaXplOiAxNHB4XCI+JytYQXhpcysnOntwb2ludC5rZXl9JysgWEF4aXNVbml0Kyc8L3NwYW4+PHRhYmxlPicsXHJcbiAgICAgICAgICAgIHBvaW50Rm9ybWF0OiAnPHRyPjx0ZCBzdHlsZT1cImNvbG9yOiB7c2VyaWVzLmNvbG9yfVwiPntzZXJpZXMubmFtZX06IDwvdGQ+JyArXHJcbiAgICAgICAgICAgICc8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodFwiPjxiPntwb2ludC55fTwvYj48L3RkPjwvdHI+JyxcclxuICAgICAgICAgICAgZm9vdGVyRm9ybWF0OiAnPC90YWJsZT4nLFxyXG4gICAgICAgICAgICB2YWx1ZURlY2ltYWxzOiAyXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXJpZXM6IFt7XHJcbiAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxyXG4gICAgICAgICAgICBkYXRhOiByZXN1bHRBcnJcclxuICAgICAgICB9XVxyXG4gICAgfSk7XHJcbiAgICBoaWdoY2hhcnRzMiA9IEhpZ2hjaGFydHMuY2hhcnQoJ2hjaGFydHNCb3gyJywge1xyXG4gICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgIHBsb3RCb3JkZXJXaWR0aDogMVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXhwb3J0aW5nOntcclxuICAgICAgICAgICAgZW5hYmxlZDp0cnVlICAvL+i/memHjGZhbHNlIOS/ruaUueS4unRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNyZWRpdHM6IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIHRleHQ6ICfmuKnluqbigJTnlLXpmLvlgLwnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogWEF4aXNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2F0ZWdvcmllczpYQXhpc0FycixcclxuICAgICAgICAgICAgdGlja0ludGVydmFsOiAxXHJcbiAgICAgICAgfSxcclxuICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogJ+eUtemYu+WAvCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGxvdExpbmVzOiBbe1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDAsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogMSxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMCdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgc2hhcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICB1c2VIVE1MOiB0cnVlLFxyXG4gICAgICAgICAgICBoZWFkZXJGb3JtYXQ6ICc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogMTRweFwiPua4qeW6pjp7cG9pbnQua2V5fTwvc3Bhbj48dGFibGU+JyxcclxuICAgICAgICAgICAgcG9pbnRGb3JtYXQ6ICc8dHI+PHRkIHN0eWxlPVwiY29sb3I6IHtzZXJpZXMuY29sb3J9XCI+e3Nlcmllcy5uYW1lfTogPC90ZD4nICtcclxuICAgICAgICAgICAgJzx0ZCBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0XCI+PGI+e3BvaW50Lnl9PC9iPjwvdGQ+PC90cj4nLFxyXG4gICAgICAgICAgICBmb290ZXJGb3JtYXQ6ICc8L3RhYmxlPicsXHJcbiAgICAgICAgICAgIHZhbHVlRGVjaW1hbHM6IDJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlcmllczogW3tcclxuICAgICAgICAgICAgbmFtZTogJ+eUtemYu+WAvCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHJlc2lzdGFuY2VWYWxcclxuICAgICAgICB9XVxyXG4gICAgfSk7XHJcbn0iXX0=
