'use strict';

/**
 * Created by Administrator on 2017/3/9.
 */
;(function ($) {
    var fomulaData = null;
    var formula = null;
    var formulaParameterForOneHtml = '';
    var formulaParameterForArrHtml = '';
    var canExportExcel=false;
    $.ajax({
        url: "./../config.json",
        type: "GET",
        cache: false,
        success: function success(data) {
            console.log(data);
            fomulaData = data;
            for (var i = 0; i < data.length; i++) {
                $('#formula').append("<option value='" + data[i].key + "'>" + data[i].formulaName + "</option>");
            }
        }
    });
    $('#formula').bind('change', function (e) {
        canExportExcel=false;
        formula = parseInt($(this).val());
        console.log(formula);
        if (isNaN(formula)) {
            return false;
        }
        formulaParameterForOneHtml = '';
        formulaParameterForArrHtml = '';
        console.log(fomulaData[formula].formulaParameterForOne);
        for (var i = 0; i < fomulaData[formula].formulaParameterForOne.length; i++) {
            formulaParameterForOneHtml += "<tr><td>" + fomulaData[formula].formulaParameterForOne[i] + "</td><td> <input type='text' id='" + fomulaData[formula].formulaParameterForOne[i] + "'/></td></tr> ";
        }

        formulaParameterForArrHtml += "<div>\
                    <h4>" + fomulaData[formula].XAxis + "</h4>\
                    <textarea name='' id='" + fomulaData[formula].XAxis + "' ></textarea>\
                </div> ";
        for (var i = 0; i < fomulaData[formula].formulaParameterForArr.length; i++) {
            formulaParameterForArrHtml += "<div >\
                    <h4>" + fomulaData[formula].formulaParameterForArr[i] + "</h4>\
                    <textarea name='' id='" + fomulaData[formula].formulaParameterForArr[i] + "' ></textarea>\
                </div> ";
        }
        formulaParameterForArrHtml += "<div>\
                    <h4>result</h4>\
                    <textarea name='' id='result' ></textarea>\
                </div> ";
        $('.left-parameter').html(formulaParameterForArrHtml);
        $('.formulaParameterForOne table').html(formulaParameterForOneHtml);

        for(var z=0;z<$('.formulaParameterForOne input').length;z++){
            $('.formulaParameterForOne input').eq(z).bind('keyup',function () {
                canExportExcel=false;
            })
        }
        for(var y=0;y<$('.left-parameter textarea').length;y++){
            $('.left-parameter textarea').eq(y).bind('keyup',function () {
                canExportExcel=false;
            })
        }

    });

    $('#compute').bind('click', function (e) {
        switch (formula) {
            case 0:
                var varK = parseFloat($('#K').val());
                var temperatureVal_0 = [];
                var resistanceVal_0 = [];
                var resultArr_0 = [];
                temperatureVal_0 = $('#T').val().split('\n');
                resistanceVal_0 = $('#R').val().split('\n');

                temperatureVal_0 = removeSpaceInArr(temperatureVal_0);
                resistanceVal_0 = removeSpaceInArr(resistanceVal_0);
                if (!varK || temperatureVal_0.length === 0 || resistanceVal_0.length === 0 || temperatureVal_0.length !== resistanceVal_0.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var i = 0; i < temperatureVal_0.length; i++) {
                        //ROUND(4096*$B2/($B2+10),0)
                        resultArr_0.push(Math.round(4096 * resistanceVal_0[i] / (resistanceVal_0[i] + varK)));
                    }
                    $('#result').val(resultArr_0.join('\n'));
                    setResult(temperatureVal_0, resistanceVal_0, resultArr_0, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit);
                    canExportExcel=true;

                }
                return;
            case 1:
            var Vcc = parseFloat($('#Vcc').val());
            var R1 = parseFloat($('#R1').val());
            var R2 = parseFloat($('#R2').val());
            var R3 = parseFloat($('#R3').val());
            var Rx = parseFloat($('#Rx').val());
            var temperatureVal_1 = [];
            var resistanceVal_1 = [];
            var resultArr_1 = [];
            temperatureVal_1 = $('#T').val().split('\n');
            resistanceVal_1 = $('#R').val().split('\n');
            temperatureVal_1 = removeSpaceInArr(temperatureVal_1);
            resistanceVal_1 = removeSpaceInArr(resistanceVal_1);
            if (!Vcc || !R1 || !R2 || !R3 || !Rx || temperatureVal_1.length === 0 || resistanceVal_1.length === 0 || temperatureVal_1.length !== resistanceVal_1.length) {
                alert("参数为空或参数长度不同");
                return false;
            } else {
                for (var k = 0; k < temperatureVal_1.length; k++) {
                    //(Vcc /(R1 + ((R2+R3) * R)/((R2+R3) + R))*R/((R2+R3)+R))*R3
                    resultArr_1.push(Vcc / (R1 + (R2 + R3) * resistanceVal_1[k] / (R2 + R3 + resistanceVal_1[k])) * resistanceVal_1[k] / (R2 + R3 + resistanceVal_1[k]) * R3);
                }
                $('#result').val(resultArr_1.join('\n'));
                setResult(temperatureVal_1, resistanceVal_1, resultArr_1, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit);
                canExportExcel=true;
            }

            return;
            case 2:
                var Y = parseFloat($('#Y').val());
                var ZVal = [];
                var KVal = [];
                var XVal=[];
                var resultArr_2 = [];
                XVal = $('#X').val().split('\n');
                KVal = $('#K').val().split('\n');
                ZVal = $('#Z').val().split('\n');

                XVal = removeSpaceInArr(XVal);
                KVal = removeSpaceInArr(KVal);
                ZVal = removeSpaceInArr(ZVal);
                if (!Y || XVal.length === 0 || KVal.length === 0 || ZVal.length === 0 || ZVal.length !== KVal.length) {
                    alert("参数为空或参数长度不同");
                    return false;
                } else {
                    for (var k = 0; k < XVal.length; k++) {
                        //(Vcc /(R1 + ((R2+R3) * R)/((R2+R3) + R))*R/((R2+R3)+R))*R3
                        resultArr_2.push(XVal[k]+Y+ZVal[k]+KVal[k]);
                    }
                    $('#result').val(resultArr_2.join('\n'));
                    setResult(XVal, ZVal, resultArr_2, fomulaData[formula].formulaName, fomulaData[formula].XAxis, fomulaData[formula].XAxisUnit);
                    canExportExcel=true;
                }

                return;
            default:
                return;
        }
    });

    $('#export').bind('click', function (e) {
        if(!canExportExcel){
            alert('请先计算结果再进行导出');
            return false;
        }
        var formulaName = $("#formula option:selected").text();
        console.log(formulaName);
        var formulaParameterForOneTrs = $('.formulaParameterForOne table tr');
        var formulaParameterForOneArr = [];
        for (var i = 0; i < formulaParameterForOneTrs.length; i++) {
            var forOneKey = $(formulaParameterForOneTrs[i]).find('td :eq(0)').text();
            var forOneValue = $(formulaParameterForOneTrs[i]).find('input').val();
            formulaParameterForOneArr.push({
                forOneKey: forOneKey,
                forOneValue: forOneValue
            });
        }
        console.log(formulaParameterForOneArr);
        var formulaParameterForArrDivs = $('.left-parameter div');
        var formulaParameterForArrArr = [];
        for (var j = 0; j < formulaParameterForArrDivs.length; j++) {
            var forArrKey = $(formulaParameterForArrDivs[j]).find('h4 :eq(0)').text();
            var forArrValue = removeSpaceInArr($(formulaParameterForArrDivs[j]).find('textarea').val().split('\n'));
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
            dataType:'json',
            data: sendExportData,
            success: function success(data) {

                console.log(data);
                if(data===true){
                    $('.mask').css({display:'block'});
                }
            }
        });
        $(".mask").bind('click', function (e) {
            console.log(e.target.classList.value);
            if (e.target.classList.value === 'mask') {
                $(this).css({ display: 'none' });
            }
        });
        $("#download").bind('click', function (e) {
            $('.mask').css({display:'none'});
        });
    });


})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNob3NlRm9ybXVsYS5qcyJdLCJuYW1lcyI6WyIkIiwiZm9tdWxhRGF0YSIsImZvcm11bGEiLCJmb3JtdWxhUGFyYW1ldGVyRm9yT25lSHRtbCIsImZvcm11bGFQYXJhbWV0ZXJGb3JBcnJIdG1sIiwiYWpheCIsInVybCIsInR5cGUiLCJjYWNoZSIsInN1Y2Nlc3MiLCJkYXRhIiwiY29uc29sZSIsImxvZyIsImkiLCJsZW5ndGgiLCJhcHBlbmQiLCJrZXkiLCJmb3JtdWxhTmFtZSIsImJpbmQiLCJlIiwicGFyc2VJbnQiLCJ2YWwiLCJpc05hTiIsImZvcm11bGFQYXJhbWV0ZXJGb3JPbmUiLCJYQXhpcyIsImZvcm11bGFQYXJhbWV0ZXJGb3JBcnIiLCJodG1sIiwidmFySyIsInBhcnNlRmxvYXQiLCJ0ZW1wZXJhdHVyZVZhbF8wIiwicmVzaXN0YW5jZVZhbF8wIiwicmVzdWx0QXJyXzAiLCJzcGxpdCIsInJlbW92ZVNwYWNlSW5BcnIiLCJhbGVydCIsInB1c2giLCJNYXRoIiwicm91bmQiLCJqb2luIiwic2V0UmVzdWx0IiwiWEF4aXNVbml0IiwiVmNjIiwiUjEiLCJSMiIsIlIzIiwiUngiLCJ0ZW1wZXJhdHVyZVZhbF8xIiwicmVzaXN0YW5jZVZhbF8xIiwicmVzdWx0QXJyXzEiLCJrIiwidGV4dCIsImZvcm11bGFQYXJhbWV0ZXJGb3JPbmVUcnMiLCJmb3JtdWxhUGFyYW1ldGVyRm9yT25lQXJyIiwiZm9yT25lS2V5IiwiZmluZCIsImZvck9uZVZhbHVlIiwiZm9ybXVsYVBhcmFtZXRlckZvckFyckRpdnMiLCJmb3JtdWxhUGFyYW1ldGVyRm9yQXJyQXJyIiwiaiIsImZvckFycktleSIsImZvckFyclZhbHVlIiwic2VuZEV4cG9ydERhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7QUFHQSxDQUFDLENBQUMsVUFBU0EsQ0FBVCxFQUFXO0FBQ1QsUUFBSUMsYUFBVyxJQUFmO0FBQ0EsUUFBSUMsVUFBUSxJ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QixFQUE5QjtBQUNBLGFBQUksSUFBSUMsSUFBRSxDQUFWLEVBQVlBLElBQUVGLDJCQUEyQjFDLE1BQXpDLEVBQWdENEMsR0FBaEQsRUFBb0Q7QUFDaEQsZ0JBQUlDLFlBQVUzRCxFQUFFd0QsMkJBQTJCRSxDQUEzQixDQUFGLEVBQWlDSixJQUFqQyxDQUFzQyxXQUF0QyxFQUFtREosSUFBbkQsRUFBZDtBQUNBLGdCQUFJVSxjQUFZM0IsaUJBQWlCakMsRUFBRXdELDJCQUEyQkUsQ0FBM0IsQ0FBRixFQUFpQ0osSUFBakMsQ0FBc0MsVUFBdEMsRUFBa0RqQyxHQUFsRCxHQUF3RFcsS0FBeEQsQ0FBOEQsSUFBOUQsQ0FBakIsQ0FBaEI7QUFDQXlCLHNDQUEwQnRCLElBQTFCLENBQStCO0FBQzNCd0Isb0NBRDJCO0FBRTNCQztBQUYyQixhQUEvQjtBQUlIO0FBQ0QsWUFBSUMsaUJBQWU7QUFDZjVDLHlCQUFZQSxXQURHO0FBRWZNLG9DQUF1QjZCLHlCQUZSO0FBR2YzQixvQ0FBdUJnQztBQUhSLFNBQW5CO0FBS0E5QyxnQkFBUUMsR0FBUixDQUFZaUQsY0FBWjtBQUNBN0QsVUFBRUssSUFBRixDQUFPO0FBQ0hDLGlCQUFLLGFBREY7QUFFSEMsa0JBQU0sTUFGSDtBQUdIRyxrQkFBTW9ELEtBQUtDLFNBQUwsQ0FBZUYsY0FBZixDQUhIO0FBSUhwRCxxQkFBUyxpQkFBU0MsSUFBVCxFQUFjO0FBQ25CQyx3QkFBUUMsR0FBUixDQUFZRixJQUFaO0FBQ0g7QUFORSxTQUFQO0FBUUgsS0F0Q0Q7QUF3Q0gsQ0FySkEsRUFxSkVzRCxNQXJKRiIsImZpbGUiOiJjaG9zZUZvcm11bGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ3JlYXRlZCBieSBBZG1pbmlzdHJhdG9yIG9uIDIwMTcvMy85LlxyXG4gKi9cclxuOyhmdW5jdGlvbigkKXtcclxuICAgIHZhciBmb211bGFEYXRhPW51bGw7XHJcbiAgICB2YXIgZm9ybXVsYT1udWxsO1xyXG4gICAgdmFyIGZvcm11bGFQYXJhbWV0ZXJGb3JPbmVIdG1sPScnO1xyXG4gICAgdmFyIGZvcm11bGFQYXJhbWV0ZXJGb3JBcnJIdG1sPScnO1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IFwiLi8uLi9jb25maWcuanNvblwiLFxyXG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXHJcbiAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgZm9tdWxhRGF0YT1kYXRhO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPGRhdGEubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAkKCcjZm9ybXVsYScpLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiK2RhdGFbaV0ua2V5K1wiJz5cIitkYXRhW2ldLmZvcm11bGFOYW1lK1wiPC9vcHRpb24+XCIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgICQoJyNmb3JtdWxhJykuYmluZCgnY2hhbmdlJyxmdW5jdGlvbiAoZSkge1xyXG5cclxuICAgICAgICAvLyBpZihoaWdoY2hhcnRzMSAmJiBoaWdoY2hhcnRzMil7XHJcbiAgICAgICAgLy8gICAgIGhpZ2hjaGFydHMxLmRlc3Ryb3koKTtcclxuICAgICAgICAvLyAgICAgaGlnaGNoYXJ0czIuZGVzdHJveSgpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgZm9ybXVsYT1wYXJzZUludCgkKHRoaXMpLnZhbCgpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhmb3JtdWxhKTtcclxuICAgICAgICBpZihpc05hTihmb3JtdWxhKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3JtdWxhUGFyYW1ldGVyRm9yT25lSHRtbD0nJztcclxuICAgICAgICBmb3JtdWxhUGFyYW1ldGVyRm9yQXJySHRtbD0nJztcclxuICAgICAgICBjb25zb2xlLmxvZyhmb211bGFEYXRhW2Zvcm11bGFdLmZvcm11bGFQYXJhbWV0ZXJGb3JPbmUpXHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxmb211bGFEYXRhW2Zvcm11bGFdLmZvcm11bGFQYXJhbWV0ZXJGb3JPbmUubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGZvcm11bGFQYXJhbWV0ZXJGb3JPbmVIdG1sKz1cIjx0cj48dGQ+XCIrZm9tdWxhRGF0YVtmb3JtdWxhXS5mb3JtdWxhUGFyYW1ldGVyRm9yT25lW2ldK1wiPC90ZD48dGQ+IDxpbnB1dCB0eXBlPSd0ZXh0JyBpZD0nXCIrZm9tdWxhRGF0YVtmb3JtdWxhXS5mb3JtdWxhUGFyYW1ldGVyRm9yT25lW2ldK1wiJy8+PC90ZD48L3RyPiBcIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9ybXVsYVBhcmFtZXRlckZvckFyckh0bWwrPVwiPGRpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxoND5cIitmb211bGFEYXRhW2Zvcm11bGFdLlhBeGlzK1wiPC9oND5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPScnIGlkPSdcIitmb211bGFEYXRhW2Zvcm11bGFdLlhBeGlzK1wiJyA+PC90ZXh0YXJlYT5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+IFwiO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8Zm9tdWxhRGF0YVtmb3JtdWxhXS5mb3JtdWxhUGFyYW1ldGVyRm9yQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBmb3JtdWxhUGFyYW1ldGVyRm9yQXJySHRtbCs9XCI8ZGl2ID5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxoND5cIitmb211bGFEYXRhW2Zvcm11bGFdLmZvcm11bGFQYXJhbWV0ZXJGb3JBcnJbaV0rXCI8L2g0PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9JycgaWQ9J1wiK2ZvbXVsYURhdGFbZm9ybXVsYV0uZm9ybXVsYVBhcmFtZXRlckZvckFycltpXStcIicgPjwvdGV4dGFyZWE+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2PiBcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9ybXVsYVBhcmFtZXRlckZvckFyckh0bWwrPVwiPGRpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxoND5yZXN1bHQ8L2g0PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9JycgaWQ9J3Jlc3VsdCcgPjwvdGV4dGFyZWE+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2PiBcIjtcclxuICAgICAgICAkKCcubGVmdC1wYXJhbWV0ZXInKS5odG1sKGZvcm11bGFQYXJhbWV0ZXJGb3JBcnJIdG1sKTtcclxuICAgICAgICAkKCcuZm9ybXVsYVBhcmFtZXRlckZvck9uZSB0YWJsZScpLmh0bWwoZm9ybXVsYVBhcmFtZXRlckZvck9uZUh0bWwpXHJcbiAgICB9KVxyXG5cclxuICAgICQoJyNjb21wdXRlJykuYmluZCgnY2xpY2snLGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgc3dpdGNoIChmb3JtdWxhKXtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgdmFyIHZhcks9cGFyc2VGbG9hdCggJCgnI0snKS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGVyYXR1cmVWYWxfMD1bXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNpc3RhbmNlVmFsXzA9W107XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0QXJyXzA9W107XHJcbiAgICAgICAgICAgICAgICB0ZW1wZXJhdHVyZVZhbF8wPSQoJyNUJykudmFsKCkuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgICAgICAgICAgcmVzaXN0YW5jZVZhbF8wPSQoJyNSJykudmFsKCkuc3BsaXQoJ1xcbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRlbXBlcmF0dXJlVmFsXzA9cmVtb3ZlU3BhY2VJbkFycih0ZW1wZXJhdHVyZVZhbF8wKTtcclxuICAgICAgICAgICAgICAgIHJlc2lzdGFuY2VWYWxfMD1yZW1vdmVTcGFjZUluQXJyKHJlc2lzdGFuY2VWYWxfMCk7XHJcbiAgICAgICAgICAgICAgICBpZiggIXZhcksgfHwgdGVtcGVyYXR1cmVWYWxfMC5sZW5ndGggPT09IDB8fCByZXNpc3RhbmNlVmFsXzAubGVuZ3RoID09PSAwIHx8dGVtcGVyYXR1cmVWYWxfMC5sZW5ndGggIT09IHJlc2lzdGFuY2VWYWxfMC5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5Y+C5pWw5Li656m65oiW5Y+C5pWw6ZW/5bqm5LiN5ZCMXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dGVtcGVyYXR1cmVWYWxfMC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9ST1VORCg0MDk2KiRCMi8oJEIyKzEwKSwwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBcnJfMC5wdXNoKChNYXRoLnJvdW5kKDQwOTYqcmVzaXN0YW5jZVZhbF8wW2ldLyhyZXNpc3RhbmNlVmFsXzBbaV0rdmFySykpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICQoJyNyZXN1bHQnKS52YWwocmVzdWx0QXJyXzAuam9pbignXFxuJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFJlc3VsdCh0ZW1wZXJhdHVyZVZhbF8wLHJlc2lzdGFuY2VWYWxfMCxyZXN1bHRBcnJfMCxmb211bGFEYXRhW2Zvcm11bGFdLmZvcm11bGFOYW1lLGZvbXVsYURhdGFbZm9ybXVsYV0uWEF4aXMsZm9tdWxhRGF0YVtmb3JtdWxhXS5YQXhpc1VuaXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICB2YXIgVmNjPXBhcnNlRmxvYXQoICQoJyNWY2MnKS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgUjE9cGFyc2VGbG9hdCggJCgnI1IxJykudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIFIyPXBhcnNlRmxvYXQoICQoJyNSMicpLnZhbCgpKTtcclxuICAgICAgICAgICAgICAgIHZhciBSMz1wYXJzZUZsb2F0KCAkKCcjUjMnKS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgUng9cGFyc2VGbG9hdCggJCgnI1J4JykudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBlcmF0dXJlVmFsXzE9W107XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzaXN0YW5jZVZhbF8xPVtdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdEFycl8xPVtdO1xyXG4gICAgICAgICAgICAgICAgdGVtcGVyYXR1cmVWYWxfMT0kKCcjVCcpLnZhbCgpLnNwbGl0KCdcXG4nKTtcclxuICAgICAgICAgICAgICAgIHJlc2lzdGFuY2VWYWxfMT0kKCcjUicpLnZhbCgpLnNwbGl0KCdcXG4nKTtcclxuICAgICAgICAgICAgICAgIHRlbXBlcmF0dXJlVmFsXzE9cmVtb3ZlU3BhY2VJbkFycih0ZW1wZXJhdHVyZVZhbF8xKTtcclxuICAgICAgICAgICAgICAgIHJlc2lzdGFuY2VWYWxfMT1yZW1vdmVTcGFjZUluQXJyKHJlc2lzdGFuY2VWYWxfMSk7XHJcbiAgICAgICAgICAgICAgICBpZighVmNjIHx8IVIxfHwhUjIgfHwhUjMgfHwgIVJ4IHx8IHRlbXBlcmF0dXJlVmFsXzEubGVuZ3RoID09PSAwfHwgcmVzaXN0YW5jZVZhbF8xLmxlbmd0aCA9PT0gMCB8fHRlbXBlcmF0dXJlVmFsXzEubGVuZ3RoICE9PSByZXNpc3RhbmNlVmFsXzEubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuWPguaVsOS4uuepuuaIluWPguaVsOmVv+W6puS4jeWQjFwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGs9MDtrPHRlbXBlcmF0dXJlVmFsXzEubGVuZ3RoO2srKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vKFZjYyAvKFIxICsgKChSMitSMykgKiBSKS8oKFIyK1IzKSArIFIpKSpSLygoUjIrUjMpK1IpKSpSM1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBcnJfMS5wdXNoKChWY2MgLyhSMSArICgoUjIrUjMpICogcmVzaXN0YW5jZVZhbF8xW2tdKS8oKFIyK1IzKSArIHJlc2lzdGFuY2VWYWxfMVtrXSkpKnJlc2lzdGFuY2VWYWxfMVtrXS8oKFIyK1IzKStyZXNpc3RhbmNlVmFsXzFba10pKSpSMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICQoJyNyZXN1bHQnKS52YWwocmVzdWx0QXJyXzEuam9pbignXFxuJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFJlc3VsdCh0ZW1wZXJhdHVyZVZhbF8xLHJlc2lzdGFuY2VWYWxfMSxyZXN1bHRBcnJfMSxmb211bGFEYXRhW2Zvcm11bGFdLmZvcm11bGFOYW1lLGZvbXVsYURhdGFbZm9ybXVsYV0uWEF4aXMsZm9tdWxhRGF0YVtmb3JtdWxhXS5YQXhpc1VuaXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICAkKCcjZXhwb3J0JykuYmluZCgnY2xpY2snLGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdmFyIGZvcm11bGFOYW1lPSQoXCIjZm9ybXVsYSBvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGZvcm11bGFOYW1lKTtcclxuICAgICAgICB2YXIgZm9ybXVsYVBhcmFtZXRlckZvck9uZVRycz0kKCcuZm9ybXVsYVBhcmFtZXRlckZvck9uZSB0YWJsZSB0cicpO1xyXG4gICAgICAgIHZhciBmb3JtdWxhUGFyYW1ldGVyRm9yT25lQXJyPVtdO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8Zm9ybXVsYVBhcmFtZXRlckZvck9uZVRycy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIGZvck9uZUtleT0kKGZvcm11bGFQYXJhbWV0ZXJGb3JPbmVUcnNbaV0pLmZpbmQoJ3RkIDplcSgwKScpLnRleHQoKVxyXG4gICAgICAgICAgICB2YXIgZm9yT25lVmFsdWU9JChmb3JtdWxhUGFyYW1ldGVyRm9yT25lVHJzW2ldKS5maW5kKCdpbnB1dCcpLnZhbCgpXHJcbiAgICAgICAgICAgIGZvcm11bGFQYXJhbWV0ZXJGb3JPbmVBcnIucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBmb3JPbmVLZXksXHJcbiAgICAgICAgICAgICAgICBmb3JPbmVWYWx1ZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhmb3JtdWxhUGFyYW1ldGVyRm9yT25lQXJyKTtcclxuICAgICAgICB2YXIgZm9ybXVsYVBhcmFtZXRlckZvckFyckRpdnM9JCgnLmxlZnQtcGFyYW1ldGVyIGRpdicpO1xyXG4gICAgICAgIHZhciBmb3JtdWxhUGFyYW1ldGVyRm9yQXJyQXJyPVtdO1xyXG4gICAgICAgIGZvcih2YXIgaj0wO2o8Zm9ybXVsYVBhcmFtZXRlckZvckFyckRpdnMubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgICAgIHZhciBmb3JBcnJLZXk9JChmb3JtdWxhUGFyYW1ldGVyRm9yQXJyRGl2c1tqXSkuZmluZCgnaDQgOmVxKDApJykudGV4dCgpO1xyXG4gICAgICAgICAgICB2YXIgZm9yQXJyVmFsdWU9cmVtb3ZlU3BhY2VJbkFycigkKGZvcm11bGFQYXJhbWV0ZXJGb3JBcnJEaXZzW2pdKS5maW5kKCd0ZXh0YXJlYScpLnZhbCgpLnNwbGl0KCdcXG4nKSk7XHJcbiAgICAgICAgICAgIGZvcm11bGFQYXJhbWV0ZXJGb3JBcnJBcnIucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBmb3JBcnJLZXksXHJcbiAgICAgICAgICAgICAgICBmb3JBcnJWYWx1ZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2VuZEV4cG9ydERhdGE9e1xyXG4gICAgICAgICAgICBmb3JtdWxhTmFtZTpmb3JtdWxhTmFtZSxcclxuICAgICAgICAgICAgZm9ybXVsYVBhcmFtZXRlckZvck9uZTpmb3JtdWxhUGFyYW1ldGVyRm9yT25lQXJyLFxyXG4gICAgICAgICAgICBmb3JtdWxhUGFyYW1ldGVyRm9yQXJyOmZvcm11bGFQYXJhbWV0ZXJGb3JBcnJBcnJcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNlbmRFeHBvcnREYXRhKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IFwiL2FwaS9leHBvcnRcIixcclxuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHNlbmRFeHBvcnREYXRhKSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuXHJcbn0pKGpRdWVyeSk7Il19
