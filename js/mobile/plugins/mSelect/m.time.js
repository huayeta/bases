define('mTime',function(require, exports, module){
	require('zepto');
	require('iscroll');
	require('seajsCss');

	seajs.use('/js/mobile/plugins/mSelect/zepto.mtimer.css');

    var mTime = function(opts){
		var defaults = {
			target:'.j-mTime',
			ishours:true,
            def:'',
            click:'',
			callback : null,
			cancel : null,
		};
		var option = $.extend(defaults, opts);
		var itemHeight = 48;//每个li的高度
		var init=function(){
			var nowTime=new Date();//当前日期对象
			var nowYear=nowTime.getFullYear();//当前年
			var nowMonth=nowTime.getMonth();//当前月
			var nowDate=nowTime.getDate();//当前日
			var nowHours=nowTime.getHours();//当前时
			var nowMinutes=nowTime.getMinutes();//当时分
			var returnVal={};//返回的值
			//填充html
			var $tpl=$('<div class="mt_mask"></div><div class="mt_poppanel"><div class="mt_panel"><h3 class="mt_title">上下滑动选择信息</h3><div class="mt_body"><div class="box1"><div class="j-year"></div><div class="hr"><ul><li></li><li></li><li>-</li></ul></div><div class="j-month"></div><div class="hr"><ul><li></li><li></li><li>-</li></ul></div><div class="j-date"></div>'+(opts.ishours?'<div class="j-hours"></div><div class="hr"><ul><li></li><li></li><li>:</li></ul></div><div class="j-minutes"></div>':'')+'</div><div class="mt_indicate"></div></div><div class="mt_confirm"><a href="javascript:void(0);" class="mt_ok u-btn-blue u-btn-biger">确定</a> <a href="javascript:void(0);" class="mt_cancel u-btn-gray u-btn-biger">取消</a></div></div></div>');
			var $year=$tpl.find('.j-year');
			var $month=$tpl.find('.j-month');
			var $date=$tpl.find('.j-date');
			var $hours=$tpl.find('.j-hours');
			var $minutes=$tpl.find('.j-minutes');
			var tmpTpl='';
			//年
			for(var i=1960;i<nowYear+30;i++){
				tmpTpl=tmpTpl+'<li data-value="'+formateDate(i)+'">'+formateDate(i)+'</li>';
			}
			tmpTpl='<ul><li class="mt_note" data-value="-1">年</li><li data-value="00"></li>'+tmpTpl+'<li></li><li></li></ul>';
			$year.append(tmpTpl);
			//月
			tmpTpl='';
			for(var i=1;i<=12;i++){
				tmpTpl=tmpTpl+'<li data-value="'+formateDate(i)+'">'+formateDate(i)+'</li>';
			}
			tmpTpl='<div><ul><li class="mt_note" data-value="-1">月</li><li data-value="00"></li>'+tmpTpl+'<li></li><li></li></ul></div>';
			$month.append(tmpTpl);
			//日
			tmpTpl='';
			for(var i=1;i<=31;i++){
				tmpTpl=tmpTpl+'<li data-value="'+formateDate(i)+'">'+formateDate(i)+'</li>';
			}
			tmpTpl='<div><ul><li class="mt_note" data-value="-1">日</li><li data-value="00"></li>'+tmpTpl+'<li></li><li></li></ul></div>';
			$date.append(tmpTpl);
			if(opts.ishours){
				//时
				tmpTpl='';
				for(var i=0;i<=23;i++){
					tmpTpl=tmpTpl+'<li data-value="'+formateDate(i)+'">'+formateDate(i)+'</li>';
				}
				tmpTpl='<div><ul><li class="mt_note" data-value="-1">时</li><li data-value="00"></li>'+tmpTpl+'<li></li><li></li></ul></div>';
				$hours.append(tmpTpl);
				//分
				tmpTpl='';
				for(var i=0;i<=59;i++){
					tmpTpl=tmpTpl+'<li data-value="'+formateDate(i)+'">'+formateDate(i)+'</li>';
				}
				tmpTpl='<div><ul><li class="mt_note" data-value="-1">分</li><li data-value="00"></li>'+tmpTpl+'<li></li><li></li></ul></div>';
				$minutes.append(tmpTpl);
			}
			$('body').append($tpl);
			//显示$tpl;
			setTimeout(show,0);
			//绑定事件
			var yearIscroll = new IScroll($year[0], {
			    snap: 'li',
			    tap:true
			});
			var monthIscroll = new IScroll($month[0], {
			    snap: 'li',
			    tap:true
			});
			var dateIscroll = new IScroll($date[0], {
			    snap: 'li',
			    tap:true
			});
			if(opts.ishours){
				var hoursIscroll = new IScroll($hours[0], {
				    snap: 'li',
				    tap:true
				});
				var minutesIscroll = new IScroll($minutes[0], {
				    snap: 'li',
				    tap:true
				});
			}
			//初始化时间
			if(opts.def){
				var reg=/^(\d+?)-(\d+?)-(\d+?)(?:\s+?(\d+?):(\d+?):(\d+?))?$/i;
				//格式“2015-12-12 09:10:00”
				var arr=reg.exec(opts.def);
				if(arr){
					if(opts.ishours){
						opts.defs={year:arr[1],month:arr[2],date:arr[3],hours:arr[4],minutes:arr[5]};
					}else{
						opts.defs={year:arr[1],month:arr[2],date:arr[3]};
					}
				}
			}
			if(!opts.defs)opts.defs={year:nowYear,month:formateDate(nowMonth+1),date:formateDate(nowDate),hours:formateDate(nowHours),minutes:formateDate(nowMinutes)};
			returnVal=$.extend({},opts.defs);
			yearIscroll.on('scrollEnd',function(){
				var index=Math.abs(yearIscroll.y/itemHeight);
				var $li=$year.find('li');
				var $selLi=$li.eq(index+2);
				$li.removeClass('selected');
				$selLi.addClass('selected');
				returnVal.year=$selLi.attr('data-value');
			})
			dateIscroll.on('scrollEnd',function(){
				var index=Math.abs(dateIscroll.y/itemHeight);
				var $li=$date.find('li');
				var $selLi=$li.eq(index+2);
				$li.removeClass('selected');
				$selLi.addClass('selected');
				returnVal.date=$selLi.attr('data-value');
			});
			monthIscroll.on('scrollEnd',function(){
				var index=Math.abs(monthIscroll.y/itemHeight);
				var $li=$month.find('li');
				var $selLi=$li.eq(index+2);
				$li.removeClass('selected');
				$selLi.addClass('selected');
				returnVal.month=$selLi.attr('data-value');
				//计算某月有几日
				// var days=getDays(returnVal.year)[returnVal.month-1];
				// //日
				// tmpTpl='';
				// for(var i=1;i<=days;i++){
				// 	tmpTpl=tmpTpl+'<li data-value="'+formateDate(i)+'">'+formateDate(i)+'</li>';
				// }
				// tmpTpl='<div><ul><li class="mt_note">日</li><li></li>'+tmpTpl+'<li></li><li></li></ul></div>';
				// $date.html(tmpTpl);
				// //销毁dateIscroll;
				// dateIscroll.destroy();
				// dateIscroll=null;
				// //重新初始化dateIscroll
				// dateIscroll = new IScroll($date[0], {
				//     snap: 'li',
				//     tap:true
				// });
				// dateIscroll.on('scrollEnd',function(){
				// 	var index=Math.abs(dateIscroll.y/itemHeight);
				// 	returnVal.date=$date.find('li').eq(index+2).attr('data-value');
				// });
				// dateIscroll.scrollToElement($date.find('li[data-value="'+formateDate(opts.defs.date-2)+'"]')[0]);
			})
			if(opts.ishours){
				hoursIscroll.on('scrollEnd',function(){
					var index=Math.abs(hoursIscroll.y/itemHeight);
					var $li=$hours.find('li');
					var $selLi=$li.eq(index+2);
					$li.removeClass('selected');
					$selLi.addClass('selected');
					returnVal.hours=$selLi.attr('data-value');
				})
				minutesIscroll.on('scrollEnd',function(){
					var index=Math.abs(minutesIscroll.y/itemHeight);
					var $li=$minutes.find('li');
					var $selLi=$li.eq(index+2);
					$li.removeClass('selected');
					$selLi.addClass('selected');
					returnVal.minutes=$selLi.attr('data-value');
				});
			}
			yearIscroll.scrollToElement($year.find('li[data-value="'+formateDate(parseInt(opts.defs.year)-2)+'"]')[0]);
			monthIscroll.scrollToElement($month.find('li[data-value="'+formateDate(parseInt(opts.defs.month)-2)+'"]')[0]);
			dateIscroll.scrollToElement($date.find('li[data-value="'+formateDate(opts.defs.date-2)+'"]')[0]);
			if(opts.ishours){
				hoursIscroll.scrollToElement($hours.find('li[data-value="'+formateDate(parseInt(opts.defs.hours)-2)+'"]')[0]);
				minutesIscroll.scrollToElement($minutes.find('li[data-value="'+formateDate(parseInt(opts.defs.minutes)-2)+'"]')[0]);
			}

			//mask点击
			$tpl.eq(0).click(function(){
				destroy();
			});
			//close
			$tpl.find('.mt_cancel').click(function(){
				opts.cancel && $.isFunction(opts.cancel) && opts.cancel();
				destroy();
			});
			//ok
			$tpl.find('.mt_ok').click(function(event) {
				opts.callback && $.isFunction(opts.callback) && opts.callback(returnVal);
				destroy();
			});
			//显示
			function show(){
				$tpl.addClass('show');
			}
			//销毁
			function destroy(){
				yearIscroll.destroy();
				monthIscroll.destroy();
				dateIscroll.destroy();
				if(opts.ishours){
					hoursIscroll.destroy();
					minutesIscroll.destroy();
				}
				$tpl.removeClass('show');
				setTimeout(function(){
					$tpl.remove();
				},1000)
			}
		}
		$(opts.target).on('click',function(){
			opts.click && $.isFunction(opts.click) && opts.click(opts);
            init();
        })
        //zero
        function formateDate(date){
			if(date<0)return '-1';
        	if(date<10)return '0'+date;
        	return date;
        }
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
	}

    module.exports={
        mTime:mTime
    }
});
