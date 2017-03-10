'use strict';

/**
 * Created by Administrator on 2017/3/9.
 */
;(function ($) {
    /**
     * varK：参数k
     * temperatureVal：温度数组
     * resistanceVal：电阻数组
     * highcharts1 第一张图标
     * highcharts2 第二张图标
     * */
    var varK = 1;
    var temperatureVal = [];
    var resistanceVal = [];
    var highcharts1;
    var highcharts2;
    $('#k').val(varK);

    function setResult(temperatureVal, resistanceVal, k) {
        console.log(k);
        var result = [];
        for (var i = 0; i < temperatureVal.length; i++) {
            //ROUND(4096*$B2/($B2+10),0)
            result.push(Math.round(4096 * resistanceVal[i] / (resistanceVal[i] + k)));
        }
        console.log(result);
        $('#result').val(result.join('\n'));

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
                text: $('#formula').text()
            },
            subtitle: {
                text: '公式'
            },
            xAxis: {
                categories: temperatureVal,
                tickInterval: 1
            },
            yAxis: {
                title: {
                    text: 'result'
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
                pointFormat: '<tr><td style="color: {series.color}">参数k</td><td><b>' + k + '</b></td></tr><tr><td style="color: {series.color}">{series.name}: </td>' + '<td style="text-align: right"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                valueDecimals: 2
            },
            series: [{
                name: $('#formula').text(),
                data: result
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
                categories: temperatureVal,
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

    $('#k').bind('keyup mouseup', function () {
        varK = parseFloat(this.value);
        if (!varK) {
            varK = 1;
        }
        if (temperatureVal.length === 0 || resistanceVal.length === 0 || temperatureVal.length !== resistanceVal.length) {
            console.log("参数为空或参数长度不同");
        } else {
            setResult(temperatureVal, resistanceVal, varK);
        }
    });

    /*  $('#compute').bind('click',function (e) {
          temperatureVal=$('#temperature').val().split('\n');
          resistanceVal=$('#resistance').val().split('\n');
            temperatureVal=removeSpaceInArr(temperatureVal);
          resistanceVal=removeSpaceInArr(resistanceVal);
          if(temperatureVal.length === 0|| resistanceVal.length === 0 ||temperatureVal.length !== resistanceVal.length){
              highcharts1.destroy();
              highcharts2.destroy();
              alert("参数为空或参数长度不同");
              return false;
          }else{
              setResult(temperatureVal,resistanceVal,varK);
          }
        })*/
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIiQiLCJ2YXJLIiwidGVtcGVyYXR1cmVWYWwiLCJyZXNpc3RhbmNlVmFsIiwiaGlnaGNoYXJ0czEiLCJoaWdoY2hhcnRzMiIsInZhbCIsInNldFJlc3VsdCIsImsiLCJjb25zb2xlIiwibG9nIiwicmVzdWx0IiwiaSIsImxlbmd0aCIsInB1c2giLCJNYXRoIiwicm91bmQiLCJqb2luIiwiSGlnaGNoYXJ0cyIsImNoYXJ0IiwicGxvdEJvcmRlcldpZHRoIiwiY3JlZGl0cyIsImVuYWJsZWQiLCJleHBvcnRpbmciLCJ0aXRsZSIsInRleHQiLCJzdWJ0aXRsZSIsInhBeGlzIiwiY2F0ZWdvcmllcyIsInRpY2tJbnRlcnZhbCIsInlBeGlzIiwicGxvdExpbmVzIiwidmFsdWUiLCJ3aWR0aCIsImNvbG9yIiwidG9vbHRpcCIsInNoYXJlZCIsInVzZUhUTUwiLCJoZWFkZXJGb3JtYXQiLCJwb2ludEZvcm1hdCIsImZvb3RlckZvcm1hdCIsInZhbHVlRGVjaW1hbHMiLCJzZXJpZXMiLCJuYW1lIiwiZGF0YSIsImJpbmQiLCJwYXJzZUZsb2F0IiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7QUFHQSxDQUFDLENBQUMsVUFBU0EsQ0FBVCxFQUFXO0FBQ1Q7Ozs7Ozs7QUFPQSxRQUFJQyxPQUFLLENBQVQ7QUFDQSxRQUFJQyxpQkFBZSxFQUFuQjtBQUNBLFFBQUlDLGdCQUFjLEVBQWxCO0FBQ0EsUUFBSUMsV0FBSjtBQUNBLFFBQUlDLFdBQUo7QUFDQUwsTUFBRSxJQUFGLEVBQVFNLEdBQVIsQ0FBWUwsSUFBWjs7QUFFQSxhQUFTTSxTQUFULENBQW1CTCxjQUFuQixFQUFrQ0MsYUFBbEMsRUFBZ0RLLENBQWhELEVBQW1EO0FBQy9DQyxnQkFBUUMsR0FBUixDQUFZRixDQUFaO0FBQ0EsWUFBSUcsU0FBTyxFQUFYO0FBQ0EsYUFBSSxJQUFJQyxJQUFFLENBQVYsRUFBWUEsSUFBRVYsZUFBZVcsTUFBN0IsRUFBb0NELEdBQXBD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QUFDSCxTQUZELE1BRUs7QUFDREgsc0JBQVVMLGNBQVYsRUFBeUJDLGFBQXpCLEVBQXVDRixJQUF2QztBQUNIO0FBRUosS0FYRDs7QUFhRjs7Ozs7Ozs7Ozs7Ozs7QUFpQkQsQ0E5SUEsRUE4SUU4QyxNQTlJRiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEFkbWluaXN0cmF0b3Igb24gMjAxNy8zLzkuXHJcbiAqL1xyXG47KGZ1bmN0aW9uKCQpe1xyXG4gICAgLyoqXHJcbiAgICAgKiB2YXJL77ya5Y+C5pWwa1xyXG4gICAgICogdGVtcGVyYXR1cmVWYWzvvJrmuKnluqbmlbDnu4RcclxuICAgICAqIHJlc2lzdGFuY2VWYWzvvJrnlLXpmLvmlbDnu4RcclxuICAgICAqIGhpZ2hjaGFydHMxIOesrOS4gOW8oOWbvuagh1xyXG4gICAgICogaGlnaGNoYXJ0czIg56ys5LqM5byg5Zu+5qCHXHJcbiAgICAgKiAqL1xyXG4gICAgdmFyIHZhcks9MTtcclxuICAgIHZhciB0ZW1wZXJhdHVyZVZhbD1bXTtcclxuICAgIHZhciByZXNpc3RhbmNlVmFsPVtdO1xyXG4gICAgdmFyIGhpZ2hjaGFydHMxO1xyXG4gICAgdmFyIGhpZ2hjaGFydHMyO1xyXG4gICAgJCgnI2snKS52YWwodmFySyk7XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0UmVzdWx0KHRlbXBlcmF0dXJlVmFsLHJlc2lzdGFuY2VWYWwsaykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGspXHJcbiAgICAgICAgdmFyIHJlc3VsdD1bXTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRlbXBlcmF0dXJlVmFsLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAvL1JPVU5EKDQwOTYqJEIyLygkQjIrMTApLDApXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKChNYXRoLnJvdW5kKDQwOTYqcmVzaXN0YW5jZVZhbFtpXS8ocmVzaXN0YW5jZVZhbFtpXStrKSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgICAgICAkKCcjcmVzdWx0JykudmFsKHJlc3VsdC5qb2luKCdcXG4nKSk7XHJcblxyXG4gICAgICAgIGhpZ2hjaGFydHMxID0gSGlnaGNoYXJ0cy5jaGFydCgnaGNoYXJ0c0JveCcsIHtcclxuICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgIHBsb3RCb3JkZXJXaWR0aDogMVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjcmVkaXRzOiB7XHJcbiAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBleHBvcnRpbmc6e1xyXG4gICAgICAgICAgICAgICAgZW5hYmxlZDp0cnVlICAvL+i/memHjGZhbHNlIOS/ruaUueS4unRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6ICQoJyNmb3JtdWxhJykudGV4dCgpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1YnRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAn5YWs5byPJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllczp0ZW1wZXJhdHVyZVZhbCxcclxuICAgICAgICAgICAgICAgIHRpY2tJbnRlcnZhbDogMSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ3Jlc3VsdCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwbG90TGluZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDAwJ1xyXG4gICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgc2hhcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdXNlSFRNTDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGhlYWRlckZvcm1hdDogJzxzcGFuIHN0eWxlPVwiZm9udC1zaXplOiAxNHB4XCI+5rip5bqmOntwb2ludC5rZXl9PC9zcGFuPjx0YWJsZT4nLFxyXG4gICAgICAgICAgICAgICAgcG9pbnRGb3JtYXQ6ICc8dHI+PHRkIHN0eWxlPVwiY29sb3I6IHtzZXJpZXMuY29sb3J9XCI+5Y+C5pWwazwvdGQ+PHRkPjxiPicraysnPC9iPjwvdGQ+PC90cj48dHI+PHRkIHN0eWxlPVwiY29sb3I6IHtzZXJpZXMuY29sb3J9XCI+e3Nlcmllcy5uYW1lfTogPC90ZD4nICtcclxuICAgICAgICAgICAgICAgICc8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodFwiPjxiPntwb2ludC55fTwvYj48L3RkPjwvdHI+JyxcclxuICAgICAgICAgICAgICAgIGZvb3RlckZvcm1hdDogJzwvdGFibGU+JyxcclxuICAgICAgICAgICAgICAgIHZhbHVlRGVjaW1hbHM6IDJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBbe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJCgnI2Zvcm11bGEnKS50ZXh0KCksXHJcbiAgICAgICAgICAgICAgICBkYXRhOiByZXN1bHRcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuICAgICAgICBoaWdoY2hhcnRzMiA9IEhpZ2hjaGFydHMuY2hhcnQoJ2hjaGFydHNCb3gyJywge1xyXG4gICAgICAgICAgICBjaGFydDoge1xyXG4gICAgICAgICAgICAgICAgcGxvdEJvcmRlcldpZHRoOiAxXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGV4cG9ydGluZzp7XHJcbiAgICAgICAgICAgICAgICBlbmFibGVkOnRydWUgIC8v6L+Z6YeMZmFsc2Ug5L+u5pS55Li6dHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjcmVkaXRzOiB7XHJcbiAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogJ+a4qeW6puKAlOeUtemYu+WAvCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6dGVtcGVyYXR1cmVWYWwsXHJcbiAgICAgICAgICAgICAgICB0aWNrSW50ZXJ2YWw6IDEsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICfnlLXpmLvlgLwnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcGxvdExpbmVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMCdcclxuICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHNoYXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHVzZUhUTUw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJGb3JtYXQ6ICc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogMTRweFwiPua4qeW6pjp7cG9pbnQua2V5fTwvc3Bhbj48dGFibGU+JyxcclxuICAgICAgICAgICAgICAgIHBvaW50Rm9ybWF0OiAnPHRyPjx0ZCBzdHlsZT1cImNvbG9yOiB7c2VyaWVzLmNvbG9yfVwiPntzZXJpZXMubmFtZX06IDwvdGQ+JyArXHJcbiAgICAgICAgICAgICAgICAnPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHRcIj48Yj57cG9pbnQueX08L2I+PC90ZD48L3RyPicsXHJcbiAgICAgICAgICAgICAgICBmb290ZXJGb3JtYXQ6ICc8L3RhYmxlPicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZURlY2ltYWxzOiAyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogW3tcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfnlLXpmLvlgLwnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogcmVzaXN0YW5jZVZhbFxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICQoJyNrJykuYmluZCgna2V5dXAgbW91c2V1cCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXJLPXBhcnNlRmxvYXQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgaWYoIXZhcksgKXtcclxuICAgICAgICAgICAgdmFySz0xXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRlbXBlcmF0dXJlVmFsLmxlbmd0aCA9PT0gMHx8IHJlc2lzdGFuY2VWYWwubGVuZ3RoID09PSAwIHx8IHRlbXBlcmF0dXJlVmFsLmxlbmd0aCAhPT0gcmVzaXN0YW5jZVZhbC5sZW5ndGgpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuWPguaVsOS4uuepuuaIluWPguaVsOmVv+W6puS4jeWQjFwiKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgc2V0UmVzdWx0KHRlbXBlcmF0dXJlVmFsLHJlc2lzdGFuY2VWYWwsdmFySylcclxuICAgICAgICB9XHJcblxyXG4gICAgfSlcclxuXHJcbiAgLyogICQoJyNjb21wdXRlJykuYmluZCgnY2xpY2snLGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdGVtcGVyYXR1cmVWYWw9JCgnI3RlbXBlcmF0dXJlJykudmFsKCkuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgIHJlc2lzdGFuY2VWYWw9JCgnI3Jlc2lzdGFuY2UnKS52YWwoKS5zcGxpdCgnXFxuJyk7XHJcblxyXG4gICAgICAgIHRlbXBlcmF0dXJlVmFsPXJlbW92ZVNwYWNlSW5BcnIodGVtcGVyYXR1cmVWYWwpO1xyXG4gICAgICAgIHJlc2lzdGFuY2VWYWw9cmVtb3ZlU3BhY2VJbkFycihyZXNpc3RhbmNlVmFsKTtcclxuICAgICAgICBpZih0ZW1wZXJhdHVyZVZhbC5sZW5ndGggPT09IDB8fCByZXNpc3RhbmNlVmFsLmxlbmd0aCA9PT0gMCB8fHRlbXBlcmF0dXJlVmFsLmxlbmd0aCAhPT0gcmVzaXN0YW5jZVZhbC5sZW5ndGgpe1xyXG4gICAgICAgICAgICBoaWdoY2hhcnRzMS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIGhpZ2hjaGFydHMyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgYWxlcnQoXCLlj4LmlbDkuLrnqbrmiJblj4LmlbDplb/luqbkuI3lkIxcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgc2V0UmVzdWx0KHRlbXBlcmF0dXJlVmFsLHJlc2lzdGFuY2VWYWwsdmFySyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pKi9cclxuXHJcbn0pKGpRdWVyeSk7XHJcbiJdfQ==
