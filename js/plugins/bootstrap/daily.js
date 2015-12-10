seajs.use(['jquery','validForm','fnDialog','time','template'],function($,validForm,dialog,time,template){
    $(function(){
        var $year=$('.j-year');
        var $quarter=$('.j-quarter');
        var $timetree=$('.j-timetree');
        var DATA={};
        DATA.date=new Date();//当前的时间戳
        DATA.year=DATA.date.getFullYear();//当前的年份
        DATA.month=DATA.date.getMonth()+1;//当前的月份
        DATA.week=time.getWeek();
        DATA.quarter=time.getQuarter();//当前属于第几季度
        DATA.years=[DATA.year-2,DATA.year-1,DATA.year];//年份的数组
        DATA.quarters=['第一季度','第二季度','第三季度','第四季度'];//季度的数组
        //配置
        template.config('openTag', '<<');
        template.config('closeTag', '>>')
        //工作报告添加
        var $dailycon=$('.j-dailycon');
        $timetree.delegate('.j-daily','click',function(){
            var _this=$(this);
            var year=$year.val();
            var url='?m=jobplan&c=summary&a=index&year='+year;
            var arr={};
            arr.year=year;
            if(_this.data('month')){
                var month=_this.data('month');
                url+='&month='+month;
                arr.type='month';
                arr.num=month;
                arr.title=year+"年第"+month+'月份的工作报告';
                var timetreeMonth=_this.closest('.timetree-month');
                timetreeMonth.find('.timetree-head').addClass('active');
                var sliblings=timetreeMonth.siblings('.timetree-month');
                sliblings.find('.timetree-head').removeClass('active');
                sliblings.find('.timetree-weeklist').slideUp('fast');
                var weeklist=timetreeMonth.find('.timetree-weeklist');
                if(weeklist.is(':hidden')){
                    weeklist.slideDown('fast');
                }
            }
            if(_this.data('week')){
                var week=_this.data('week');
                url+='&week='+week;
                arr.type='week';
                arr.num=week;
                $timetree.find('.timetree-weeklist li').removeClass('active');
                _this.closest('li').addClass('active');
                var weekDates=time.getWeekDates(year,week);
                arr.title=year+'年第'+week+'周的工作报告['+time.formatZero(weekDates.start.month)+'-'+weekDates.start.date+'~'+time.formatZero(weekDates.end.month)+'-'+weekDates.end.date+']';
                
            }
            if(_this.data('quarter')){
                var quarter=_this.data('quarter');
                url+='&quarter='+quarter;
                arr.type='quarter';
                arr.num=quarter;
                arr.title=year+"年"+quarter+'的工作报告';
                var timetreeMonth=_this.closest('.timetree-month');
                timetreeMonth.find('.timetree-head').addClass('active');
                var sliblings=timetreeMonth.siblings('.timetree-month');
                sliblings.find('.timetree-head').removeClass('active');
                sliblings.find('.timetree-weeklist').slideUp('fast');
            }
            validForm.request({
                url:url,
                isJson:true,
                success:function(ret){
                    arr.data={};
                    if(ret.status){
                        arr.data=ret.info
                    }
                    $dailycon.html(template('dailycon',arr));
                    validForm.form({
                        target:$dailycon.find('#j-form'),
                        success:function(ret){
                            if(ret.status){
                                dialog.tips({content:ret.info});
                            }else{
                                dialog.alert({content:ret.info});
                            }
                        }
                    });
                }
            });
        });
        $quarter.change(function(){
            var year=$year.val();
            var weekDetails=time.getWeekDetails(year);
            var curQuarter=parseInt($quarter.val());
            var arr={};
            arr.list=weekDetails.slice((curQuarter-1)*3,(curQuarter-1)*3+3);
            arr.quarter=DATA.quarters[curQuarter-1];
            arr.quarterNum=curQuarter;
            $timetree.html(template('timetree',arr));
            if(year==DATA.year){
                $timetree.find('[data-month='+DATA.month+']').trigger('click');
                $timetree.find('[data-week='+DATA.week+']').trigger('click');
            }
        });
        //初始化年份
        var tpl='';
        for(var i=0;i<DATA.years.length;i++){
            tpl+='<option value="'+DATA.years[i]+'">'+DATA.years[i]+'</option>';
        }
        $year.append(tpl);
        $year.val(DATA.year);
        $year.change(function(){
            $quarter.trigger('change');
        });
        //初始化季度
        $quarter.val(DATA.quarter);
        //初始化季度分布图
        $quarter.trigger('change');
    })
});