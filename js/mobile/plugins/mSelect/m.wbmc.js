define('mWbmc',function(require, exports, module){
	require('zepto');
	require('iscroll');
	require('seajsCss');

	seajs.use('/js/mobile/plugins/mSelect/zepto.mtimer.css');

    var wbmc=function(a){
        var a=a||{};
        var defaults = {
            target:'j-wbmc',
            root:0,//跟的id
            pid:undefined,//根的pid
            select:3,//一共多少个select
            title:[],//每个选项添加小标题
            defId:'',//根对应的id
            val:'id',//对应的真值字段
            click:function(){},
            callback:'',//点击确定按钮后
            cancel:'',//点击取消按钮后
            name:'',//获取的js名字
            init:function(){},
            config:function(){},
            def:[]//默认值
        };
        var opts = $.extend(defaults, a);
        if(opts.name=='area')opts.title=['省','市','县'];
        var OBJ={};
        function getJson(name){
            if(!name)return;
            if(OBJ[name])return OBJ[name];
            var obj={};
            if($.isArray(opts.name)){
                obj.json=opts.name;
            }else{
                $.ajax({
                    url:'/js/dict/'+name+'.js',
                    async:false,
                    dataType:'json',
                    success:function(ret){
                        obj.json=ret;
                    }
                });
            }
			if(!obj.json)return;
            obj.findIdObj={};//id->pid的对应
            obj.DATA={};
            obj.findId={};//id->{}
            $.each(obj.json,function(i,n){
                obj.findIdObj[n.id]=n.pid;
                obj.findId[n.id]=n;
                if(!obj.DATA[n.pid]){
                    obj.DATA[n.pid]=[];
                    obj.DATA[n.pid].push(n);
                }else{
                    obj.DATA[n.pid].push(n);
                }
            });
            OBJ[name]=obj;
            return OBJ[name];
        }
        var itemHeight = 48;
        var ARR=[];
        var TTT=true;
		var jsonTmp=getJson(opts.name);
		if(!jsonTmp)return;
        var json=jsonTmp.json;//储存原始json数据
        var DATA=getJson(opts.name).DATA;//储存重新排版后的json数据
        var findIdObj=getJson(opts.name).findIdObj;
        var findId=getJson(opts.name).findId;
         //初始化选项
        if(opts.pid!=undefined){
            opts.root=DATA[opts.pid][0].id;
        }
        if(opts.defId){
            opts.def=getId(opts.defId);
        }
        //函数从最后一个defId循环出层层id
        function getId(id){
            if(!id)return '';
            var pid=findIdObj[id];
            if(pid!=undefined){
                //不存在解析的默认值
                var arr=[];
                arr.push(id);
                var tmp=pid;
                while(tmp!=opts.root){
                    arr.push(tmp);
                    tmp=findIdObj[tmp];
                }
                return arr.reverse();
            }
            return '';
        }
        //函数从id到name的转换
        function getName(id){
            if(!id)return '';
            var arr=$.isArray(id)?id:id.split(',');
            var result=[];
            for(var i in arr){
                result.push(findId[arr[i]].name);
            }
            return result.join(',');
        }
        if($.isFunction(opts.init))opts.init({opts:opts,json:json,data:DATA,findIdObj:findIdObj,findId:findId,getName:getName,getId:getId});
        if(!json || ($.isArray(json)&&json.length==0))return;//如果没有json解析数据则返回
        var picker = {
            init : function(obj){
                opts.click({opts:opts,json:json,data:DATA,findIdObj:findIdObj,findId:findId,getName:getName,getId:getId});
                var $target = $(obj);
                ARR=[];
                TTT=true;

                var _this = this;

                _this.renderHTML();

                var container=$('.mt_poppanel');
                var $box = $('.box',container);
                for(var i=0;i<opts.select;i++){
                    var tpl='<div class="select-'+i+'"><ul><li class="mt_note">上下滚动选取'+(opts.title.length>0?opts.title[i]:'')+'</li><li></li><li>请选择</li></ul></div>';
                    var $tpl=$(tpl);
                    if(i==0){
                        var str = '';
                        for(var j in DATA[opts.root]){
                            str+='<li data-id="'+DATA[opts.root][j]['id']+'" data-value="'+DATA[opts.root][j][opts.val]+'">'+DATA[opts.root][j]['name']+'</li>';
                        }
                        str+='<li></li><li></li>';
                        $tpl.find('ul').append(str);
                    }
                    $box.append($tpl);
                    //初始化scroll
                    var elHeight = itemHeight;
                    var selectScroll = new IScroll('.mt_poppanel .select-'+i, {
                        snap : 'li',
                        probeType : 2,
                        tap : true
                    });
                    ARR.push({tpl:$tpl,selectScroll:selectScroll});
                }
                for(var i=0;i<ARR.length;i++){
                    (function(i){
                        var selectScroll=ARR[i].selectScroll;
                        selectScroll.on('scrollEnd', function(){
                            if(ARR[i].tpl.find('li').eq(_this.getSelected(ARR[i].selectScroll)).data('value')!=opts.def[i]){TTT=false;}
                            if(TTT){return;}
                            ARR[i].selectScroll=this;
                            _this.updateSelected(i);
                        });
                    })(i);
                }

                //初始化点击事件
                $('.mt_ok', container).on('click', function(){
                    var result=[];
                    for(var i in ARR){
                        var index=_this.getSelected(ARR[i].selectScroll);
                        var $item=ARR[i].tpl.find('li').eq(index);
                        result.push({name:$item.text(),id:$item.data('id')});
                    }
                    _this.hidePanel();
                    opts.callback && typeof opts.callback=='function' && opts.callback(result);
                });
                $('.mt_cancel', container).on('click', function(){
                    _this.hidePanel();
                    opts.cancel && typeof opts.cancel=='function' && opts.cancel();
                });
                $('.mt_mask').on('click', function(){
                    _this.hidePanel();
                });
        //
            //初始化原有的数据
            _this.setValue();
            _this.showPanel();
            },
            renderHTML : function(){
                var stime = opts.timeStart + ':00';
                var etime = opts.timeStart + opts.timeNum + ':00';
                var html = '<div class="mt_mask"></div><div id="mSelect" class="mt_poppanel"><div class="mt_panel"><h3 class="mt_title">请选择选项</h3><div class="mt_body"><div class="box"></div><div class="mt_indicate"></div></div><div class="mt_confirm"><a href="javascript:void(0);" class="mt_ok u-btn-blue u-btn-biger">确定</a> <a href="javascript:void(0);" class="mt_cancel u-btn-gray u-btn-biger">取消</a></div></div></div>';
                $(document.body).append(html);
            },
            updateSelected : function(index){
//                console.log(11);
                var _this=this;
                for(var i=index+1;i<opts.select;i++){
                    var $preScroll=ARR[i-1].selectScroll;
                    var $preTpl=ARR[i-1].tpl;
                    var selectScroll=ARR[i].selectScroll;
                    var $tpl=ARR[i].tpl;
                    var $ul=$tpl.find('ul');
                    $tpl.find('li').filter(function(index){return index>2}).remove();
                    if(i==index+1){
                        var pid=$preTpl.find('li').eq(this.getSelected($preScroll)).data('id');
//                        console.log(pid);
                        var str = '';
                        for(var j in DATA[pid]){
                            str+='<li data-id="'+DATA[pid][j]['id']+'" data-value="'+DATA[pid][j][opts.val]+'">'+DATA[pid][j]['name']+'</li>';
                        }
                        str+='<li></li><li></li>';
                        $ul.append(str);
                    }
                    selectScroll.destroy();
                    ARR[i].selectScroll = new IScroll('.mt_poppanel .select-'+i, {
                        snap : 'li',
                        probeType : 2,
                        tap : true
                    });
                    (function(i){
                        ARR[i].selectScroll.on('scrollEnd', function(){
                            if(ARR[i].tpl.find('li').eq(_this.getSelected(ARR[i].selectScroll)).data('value')!=opts.def[i]){TTT=false;}
                            if(TTT){return;}
                            // console.log(i);
                            ARR[i].selectScroll=this;
                            _this.updateSelected(i);
                        });
                    })(i);
                }
//                console.log(22);
            },
            getSelected : function(iscroll){
				var index = (-iscroll.y) / itemHeight + 2;
                return index;
			},
            showPanel : function(container){
                $('.mt_poppanel, .mt_mask').addClass('show');
            },
            hidePanel : function(){
                $('.mt_poppanel, .mt_mask').removeClass('show');
                setTimeout(function(){$('.mt_poppanel, .mt_mask').remove()},300);
            },
            setValue : function(){
                _this=this;
                for(var i=0;i<opts.select;i++){
                    if(opts.def[i]){
                        var item = $('.mt_poppanel .select-'+i+' li[data-value="'+opts.def[i]+'"]').prev('li').prev('li');
                        if(item.size()>0)ARR[i].selectScroll.scrollToElement(item[0]);
                        _this.updateSelected(i);
                    }
                }
            }
        }
        // picker.init();
        $(opts.target).click(function(){
            picker.init(this);
        })
    }
    module.exports={
        wbmc:wbmc
    }
});
