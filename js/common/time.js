 define('time', function (require, exports, module) {

     //获取某年的天数数组
     function getDays(year) {
         var year = year ? year : new Date().getFullYear();
         var days = new Array(12);
         days[0] = 31;
         days[2] = 31;
         days[3] = 30;
         days[4] = 31;
         days[5] = 30;
         days[6] = 31;
         days[7] = 31;
         days[8] = 30;
         days[9] = 31;
         days[10] = 30;
         days[11] = 31;
         //判断是否是闰年,针对2月份的天数计算
         if (Math.round(year / 4) == year / 4) {
             days[1] = 29;
         } else {
             days[1] = 28;
         }
         return days;
     }

     //每周的汉语
     function getWeekStr(val){
        if(val==1)return '一';
        if(val==2)return '二';
        if(val==3)return '三';
        if(val==4)return '四';
        if(val==5)return '五';
        if(val==6)return '六';
        if(val==0)return '日';
    }

     //格式化日期加0
     function formatZero(number, length) {
         var length = length ? length : 2;
         while (number.toString().length < length) {
             number = '0' + number;
         }
         return number;
     }

     //纠正周日对应的数字
     function getDayNum(date) {
         return date.getDay() == 0 ? 7 : date.getDay();
     }

     //获取某月属于第几季度
     function getQuarter(month) {
         var month = month ? month : (new Date().getMonth() + 1);
         return Math.ceil(month / 3);
     }

     //获取某年第一周是几天
     function getFirstWeekNum(year) {
         var year = year ? year : new Date().getFullYear();
         var date = new Date(year + '/01/01');
         return 7 - getDayNum(date) + 1;
     }

     //获取某年最后一周是几天
     function getLastWeekNum(year) {
         var year = year ? year : new Date().getFullYear();
         var date = new Date(year + '/12/31');
         return getDayNum(date);
     }

     //获取某年一共有几周
     function getWeekNum(year) {
         var year = year ? year : new Date().getFullYear();
         var days = getDays(year);
         var totalDays = 0;
         for (var i = 0; i < days.length; i++) {
             totalDays += days[i];
         }
         return Math.ceil((totalDays - getFirstWeekNum(year)) / 7) + 1;
     }

     //获取某日期是第几周
     function getWeek(time) {
         var totalDays = 0;
         var date = time ? new Date(time) : new Date();
         var years = date.getFullYear();
         var days = getDays(years);
         if (date.getMonth() == 0) {
             totalDays += date.getDate();
         } else {
             var month = date.getMonth();
             for (var i = 1; i <= month; i++) {
                 totalDays += days[i - 1];
             }
             totalDays += date.getDate();
         }
         var week;
         var firtsWeekDay = getFirstWeekNum(years);
         if (totalDays > firtsWeekDay) {
             week = Math.ceil((totalDays - firtsWeekDay) / 7 + 1);
         } else {
             week = 1;
         }
         return week;
     }

     //获得某年第几周的日期
     function getWeekDates(year, week) {
         var now = new Date();
         var year = year ? year : now.getFullYear();
         var week = week ? week : getWeek(now.getTime());
         var days = getDays(year);
         var firstWeekDay = getFirstWeekNum(year);
         var totalDays = (parseInt(week) - 1) * 7 + firstWeekDay;
         var overDays = totalDays;
         var month = 0,
             start, end, result;
         var weekNum = getWeekNum(year);
         //当到最后一周的时候单独处理
         if (week == weekNum) {
             return {
                 start: {
                     month: 12,
                     date: formatZero(31 - getLastWeekNum(year) + 1)
                 },
                 end: {
                     month: 12,
                     date: 31
                 }
             }
         } else if (week > weekNum) {
             //当大于最后一周的时候
             return undefined;
         }
         for (var i = 0; i < days.length; i++) {
             month = i;
             if (overDays >= days[i]) {
                 overDays -= days[i];
             } else {
                 if (overDays < 7) {
                     //这周不在一个月里面
                     if (month == 0) {
                         //如果是第一周
                         start = 1;
                         end = overDays;
                         result = {
                             start: {
                                 month: 1,
                                 date: formatZero(start)
                             },
                             end: {
                                 month: 1,
                                 date: formatZero(end)
                             }
                         };
                     } else {
                         month -= 1;
                         start = days[month] - (6 - overDays);
                         end = overDays;
                         result = {
                             start: {
                                 month: month + 1,
                                 date: formatZero(start)
                             },
                             end: {
                                 month: month + 1 + 1,
                                 date: formatZero(end)
                             }
                         };
                     }

                 } else {
                     start = overDays - 6;
                     end = overDays;
                     result = {
                         start: {
                             month: month + 1,
                             date: formatZero(start)
                         },
                         end: {
                             month: month + 1,
                             date: formatZero(end)
                         }
                     };
                 }
                 break;
             }
         }
         return result;
     }

     //计算某年每月从第几周到第几周
     function getMonthWeeks(year, month) {
         var now = new Date();
         var year = year ? year : now.getFullYear();
         var month = month ? month : (now.getMonth() + 1);
         var date = new Date(year + '/' + month + '/01');
         var first = getDayNum(date);
         var start, end;
         if (first == 1 || month == 1) {
             start = getWeek(date);
         } else {
             start = getWeek(date) + 1;
         }
         end = getWeek(new Date(year + '/' + month + '/' + getDays(year)[month - 1]));
         return {
             start: start,
             end: end
         };
     }


     //获取某年周分布图
     function getWeekDetails(year) {
         var year = year ? year : new Date().getFullYear();
         var result = [];
         for (var i = 0; i <= 11; i++) {
             result[i] ={month:i+1,weeks:[]};
             var monthWeeks = getMonthWeeks(year, i+1);
             for (var j = monthWeeks.start; j <= monthWeeks.end; j++) {
                 result[i].weeks.push({week:j,weekDates:getWeekDates(year, j)});
             }
         }
         return result;
     }

     module.exports = {
         getDays: getDays, //获取某年的天数数组
         getWeekStr:getWeekStr,//每周的汉语
         getDayNum: getDayNum, //纠正周日对应的数字
         formatZero: formatZero, //格式化数字加0
         getQuarter:getQuarter,//获取某月属于第几季度
         getFirstWeekNum: getFirstWeekNum, //获取某年第一周是几天
         getLastWeekNum: getLastWeekNum, //获取某年最后一周是几天
         getWeekNum: getWeekNum, //获取某年一共有几周
         getWeek: getWeek, //获取某日期是第几周
         getWeekDates: getWeekDates, //获得某年第几周的日期
         getMonthWeeks: getMonthWeeks, //计算某年每月从第几周到第几周
         getWeekDetails: getWeekDetails //获取某年周分布图
     }

 })