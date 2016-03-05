define('mTools',function(require, exports, module){
	require('zepto');
    var simpop=require('simpop');

    //选项卡
    var tabs=function(a){
        var a=a||{};
        var defaults={
            contain:document,
            opt:'.tabs-opt',
            con:'.tabs-con'
        }
        var opts=$.extend(defaults,a);
        var $children=$('.tabs-opt').children();
        $children.click(function(){
            var _this=$(this);
            var _parent=_this.closest(opts.contain);
            var $conChildren=_parent.find(opts.con).children();
            var index=_this.index();
            _this.addClass('active').siblings().removeClass('active');
            $conChildren.hide().eq(index).show();
        });
        var tx=false;
        $.each($children,function(){
            var _this=$(this);
            if(_this.hasClass('active')){
                _this.trigger('click');
                tx=true;
                return;
            }
        })
        !tx && $children.eq(0).trigger('click');
    }

    //是否是数字
    var isNumber=function(a){
        if(!a)return false;
        return /^\d+$/.test(a);
    }

    //序列化
    var serialize=function(obj){
        if(!obj)return'';
        switch(obj.constructor){
            case Object:
                var str = "{";
                for(var o in obj){
                    str += o + ":" + serialize(obj[o]) +",";
                }
                if(str.substr(str.length-1) == ",")
                    str = str.substr(0,str.length -1);
                return str + "}";
                break;
            case Array:
                var str = "[";
                for(var o in obj){
                    str += serialize(obj[o]) +",";
                }
                if(str.substr(str.length-1) == ",")
                    str = str.substr(0,str.length -1);
                return str + "]";
                break;
            case Boolean:
                return "\"" + obj.toString() + "\"";
                break;
            case Date:
                return "\"" + obj.toString() + "\"";
                break;
            case Function:
                break;
            case Number:
                return "\"" + obj.toString() + "\"";
                break;
            case String:
                return "\"" + obj.toString() + "\"";
                break;
        }
    }

    //字符串转换成json
    function strToJson(str){
        var json = (new Function("return " + str))();
        return json;
    }

    var isLogin=function(){
        var status=false;
        $.ajax({
            url:'?m=member&c=index&a=getinfo',
            dataType:'json',
            async:false,
            success:function(ret){
                if(ret.status)status=true;
            }
        })
        return status;
    }
    //获取登陆窗口
    var getLogin=function(){
        window.location.href="?m=member&c=index&a=login&redirectURL="+encodeURIComponent(window.location.href);
    }

    var request=function(a){
        var a=a||{};
        var defaults={
            url:'',
            isLogin:false,
            isJson:false,
            type:'GET',
            dataType:'json',
            async:true,
            data:'',
            before:'',
            success:''
        };
        var opts=$.extend(defaults,a);
        var tx=true;
        if($.isFunction(opts.before) && opts.before()=='false')return;
        if(opts.isLogin && !isLogin()){getLogin();return;}
        if(tx){
            $.ajax({
                url:opts.url,
                type:opts.type,
                beforeSend:function(XMLHttpRequest){
                    if(opts.isJson){
                        XMLHttpRequest.setRequestHeader('Date-Type','json');
                    }
                },
                dataType:opts.dataType,
                async:eval(opts.async),
                data:$.isFunction(opts.data)?opts.data():opts.data,
                success:opts.success
            });
        }
    }

    //确定弹窗
    var confirm=function(a){
        var a=a || {};
        var defaults={
            url:'',
            content:'是否确认删除此数据（注意：此操作不可还原）',
            type:'GET',
            dataType:'json',
            async:true,
            data:'',
            success:''
        }
        var opts=$.extend(defaults,a);
        require.async(['simpop'],function(simpop){
            simpop.alert({
                content:opts.content,
                callback:function(){
                    $.ajax({
                        type:opts.type,
                        url:opts.url,
                        data:opts.data,
                        dataType:opts.dataType,
                        async:opts.async,
                        success:function(ret){
                            if($.isFunction(opts.success)){opts.success(ret);}
                            else{
                                if(ret.status){simpop.tips({content:ret.info,callback:function(){location.reload();}});}
                                else{simpop.tips({content:ret.info});}
                            }
                        }
                    });
                }
            });
        });
    }

    var del=function(a){
        var a=a || {}
		var defaults={
			target:'[data-del]',
			before:'',
			success:'',
			url:'',
			content:'是否确认删除此数据（注意：此操作不可还原）',
			check:0
		}
		var opts=$.extend(defaults,a);
		$(document).on('click',opts.target,function(){
			var _this=$(this);
			var tr=true;
			if($.type(opts.before)=='function' && opts.before(this)=='false')tr=false;
			var sx=opts.target.substring(1,opts.target.length-1);
			var url=opts.url?opts.url:_this.attr(sx);
			if(_this.data('check'))url+=checkval();
			if(tr){
				confirm({
					content:opts.content,
					url:url,
					success:function(ret){
						var time=500;
						if(!ret.status) time=2500;
						simpop.tips({
							content:ret.info,
							callback:function(){
								if($.type(opts.success)=='function'){opts.success(ret,_this[0])}
								else{if(ret.status)location.reload();};
							},
							time:time
						});
					}
				});
			}
		});
	}
	var ajax=function(a){
        var a=a || {};
        var defaults={
            target:'[data-ajax]',
            isLogin:false,
            dataType:'json',
            isReload:false,
            data:'',
            before:'',
            success:'',
            url:'',
            time:''
        }
        var opts=$.extend(defaults,a);
        $(document).on('click',opts.target,function(){
            var _this=$(this);
            var tr=true;
            if(opts.isLogin && !isLogin()){
                tr=false;
                window.location.href="?m=member&c=index&a=login&redirectURL="+encodeURIComponent(window.location.href);
                return  false;
            }
            if($.type(opts.before)=='function' && opts.before(this)==false)tr=false;
            var sx=opts.target.substring(1,opts.target.length-1);
            var _url=opts.url?opts.url:_this.attr(sx);
            if(tr){
				$.ajax({
					type:opts.type,
					url:_url,
					data:opts.data,
					dataType:opts.dataType,
					success:function(ret){
						if($.isFunction(opts.success)){opts.success(ret,_this[0]);}
						else{
							if(ret.status){simpop.tips({content:ret.info,callback:function(){if(opts.isReload){location.href.reload();}}})}
							else{simpop.tips({content:ret.info});}
						}
					}
				});
            }
        });

	};

    /*
        底部按钮弹窗
        如果填写isTarget:false,想绑定上下文可以用call函数绑定this:mTools.showBtn.call(this,{});
    */
    var showBtn=function(a){
        var a=a||{};
        var defaults={
            title:'',
            isTarget:true,//遗留问题
            before:function(){},
            target:'.j-showBtn',//当为false立马显示
            cancelText:'取消',
            cancel:'',
            isdel:false,
            delText:'删除',
            del:function(){},
            buttons:[]
        };
        var opts=$.extend(defaults,a);
        opts.init=function(obj){
            var _this=$(obj);
            var $body=$('body');
            var $msg=$('<div class="u-showBtn"><style>.u-showBtn{ position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 998; background: rgba(0,0,0,.4); overflow: hidden;}.u-showBtn .con{ position: absolute; bottom: 0; left: 15px; right: 15px; bottom: 0; z-index: 999;transform: translateY(100%);transition: transform .2s linear 0s;}.u-showBtn .con.show{transform: translateY(0);}.u-showBtn .con ul{ background: #fff; border-radius: 3px; margin-bottom: 5px; box-shadow: 0 0 10px 0px gray}.u-showBtn .con ul li{ border-bottom: 1px solid #f5f5f5;}.u-showBtn .con ul li:last-child{ border-bottom: 0;}.u-showBtn .con ul li{ display: block; width: 100%; box-sizing: border-box; padding: 13px; font-size: 15px; font-family: "Microsoft Yahei"; text-align: center; color: #333;}.u-showBtn .con ul.del li{ color: #ff7000;}.u-showBtn .con ul li:active{ color: #444;}</style><div class="con"></div></div>');
            var $con=$msg.find('.con');
			opts.distory=function(){
				$con.removeClass('show');
				setTimeout(function(){
					$msg.remove();
				},300)
			}
            $msg.click(function(){
				opts.distory();
			});
            $con.click(function(event){event.stopPropagation();});
            //取消按钮
            $con.append('<ul class="cancel"><li>'+opts.cancelText+'</li></ul>');
            $con.on('click','.cancel',function(){
                if($.isFunction(opts.cancel)){opts.cancel($msg);}
                opts.distory();
            })
            //删除按钮
            if(($.isFunction(opts.isdel) && opts.isdel(_this[0])===true) || (!$.isFunction(opts.isdel) && opts.isdel)){
                $con.prepend('<ul class="del"><li>'+opts.delText+'</li></ul>');
                $con.on('click','.del',function(){
                    if($.isFunction(opts.del)){opts.del(_this[0]);}
                    $msg.remove();
                })
            }
            //buttons按钮组
            if(opts.buttons.length>0){
                var tpl='<ul class="buttons">';
                for(var i=0;i<opts.buttons.length;i++){
                    var txt=$.isFunction(opts.buttons[i].text)?opts.buttons[i].text(_this[0]):opts.buttons[i].text;
                    if(txt)tpl+='<li data-index="'+i+'">'+txt+'</li>';
                }
                tpl+='</ul>';
                $con.on('click','.buttons li',function(){
                    var index=$(this).data('index');
                    var callback=opts.buttons[index].callback;
                    if($.isFunction(callback))callback(_this[0]);
                    if(opts.buttons[index].isRemove!==false)$msg.remove();
                });
                $con.prepend(tpl);
            }
            $body.append($msg);
			requestAnimationFrame(function(){
				$con.addClass('show');
			})
        }
        if(opts.isTarget && opts.target){
            $(document).on('click',opts.target,function(){
                if(opts.before(this)==false)return;
                opts.init(this);
            })
        }else{
            if(opts.before(this)==false)return;
            opts.init(this);
        }
        return opts;
    }

    //中间按钮弹窗
    var showButton=function(a){
        var a=a||{};
        var defaults={
            title:'提示信息',
            isTarget:true,//遗留问题
            before:function(){},
            target:'.j-showButton',//当为false立马显示
            url:'',
            callback:'',
            buttons:[]
        };
        var opts=$.extend(defaults,a);
        opts.init=function(obj){
            var _this=$(obj);
            var $body=$('body');
            var $msg=$('<div class="u-showButton"><style>.u-showButton{ position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 998; background: rgba(0,0,0,.5); overflow: hidden; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; -webkit-box-pack: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center;}.u-showButton .con{ width: 80%; background-color: #fff; border-radius: 3px; border: 1px solid #999;}.u-showButton .con .title{width: 100%; box-sizing: border-box; padding: 10px; font-size: 14px; font-family: "Microsoft Yahei"; color: #333; border-bottom: 1px solid #f0f0f0;}.u-showButton .con ul{ width: 100%; max-height: 100%; overflow-y: auto;}.u-showButton .con ul li{ border-bottom: 1px solid #f0f0f0;}.u-showButton .con ul li:last-child{ border-bottom: 0;}.u-showButton .con ul li{ display: block; width: 100%; box-sizing: border-box; padding: 10px; font-size: 14px; font-family: "Microsoft Yahei"; color: #333;}.u-showButton .con ul li:active{ color: #444;}</style><div class="con"><div class="title">'+opts.title+'</div></div></div>');
            var $con=$msg.find('.con');
            $msg.click(function(){$msg.remove();});
            $con.click(function(event){event.stopPropagation();});

            //buttons按钮组
            if(opts.buttons.length>0){
                var tpl='<ul class="buttons">';
                for(var i=0;i<opts.buttons.length;i++){
                    var txt=$.isFunction(opts.buttons[i].text)?opts.buttons[i].text():opts.buttons[i].text;
                    if(txt)tpl+='<li>'+txt+'</li>';
                }
                tpl+='</ul>';
                $con.on('click','.buttons li',function(){
                    var index=$(this).index();
                    var callback=opts.buttons[index].callback;
                    if($.isFunction(callback))callback(_this[0]);
                    $msg.remove();
                });
                $con.append(tpl);
            }
            //如果是url时
            if(opts.url){
                request({url:opts.url,isJson:true,success:function(ret){
                    if(ret.status){
                        var info=ret.info;
                        if($.type(info)=='object')info=info.infos;
                        var tpl='<ul class="buttons">';
                        for(var i=0,n=info.length;i<n;i++){
                            tpl+='<li>'+info[i].name+'</li>';
                        }
                        tpl+='</ul>';
                        $con.on('click','.buttons li',function(){
                            var index=$(this).index();
                            if($.isFunction(opts.callback))opts.callback(info[index]);
                            $msg.remove();
                        });
                        $con.append(tpl);
                    }
                }});
            }
            $body.append($msg);
        }
        if(opts.isTarget && opts.target){
            $(document).on('click',opts.target,function(){
                if(opts.before(this)==false)return;
                opts.init(this);
            })
        }else{
            if(opts.before(this)==false)return;
            opts.init(this);
        }
        return opts;
    }

    //form弹窗
    var showForm=function(a){
        var a=a||{};
        var defaults={
            target:'.j-showForm',//当为false的时候立马显示
            content:'',
            value:[],
            isForm:false,//点击按钮是否提交表单
            required:true,//是否为必填项
            url:'',
            before:'',
            show:function(){},
            success:'',
            click:function(){}
        }
        var opts=$.extend(defaults,a);
        var result={};

        result.show=function(){
            if(opts.before && $.isFunction(opts.before) && opts.before()==false)return;
            var formHtml='<div class="m-showForm">'
                            +'<div class="box">'
                               +'<form>'
                                +'<div class="close"><span class="ion-close-round icon"></span></div>'
                                +'<ul></ul>'
                                +'<div class="btnsub"><input type="button" class="btn" value="提交" /></div>'
                                +'</form>'
                            +'</div>'
                        +'</div>';
            var $tpl=$(formHtml);
            var $ul=$tpl.find('ul');
            var $btn=$tpl.find('.btnsub .btn');
            var $box=$tpl.find('.box');

            if(opts.content){
                $ul.html(opts.content);
            }else{
                var tpl='';
                var arr=opts.value;
                for(var i in arr){
                    switch (arr[i].type){
                        case 'input':
                            tpl+='<li><div class="name">'+arr[i].name+'</div><div class="ipt"><input type="text" class="u-txt" name="'+arr[i].name+'" placeholder="'+arr[i].placeholder+'" /></div></li>';
                            break;
                        case 'select':
                            var selectArr=arr[i].value;
                            var tmp='';
                            for(var j in selectArr){
                                tmp+='<option value="'+selectArr[j].value+'">'+selectArr[j].name+'</option>';
                            }
                            tpl+='<li><div class="name">'+arr[i].name+'</div><div class="ipt"><select class="u-slt" name="'+arr[i].name+'">'+tmp+'</select></div></li>';
                            break;
                        case 'radio':
                            var radioArr=arr[i].value.split(',');
                            var tmp='';
                            for(var j in radioArr){
                                tmp+='<label class="f-mr10"><input type="radio" class="f-mr5 u-radio" name="'+arr[i].name+'" value="'+radioArr[j]+'" />'+radioArr[j]+'</label>'
                            }
                            tpl+='<li><div class="name">'+arr[i].name+'</div><div class="ipt">'+tmp+'</div></li>';
                            break;
                        case 'checkbox':
                            var checkboxArr=arr[i].value.split(',');
                            var tmp='';
                            for(var j in checkboxArr){
                                tmp+='<label class="f-mr10"><input type="checkbox" class="f-mr5 u-checkbox" name="'+arr[i].name+'" value="'+checkboxArr[j]+'" />'+checkboxArr[j]+'</label>'
                            }
                            tpl+='<li><div class="name">'+arr[i].name+'</div><div class="ipt">'+tmp+'</div></li>';
                            break;
                        case 'textarea':
                            tpl+='<li><div class="name">'+arr[i].name+'</div><div class="ipt"><textarea class="u-txtarea" style="height:50px;" datatype="*" name="'+arr[i].name+'"></textarea></div></li>';
                            break;
                    }
                }
                $ul.html(tpl);
            }
            $('body').append($tpl);
            setTimeout(function(){$box.addClass('show');},0);
            opts.show($tpl[0],result);
                result.close=function(){
                $box.removeClass('show');
                setTimeout(function(){
                    if($tpl.size()>0)$tpl.remove();
                },300);
            }
            var $form=$tpl.find('form');
            $btn.click(function(){
                var value=$form.serializeArray();
                // console.log(value);
                if(opts.required){
                    for(var i in value){
                        if(opts.value[i].required===false)continue;//当没必须必填的时候忽略
                        if(!value[i].value){
                            simpop.tips({content:value[i].name+'不能为空'});
                            return;
                        }
                    }
                }
                opts.click($tpl[0],result,value);
                if(opts.isForm)$form.submit();
            });
            $form.submit(function(){
                request({
                    url:opts.url?opts.url:window.location.href,
                    type:'POST',
                    data:$(this).serialize(),
                    success:function(ret){
                        if(opts.success && $.isFunction(opts.success)){
                            opts.success(ret,result);
                        }else{
                            require.async(['simpop'],function(simpop){
                                simpop.tips({content:ret.info});
                            });
                        }
                    }
                });
                return false;
            });
            $tpl.click(function(){result.close();});
            $tpl.find('.box').click(function(event){event.stopPropagation();});
            $tpl.find('.close .icon').click(function(){result.close();});
        }
        if(opts.target){
            $(document).on('click',opts.target,function(){
                result.target=this;
                result.show();
            })
        }else{
            result.show();
        }
        return result;
    }

    return {
        tabs:tabs,//选项卡
        isNumber:isNumber,//判断是否是数字
        serialize:serialize,//序列化
        strToJson:strToJson,//字符串转换Json
        isLogin:isLogin,//判断是否登录
        getLogin:getLogin,//获取登陆窗口
        request:request,
        del:del,
        ajax:ajax,
        confirm:confirm,
        showBtn:showBtn,//按钮弹窗
        showButton:showButton,//中间按钮弹窗
        showForm:showForm//form弹窗
    }
});
