define('box',function(require, exports, module){
	require('jquery');

	//手机终端的信息
	var browser=function(){
		var u = navigator.userAgent, app = navigator.appVersion;
		return {//移动终端浏览器版本信息
			 trident: u.indexOf('Trident') > -1, //IE内核
			 presto: u.indexOf('Presto') > -1, //opera内核
			 webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			 gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			 mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
			 ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			 android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
			 iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
			 iPad: u.indexOf('iPad') > -1, //是否iPad
			 webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		 }
	}

	//分析url地址
	var parseUrl=function(url) {
		var a =  document.createElement('a');
		a.href = url;
		return {
			source: url,
			protocol: a.protocol.replace(':',''),
			host: a.hostname,
			port: a.port,
			query: a.search,
			params: (function(){
				var ret = {},
					seg = a.search.replace(/^\?/,'').split('&'),
					len = seg.length, i = 0, s;
				for (;i<len;i++) {
					if (!seg[i]) { continue; }
					s = seg[i].split('=');
					ret[s[0]] = s[1];
				}
				return ret;
			})(),
			file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
			hash: a.hash.replace('#',''),
			path: a.pathname.replace(/^([^\/])/,'/$1'),
			relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
			segments: a.pathname.replace(/^\//,'').split('/')
		};
	};

	var _blank=function(url){
        if(!url)return;
		var objUrl=parseUrl(url);
		var iptTpl='';
		if(objUrl.params){
			for(var i in objUrl.params){
				iptTpl+='<input type="hidden" name="'+i+'" value="'+objUrl.params[i]+'"/>';
			}
		}
        var $blank=$('<form target="_blank" action="/">'+iptTpl+'</form>');
        $blank.trigger('submit');
    }

    //序列化
	var serialize=function(obj){
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

	//幻灯特效
	var slide=function(a){
		var defaults={
			contain:'.e-slide',
            animate:false
		};
		var opts=$.extend(defaults,a);
		var contain=$(opts.contain);
		require.async(['slide'],function(slide){
			$.each(contain,function(i,n){
                var _this=$(n);
                var sk=_this.attr('data-sk');
                if(sk!='1'){
                    _this.attr('data-sk','1');
                    if(opts.animate){
                        opts.endFun=function(j,c){
                            var $slide=_this.find(opts.mainCell).children().eq(j).find('[data-animate]');
                            $.each($slide,function(k,m){
                                var $m=$(m);
                                $m.addClass($m.data('animate')).show();
                            })
                            if($.isFunction(a.endFun))a.endFun(j,c);
                        }
                        opts.startFun=function(j,c){
                            var $slide=_this.find(opts.mainCell).children().eq(j).find('[data-animate]');
                            $.each($slide,function(k,m){
                                var $m=$(m);
                                $m.removeClass($m.data('animate')).hide();
                            })
                            if($.isFunction(a.startFun))a.startFun(j,c);
                        }
                    }
                    _this.slide(opts);
                }
			});
		});
	}

	//判断是否登录
	var isLogin=function(){
		var status=true;
        $.ajax({
            url:'?m=member&c=index&a=getinfo',
            dataType:'json',
            async:false,
            success:function(ret){
                if(!ret.status)status=false;
            }
        });
		return status;
	}

    //获取登陆会员的所有信息
    var getLoginInfo=function(a){
        var a=a||{};
        var _url='?m=member&c=index&a=getinfo';
        if(a.expand){_url='?m=member&c=index&a=getinfo&expand=true';}
        var data;
		$.ajax({
            url:_url,
            dataType:'json',
            async:false,
            success:function(ret){
                data=ret;
            }
        });
        return data;
    }

    //获取登陆会员的名字和手机号
    var getLoginNames=function(){
    	var INFO=getLoginInfo({expand:true});
    	if(INFO.status){
    		var infos=INFO.info;
    	}else{
    		var infos=null;
    	}
    	var getName=function(tx){
    		if(!infos)return '';
			if(tx=true)return infos.realname;
			if(infos.nickname)return infos.nickname;//昵称
			if(infos.realname)return infos.realname;//真实姓名
            return '';
        }
        var getMobile=function(a){
            if(!infos)return '';
            if(infos.mobile)return infos.mobile;
            if(infos.phone)return infos.phone;
            return '';
        }
        return{name:getName(),mobile:getMobile()}
    }

	function getVal(a){
		var a=a||{};
		var defaults={
			target:'',
			targetStr:'',
			content:'data-content'
		}
		var opts=$.extend(defaults,a);
		if(!opts.targetStr)return;
		var arr={'.':true,'#':true};
		var $target=(opts.target && opts.target instanceof jQuery)?opts.target:$(opts.targetStr);
		var returnResult={target:$target[0],targetStr:opts.targetStr,content:opts.content}
		if(!arr[opts.targetStr.toString().charAt(0)]){
			opts.content=opts.targetStr.substring(1,opts.targetStr.length-1);
		}
		returnResult.val=$target.attr(opts.content);
		return returnResult;
	}

	//会员中心初始化
	var _memberInit=function(a){
		var a=a||{};
		var defaults={
		}
		var opts=$.extend(defaults,a);
		var $memberBody=$('.j-ystMember');
		if($memberBody.size()>0)return;
		var $tpl=$('<div class="m-yst-member j-ystMember"><div class="member-left bg j-member-body"><iframe id="leftiframe" width="260" height="732" frameborder="0" scrolling="no" src="?m=member&a=left" allowtransparency="true"></iframe></div><div class="member_right bg j-member-body"><div class="title"><ul class="f-cb j-iframeControllor"></ul></div><div class="main"><div id="iframe"></div></div><div class="footer"></div></div></div>');
		$('body').append($tpl);
	}
	// memberInit();
	var memberInit=function(){
		require.async(['dialog','dialogPlus'],function(dialog,dialogPlus){
			window.dialog=dialog;
			_memberInit();
		});
	}

	//获取登陆信息
	var loginInfo=function(a){
		var a=a||{};
		var defaults={
			target:'.j-loginInfo',
			html:''
		};
		var opts=$.extend(defaults,a);
		var $target=$(opts.target);
		if($target.size()==0)return;
		$.each($target,function(){
			var _this=$(this);
			var val=getVal({target:_this,targetStr:opts.target});
			var user='';
			var pid=parseUrl(window.location.href).params['pid'];
			var PID=pid?('&pid='+pid):'';
			if(val.val=='mall')user='<a href="?m=product&c=cart&a=index" target="_blank" class="f-mr10">购物车</a><a href="?m=product&c=order&a=buy" target="_blank" class="f-mr10">已购商品</a>';
			require.async(['validForm'],function(validForm){
				validForm.request({
					url:'?m=member&c=index&a=getinfo&expand=true',
					success:function(ret){
						if(ret.status){
							var name;
							var info=ret.info;
							if(info.id)name=info.id;
							if(info.account)name=info.account;
							if(info.email)name=info.email;
							if(info.realname || info.name)name=info.realname?info.realname:info.name;
							if(info.nickname || info.abbreviation)name=info.nickname?info.nickname:info.abbreviation;
							_this.html('<a href="/?m=member" class="name f-mr10" target="_blank">'+name+'</a><a href="/?m=member&a=logout&redirectURL='+encodeURIComponent(window.location.href)+'" class="f-mr10">退出</a>'+user);
						}else{
							if(!opts.html)opts.html='<a href="?m=member&c=index&a=login&redirectURL='+encodeURIComponent(window.location.href)+'" class="btn1">登录</a> <a href="?m=member&a=register'+PID+'" class="btn2" target="_blank">注册</a>'
							_this.html(opts.html);
						}
					}
				});
			});
		});
	}
	loginInfo({target:'[data-loginInfo]'});

    //获取登陆弹窗
    var getLogin=function(a){
        var a=a||{};
        var defaults={
        	data:{},
            callback:function(){},
            onclose:function(){}
        };
        var opts=$.extend(defaults,a);
        require.async(['fnDialog'],function(dialog){
            dialog.get({
                url:'?m=common&c=dialog&a=login',
                data:opts.data,
                callback:function(status){
                    if(status){
                        loginInfo();
                        opts.callback();
                    }
                },
                onclose:function(){opts.onclose()}
            });
        });
    }

	var bindLogin=function(){
		//点击如果登陆就直接跳转，不登陆就弹出登录窗口
		$(document).delegate('.j-bindLogin','click',function(){
			var status=isLogin();
			if(!status){
				getLogin();
				return false;
			}
		});
	}

	//ie版本的判断
	var IE = (function(){
		var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
		while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]
		);
		return v > 4 ? v : false ;
	}());

	//跟随窗口走动的div
	var fix=function(a){
        var a=a||{};
		var defaults={
			target:'',
			isOh:false,
			isClass:true,
			isBorder:'.footer'
		};
		var opts=$.extend(defaults,a);
		if(opts.target=='')return false;
		var v1=$(opts.target);
		if(v1.size()==0)return;
		var isClass=opts.isClass?v1[0].className:'';
		var pos=v1.offset();
		var isOh=!opts.isOh?'':'overflow:hidden';
		var H=v1.height();
		v1.height(H);
		v1.wrapInner(function() {
            return '<div class="fix_inner '+isClass+'" style="width:'+v1.width()+'px;'+isOh+'"></div>';
        });
		var inner=v1.find('.fix_inner');
		$(window).scroll(function(){
			var top=$(window).scrollTop();
			var footer=$(opts.isBorder);
			var footer_size=footer.size();
			var footer_pos=footer.offset();
			if(top>pos.top){
				if(IE=='6'){
					inner.css({'position':'absolute','top':top+'px','left':pos.left+'px'});
				}else{
					inner.css({'position':'fixed','top':0,'left':pos.left+'px'});
				}
				if(footer_size>0 && top+H>footer_pos.top){
					inner.css({'height':footer_pos.top-top+'px'});
				}else{
					inner.css({'height':'auto'});
				}
			}else{
				inner.css({'position':'static'});
			}
		});
	}

	//输出系统时间
	var getDate=function(format) {
		try {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();

			if (hour < 10) {
				hour = "0" + hour;
			}
			if (minute < 10) {
				minute = "0" + minute;
			}
			if (second < 10) {
				second = "0" + second;
			}
			month = month + 1;
			if (month < 10) {
				month = "0" + month;
			}
			if (day < 10) {
				day = "0" + day;
			}

			if (!format) {
				var temp = year + "年" + month + "月" + day + "日";
				var d = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
				var dd = d[date.getDay()];
				return temp + " " + dd + " " + hour + ":" + minute + ":" + second;
			} else {
				if ("yyyy-MM-dd" == format) {
					return year + "-" + month + "-" + day;
				} else if ("yyyy年MM月dd日" == format) {
					return year + "年" + month + "月" + day + "日";
				} else if ("yyyy-MM-dd hh:mm:ss" == format) {
					return year + "-" + month + "-" + day + " " + hour + ":"
							+ minute + ":" + second;
				} else if ("yyyy年MM月dd日 hh时mm分ss秒" == format) {
					return year + "年" + month + "月" + day + "日  " + hour
							+ "时" + minute + "分" + second + "秒";
				}
			}
		} catch (e) {
			return "";
		}
	};
    //团购时间
    var countdown=function(a){
        var a = a || {};
        var defaults={
            target:'[data-countdown]',
            isDay:true,
            callback:'',
            endFn:''
        };
        var opts=$.extend(defaults,a);
        var target=$(opts.target);
        if(target.size()>0){
            $.each(target,function(i,n){
                var time=$(n).attr(opts.target.substring(1,opts.target.length-1));
                count(n,time);
            });
        }
        function count(obj,time){
            var _this=$(obj);
            var end_time =time,//月份是实际月份-1
            //var end_time ='1396593900';
            //current_time = new Date().getTime(),
            sys_second = end_time-Math.round(new Date().getTime()/1000);
            //alert(sys_second);
            var timer = setInterval(function(){
                if (sys_second > 0) {
                    sys_second -= 1;
                    var day = Math.floor((sys_second / 3600) / 24);
                    var hour = Math.floor((sys_second / 3600) % 24);
                    var minute = Math.floor((sys_second / 60) % 60);
                    var second = Math.floor(sys_second % 60);

                    day=zero(day);
                    hour=zero(hour);
                    minute=zero(minute);
                    second=zero(second);
                    if($.isFunction(opts.callback)){
                        opts.callback(obj,day,hour,minute,second);
                    }else{
                        _this.html(opts.isDay?'<i>'+day+'</i>天'+''+'<i>'+hour+'</i>时<i>'+minute+'</i>分<i>'+second+'</i>秒':''+'<i>'+hour+'</i>时<i>'+minute+'</i>分<i>'+second+'</i>秒')
                    }

                } else {
                    clearInterval(timer);
                    if($.isFunction(opts.endFn)){
                        opts.endFn(obj);
                    }else{
                        _this.text('本活动已结束');
                    }
                }
            }, 1000);
        }
        function zero(num){
            return parseInt(num)<10?'0'+num:num;
        }

    }

    //直接购买
    var addOrder=function(a){
        var a=a||{};
        var defaults={
            target:'data-order',
            before:'',
            blank:false,
            name:''
        }
        var opts=$.extend(defaults,a);
        var tpl='<form action="?m=product&c=order&a=confirm" method="post" '+(opts.blank?'target="_blank"':'')+'><input type="hidden" class="u-txt" name="products[0][id]" value=""><input type="hidden" name="products[0][checked]" value="1"><input type="hidden" name="products[0][quantity]" value="1"></form>';
        var form=$(tpl);
        if(opts.name){
    		var tmp='';
    		for(var i in opts.name){
    			tmp+='<input type="hidden" name="'+opts.name[i]+'" />';
    		}
    		form.append(tmp);
    	}
        $('body').append(form);
        var formId=form.find('input:first-child');
        $(document).delegate('['+opts.target+']','click',function(){
            if(isLogin()){
                var _this=$(this);
                var id=_this.attr(opts.target);
                if(opts.before && $.isFunction(opts.before)){
                	var tx=opts.before(_this[0]);
                	if(!tx)return;
                }
                formId.val(id);
                if(opts.name){
	        		form.find('[name='+opts.name[i]+']').val(_this.data(opts.name[i]));
	        	}
                form.submit();
            }else{
                getLogin();
                return false;
            }
        })
    }
	//绑定往会员中心跳转
	var bindGoMember=function(){
		var a=a||{};
		var defaults={
			target:'.j-bindGoMember'
		};
		var opts=$.extend(defaults,a);
		var $target=$(opts.target);
		$target.each(function(){
			var $this=$(this);
			var url=$this.data('url');
			var title=$this.data('title');
			if(url){
				$this.attr('href','?m=site&a=tpl&name=target_url&title='+encodeURIComponent(title)+'&url='+encodeURIComponent(url));
				$this.attr('target','_blank');
			}
		});
	}
    //往会员中心跳转
    var gotoMember=function(a){
        var a=a||{};
        var defaults={
            title:'跳转链接',
			_blank:false,
            url:''
        };
        var opts=$.extend(defaults,a);
        require.async('cookie',function(cookie){
            $.cookie('gotomember',serialize({"title":opts.title,"url":opts.url}));
			if(opts._blank){
				_blank('/?m=member&a=senior');
			}else{
				window.location.href='/?m=member&a=senior';
			}
        });
    }
    //点击往会员中心跳转
    var goMember=function(a){
        var a=a||{};
        var defaults={
            target:'[data-goMember]',
            title:'跳转链接',
			before:'',
			_blank:false,
            url:''
        };
        var opts=$.extend(defaults,a);
        $(document).on('click',opts.target,function(event){
			if(opts.before && $.isFunction(opts.before) && opts.before(this)===false)return false;
            var _this=$(this);
            if(opts.target.charAt(0)=='['){
	            var sx=opts.target.substring(1,opts.target.length-1);
	            var dataSx=_this.attr(sx);
	            if(dataSx){
	                opts.title=dataSx.split(',')[0];
	                opts.url=dataSx.split(',')[1];
	            }
	        }
			var nodeName=this.nodeName.toLocaleLowerCase();
			if(nodeName=='a'){
				var target=_this.attr('target');
				if(target=='_blank')opts._blank=true;
			}
            gotoMember({title:opts.title,url:opts.url,_blank:opts._blank});
        })
    }

    //修改数量
    var changeQuantity=function(a){
		var defaults={
			contain:'.j-quantity',
			btn:'.j-quantity-btn',
			txt:'.j-quantity-val',
			change:''
		};
		var opts=$.extend(defaults,a);
		$(document).delegate(opts.btn,'click',function(){
			var _this=$(this);
			var $parent=_this.closest(opts.contain);
			var $val=$parent.find(opts.txt);
			var val=parseInt($val.val());
			var type=_this.data('btn');
			switch (type){
				case 'add':
					$val.val(val+1);
					break;
				case 'min':
					if(val==1)return;
					$val.val(val-1);
					break;
			}
			if($.isFunction(opts.change))opts.change($val[0]);
		});
		$(document).delegate(opts.txt,'change',function(){
			var _this=$(this);
			var val=_this.val();
			if(!(/^[1-9]\d*$/i.test(val)))return _this.val(1);
			if(val<1)return _this.val(1);
			if($.isFunction(opts.change))opts.change(_this[0]);
		});
	}

    //加入购物车
    var addCart=function(a){
        var a=a||{};
        var defaults={
            target:'data-cart',
			isLogin:true,
			data:'',
			url:'?m=product&c=cart&a=add',
			before:'',
            success:''
        }
        var opts=$.extend(defaults,a);
        $(document).delegate('['+opts.target+']','click',function(){
            if((opts.isLogin && isLogin()) || !opts.isLogin){
                var _this=$(this);
				var tx=true;
				if($.isFunction(opts.before)){tx=opts.before(_this[0])}
				if(tx){
					require.async(['fnDialog','validForm','tools'],function(dialog,validForm,tools){
						var DATA;
						if(opts.data){
							DATA=$.isFunction(opts.data)?opts.data(_this[0]):opts.data;
						}else{
							var id;
							if(!_this.data('check')){id=_this.attr(opts.target);}
							else{id=tools.checkval();}
							if(id){
								var idArr=id.split(',');
								var data={products:[]};
								for(var i in idArr){
									data.products.push({id:idArr[i],quantity:(_this.data('quantity')?_this.data('quantity'):'1')})
								}
								DATA=data;
							}
						}
						if(DATA){
							validForm.request({
								url:opts.url,
								type:'post',
								data:DATA,
								success:function(ret){
									if($.isFunction(opts.success)){
											opts.success(ret,_this[0]);
									}else{dialog.tips({content:ret.info});}
								}
							});
						}
					});
				}
            }else{
                getLogin();
                return false;
            }
        })
    }

    //收藏的接口
    var quote=function(a){
    	var a=a||{};
    	var defaults={
    		target:'.j-quote'
    	};
    	var opts=$.extend(defaults,a);
    	//收藏相关
        var $quote=$(opts.target);
        if($quote.data('isquote')==1){
            $quote.text('取消收藏（'+$quote.data('quotenum')+'）');
        }else{
            $quote.text('收藏（'+$quote.data('quotenum')+'）');
        }
        require.async(['fnDialog','tools'],function(dialog,tools){
		   tools.ajax({
				isLogin:true,
				isLoginReload:true,
				target:opts.target,
	            before:function(obj,opts){
	                var _this=$(obj);
	                if(_this.data('isquote')==1){
	                    opts.url=_this.attr('data-quotedel');
	                }else{
	                    opts.url=_this.attr('data-quoteadd');
	                }
	            },
				success:function(ret,obj,opts){
					var _this=$(obj);
					if(ret.status){
						if(_this.data('isquote')==1){
	                        dialog.tips({
	                            content:'取消收藏',
	                            callback:function(){
	                                var quotenum=parseInt(_this.data('quotenum'));
	                                _this.data('quotenum',quotenum-1);
	                                _this.data('isquote',0);
	                                _this.text('收藏（'+(quotenum-1)+'）');
	                            }
	                        });
	                    }else{
	                        dialog.tips({
	                            content:'收藏成功',
	                            callback:function(){
	                                var quotenum=parseInt(_this.data('quotenum'));
	                                _this.data('quotenum',quotenum+1);
	                                _this.data('isquote',1);
	                                _this.text('取消收藏（'+(quotenum+1)+'）');
	                            }
	                        });
	                    }
					}else{
						dialog.tips({content:ret.info});
					}
				}
			});
		});
    }

    //注册的接口
    var register=function(a){
        var a=a||{};
        var defaults={
            target:'[data-register-form]',
            btnSubmit:'.btnSubmit',//提交按钮
//            isVcode:false,//是否存在验证码
            vcodeBox:'.vcodeBox',
            vcodeIpt:'.vcodeIpt',
            vcodeImg:'.vcodeImg',
            isPhone:false,//是否存在手机
            phoneBox:'.phoneBox',
            phoneIpt:'[name=account]',
            phoneSend:'.phoneSend',
            success:'',//成功回调函数
			isRandom:false,//是否存在随机生成账号按钮
			isPlaceholder:true//是否账号规则写出来
        };
        var opts=$.extend(defaults,a);
        var target=$(opts.target);
		var _this=target;
		var form;
		if(_this.is('form')){
			form=_this;
		}else{
			form=_this.find('form');
		}
		var $account=form.find('input[name=account]');
        require.async(['validForm','fnDialog'],function(validForm,dialog){
			//账号配置一些信息
			var errormsg='请输入正确的信息';
			var regE=/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			var regM=/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/;
			var regR=/\S+/;//任意
			var reg1,reg2,reg3;
			var random=false;
			var config='';
			var base='';
			validForm.request({
				url:'?m=member&c=index&a=getconfig',
				isJson:true,
				async:false,
				success:function(ret){
					if(ret.status){
						config=ret.info;
						if(typeof config=='object'){
							base=config.base;
						}else{
							base={};
							base.register=0;
							base.account=0;
						}
					}
				}
			});
			if(base.register==0){
				reg1=regE;reg2=regM;
				if(base.account==0){errormsg="邮箱/手机/账号";reg3=regR}
				if(base.account==1){errormsg="邮箱/手机/账号（最少2位数汉字）";reg3=/^[\u4E00-\u9FA5\uf900-\ufa2d]{2,32}$/;}
				if(base.account==2){errormsg="邮箱/手机/账号（纯小写英文）";reg3=/^[a-z]*$/i;}
				if(base.account==3){
					errormsg="邮箱/手机/账号";
					if(base.account_len_type=='='){
						errormsg+='（纯数字长度等于'+base.account_len_start+'）';
						random=true;
						reg3=new RegExp('^\\d{'+base.account_len_start+'}$');
					}
					if(base.account_len_type=='!='){
						errormsg+='（纯数字长度不等于'+base.account_len_start+'）';
						reg3=new RegExp('^(?!\\d{'+base.account_len_start+'})$');
					}
					if(base.account_len_type=='>='){
						errormsg+='（纯数字长度大于'+(parseInt(base.account_len_start)-1)+'）';
						reg3=new RegExp('^\\d{'+base.account_len_start+',}$');
					}
					if(base.account_len_type=='<='){
						errormsg+='（纯数字长度小于'+(parseInt(base.account_len_start)+1)+'）';
						reg3=new RegExp('^\\d{1,'+base.account_len_start+'}$');
					}
					if(base.account_len_type=='between'){
						errormsg+='（纯数字长度大于'+(parseInt(base.account_len_start)-1)+'小于'+(parseInt(base.account_len_end)+1)+'）';
						reg3=new RegExp('^\\d{'+base.account_len_start+','+base.account_len_end+'}$');
					}
				}
			}else if(base.register==1){
				reg1=regE;reg2=regM;
				errormsg="请输入正确的邮箱/手机";
			}else if(base.register==2){
				reg1=regE;
				errormsg="请输入正确的邮箱";
			}else if(base.register==3){
				reg2=regM;
				errormsg="请输入正确的手机";
			}else if(base.register==4){
				if(base.account==0){errormsg="请输入正确的账号";reg3=regR}
				if(base.account==1){errormsg="请输入正确的账号（最少2位数汉字）";reg3=/^[\u4E00-\u9FA5\uf900-\ufa2d]{2,32}$/;}
				if(base.account==2){errormsg="请输入正确的账号（纯小写英文）";reg3=/^[a-z]*$/i;}
				if(base.account==3){
					errormsg="请输入正确的账号";
					if(base.account_len_type=='='){
						errormsg+='（长度等于'+base.account_len_start+'）';
						random=true;
						reg3=new RegExp('^\\d{'+base.account_len_start+'}$');
					}
					if(base.account_len_type=='!='){
						errormsg+='（长度不等于'+base.account_len_start+'）';
						reg3=new RegExp('^(?!\\d{'+base.account_len_start+'})$');
					}
					if(base.account_len_type=='>='){
						errormsg+='（长度大于'+(parseInt(base.account_len_start)-1)+'）';
						reg3=new RegExp('^\\d{'+base.account_len_start+',}$');
					}
					if(base.account_len_type=='<='){
						errormsg+='（长度小于'+(parseInt(base.account_len_start)+1)+'）';
						reg3=new RegExp('^\\d{1,'+base.account_len_start+'}$');
					}
					if(base.account_len_type=='between'){
						errormsg+='（长度大于'+(parseInt(base.account_len_start)-1)+'小于'+(parseInt(base.account_len_end)+1)+'）';
						reg3=new RegExp('^\\d{'+base.account_len_start+','+base.account_len_end+'}$');
					}
				}
			}
			//给账号添加一些东西
			if(opts.isPlaceholder)$account.attr('placeholder',errormsg);
			if(random && opts.isRandom)$account.after('<a data-account="btn" class="u-btn-gray btn2" id="random">点击生成账号</a>');
			//验证码东东
			validForm.request({
				url:'?m=member&c=index&a=is_vcode',
				success:function(ret){
					if(ret.status){opts.isVcode=true;}
					else{opts.isVcode=false;}
				}
			});
			var vcodeBox=$(opts.vcodeBox,form);
			var vcodeIpt=$(opts.vcodeIpt,form);
			var vcodeImg=$(opts.vcodeImg,form);
			if(opts.isVcode){vcodeBox.hide();}
			else{vcodeFn();}
			function vcodeFn(){vcodeBox.show();vcodeImg.attr('src','api.php?n=vcode&width=160&height=50&t='+Math.round(Math.random()*10000));};
			vcodeImg.bind("click",function(){vcodeFn();});
			//验证手机号东东
			var phoneBox=$(opts.phoneBox,form);
			var phoneSend=$(opts.phoneSend,form);
			var phoneSendTxt=phoneSend.text();//默认发送验证码里面的文字
			var phoneIpt=$(opts.phoneIpt,form);
			var downCount;//倒计时
			var downTime=2*60;//倒计时秒数
			if(!opts.isPhone){phoneBox.hide();}
			else{phoneBox.show();}
			function phoneFn(){
				var val=phoneIpt.val();
				if(!val){dialog.tips({content:'请先填写手机号'});return;}
				if(downTime!=2*60)return;
				phoneSend.text(downTime+'秒后再次发送');
				downCount=setInterval(function(){
					downTime--;
					phoneSend.text(downTime+'秒后再次发送');
					if(downTime==0){
						phoneSend.text(phoneSendTxt);
						downTime=2*60;
						clearInterval(downCount);
					}
				},1000);
				validForm.request({
					url:'?m=member&a=sms_captcha&mobile='+val,
					success:function(ret){
						dialog.alert({content:ret.info});
					}
				});
			}
			phoneSend.bind("click",function(){phoneFn();});
			$.Datatype.account=function(gets,obj,curform,regxp){
				var status=false;
				if(reg1 && reg1.test(gets)){status=true;}
				if(reg2 && reg2.test(gets)){status=true;}
				if(reg3 && reg3.test(gets)){status=true;}
				if((base.register==0 || base.register==1 || base.register==3) && regM.test(gets)){//如果是一个手机的话显示短信验证码
					phoneBox.show();
				}else{
					phoneBox.hide();
				}
				if(status){
					validForm.request({
						url:'?m=member&c=index&a=verify&t=verify_account&no='+gets,
						isJson:true,
						async:false,
						success:function(ret){
							if(!ret.status){
								status=false;
								dialog.tips({content:'该账号已经有人使用'});
							}else{
								status=true;
							}
						}
					});
				}
				return status;
			}
			validForm.form({
				target:form,
				url:'?m=member&a=register',
				btnSubmit:opts.btnSubmit,
				success:function(ret){
					if(ret.status){
						if($.isFunction(opts.success)){
							opts.success(ret,_this[0]);
						}else{
							dialog.tips({
								content:ret.info.info,
								callback:function(){
									if(ret.url){
										location.href=ret.url;
									}else{
										location.href='?m=member&c=index&a=login';
									}
								}
							});
						}
					}else{
						dialog.tips({content:ret.info});
						if(opts.isVcode){
							vcodeIpt.val('');
							vcodeFn();
						}
					}
				}
			});
        });
    }

    //登陆的接口
    var login=function(a){
        var a=a||{};
        var defaults={
            target:'[data-login-form]',
            btnSubmit:'.btnSubmit',
//            isVcode:false,
            vcodeBox:'.vcodeBox',
            vcodeIpt:'.vcodeIpt',
            vcodeImg:'.vcodeImg',
            success:''
        };
        var opts=$.extend(defaults,a);
        var target=$(opts.target);
		require.async(['validForm','fnDialog'],function(validForm,dialog){
			$.each(target,function(i,n){
				var _this=$(n);
				var form;
				if(_this.is('form')){
					form=_this;
				}else{
					form=_this.find('form');
				}
				var vcodeBox=$(opts.vcodeBox,form);
				var vcodeIpt=$(opts.vcodeIpt,form);
				var vcodeImg=$(opts.vcodeImg,form);
//				if(opts.isVcode){vcodeBox.hide();}
//				else{vcodeBox.show();vcodeFn();}
				function vcodeFn(){vcodeBox.show();vcodeImg.attr('src','api.php?n=vcode&width=160&height=50&t='+Math.round(Math.random()*10000));};
				vcodeImg.bind("click",function(){vcodeFn();});
				//验证的东东
				validForm.request({
					url:'?m=member&c=index&a=is_vcode',
					success:function(ret){
						if(ret.status){opts.isVcode=true;vcodeBox.show();vcodeFn();}
						else{opts.isVcode=false;vcodeBox.hide();}
					}
				});
				validForm.form({
					target:form,
					url:'?m=member&c=index&a=login',
					btnSubmit:opts.btnSubmit,
					success:function(ret){
						if(ret.status){
							dialog.tips({
								content:ret.info,
								callback:function(){
									if($.isFunction(opts.success)){
										opts.success(_this[0]);
									}else{
										if(ret.url){
											location.href=ret.url;
										}else{
											location.href='?m=member';
										}
									}
								}
							});
						}else{
							dialog.tips({content:ret.info});
							// if(opts.isVcode){
								vcodeIpt.val('');
								vcodeFn();
							// }
						}
					}
				});
			});
		});
    }
    //判断css是否加载了，然后加载
    var loadCss=function(a){
        var a=a||{};
        var defaults={url:''};
        var opts=$.extend(defaults,a);
        var isCss=false;
		$('link').each(function() {
            var _this=$(this);
			if(_this.attr('href').indexOf('comment')!=-1){
				isCss=true;
				return false;
			}
        });
		if(!isCss){
			$('head').append('<link href="'+opts.url+'" rel="stylesheet" type="text/css" />');
		}
    };

    /*
        点击加载更多
        <script type="text/html" id="clickPage">
        </script>
    */
    var clickPage=function(a){
        if(!(this instanceof clickPage)){
            return new clickPage(a);
        }
        var a=a||{};
        var defaults={
            target:'[data-clickPage]',
			isPage:false,
			pageBox:'.j-clickPageBox',
            curPage:1,
            pageSize:'',
            tpl:'',
            url:document.location.href,
            isClick:true
        };
        var opts=$.extend(defaults,a);
        var _this=this;
        if(opts.target)_this.target=$(opts.target);
        _this.isClick=opts.isClick;
        _this.isLoading=false;//是否在加载
        _this.isComplete=false;//是否已经全部加载完
        _this.curPage=opts.curPage;//当前页码
        _this.pageSize=opts.pageSize;//每页加载的个数
        _this.url=opts.url;//请求地址
        _this.success=function(){};//请求成功执行的函数
        _this.successBefore=function(){};
        _this.complete=function(){};//请求完成函数
        _this.requestPage=function(){
            _this.isLoading=true;
            _this.curPage++;
            require.async('validForm',function(validForm){
                validForm.request({
                    url:_this.url+'&page='+_this.curPage+(_this.pageSize?('&pagesize='+_this.pageSize):''),
                    before:function(){_this.successBefore();},
                    isJson:true,
                    success:function(ret){
                        _this.isLoading=false;
                        _this.success(ret);//触发成功函数
                    }
                });
            });
        }
        _this.init=function(opts){
			var opts=opts || {};
            _this.isLoading=false;//是否在加载
            _this.isComplete=false;//是否已经全部加载完
            _this.curPage=opts.curPage;//当前页码
            _this.target.show();
            _this.successBefore();
            _this.requestPage();
        }
        if(_this.isClick){
            _this.target.on('click',function(){
                if(_this.isLoading || _this.isComplete)return;
                _this.requestPage();
            });
        }
        _this.click=function(){
            if(_this.isLoading || _this.isComplete)return;
            _this.requestPage();
        }
		if(!opts.isPage){
			if(_this.curPage==0){_this.successBefore();_this.requestPage();}
		}else{
			require.async('pages',function(pages){
				pages.init({
					pageBox:opts.pageBox,
					url:opts.url,
					pageCur:opts.curPage,
					callback:function(cfg,items){
						_this.success(items);//触发成功函数
					}
				});
			})
		}
        return _this;
    }

    //限制一个div里面的内容不超出
    var limitContainer=function(a){
        var a=a||{};
        var defaults={
            target:'[data-limitContainer]'
        };
        var opts=$.extend(defaults,a);
        var target=$(opts.target);
        var maxW=target.width();
        if(target.size()==0)return;
        target.addClass('limitContainer');
        //table and iframe and img
        var tab=target.find('table');
        var iframe=target.find('iframe');
        // var img=target.find('img');
        // var limit=tab.add(iframe).add(img);
        var limit=tab.add(iframe);
        if(limit.size()>0){
            $.each(limit,function(i,n){
            	var _n=$(n);
                if(_n.outerWidth()>maxW){
					_n.css({'padding':'0','margin-left':'0','margin-right':'0','width':'100%','height':'auto'});
				}
            });
        }
        require.async(['waitforimages'],function(waitforimages){
	        target.waitForImages({
	        	each:function(){
	        		var _n=$(this);
	        		if(_n.outerWidth()>maxW){
						_n.css({'padding':'0','margin-left':'0','margin-right':'0','width':'100%','height':'auto'});
					}
	        	}
	        });
        });
    };


	//限制image在div里面的布局
	var limitImg=function(a){
		var a=a||{};
		var defaults={
			target:'.j-limitImg',
			callback:function(){}
		};
		var opts=$.extend(defaults,a);
        require.async(['waitforimages'],function(waitforimages){
            var $target;
            if(opts.target instanceof jQuery){
                $target=opts.target;
            }else{
                $target=$(opts.target);
            }
            $target.waitForImages({
                each:function(){
                    var $img=$(this);
                    var $parent=$img.closest(opts.target);
                    var maxW=$parent.width();
                    var maxH=$parent.height();
                    var w=$img[0].naturalWidth;//获取实际宽
                    var h=$img[0].naturalHeight;//获取实际高
                    $img.width(maxW);
                    var tmpH=(h/w)*maxW;
                    if(tmpH>maxH){
                        var margin=(tmpH-maxH)/3;
                        $img.css({'margin':'-'+margin+'px 0 -'+2*margin+'px 0','height':'auto'});
                    }else{
                        var w=(w/h)*maxH;
                        var margin=(w-maxW)/2;
                        $img.css({'height':maxH,'width':w+'px','margin':'0 -'+margin+'px 0 -'+margin+'px'});
                    }
                    opts.callback($img);
                }
            });
        })
	}

    //截取字符
    var toLimit=function(str,num){
        if(!str || !num)return '';
        str=str.replace(/<[^>].*?>/g,"");
        str=str.replace(/(&#60;)(?!&#62;).*?(&#62;)/g,"");
        if(str.length>num){
            str=str.substring(0,num);
        }
        return str?str:'';
    }

	//滚动目录
	var scrollMenu=function(a){
		var a=a||{};
		var defaults={
			btn:'.j-scrollMenuBtn',
			target:'.j-scrollMenuTarget',
			activitiedClassName:'on',//激活的class
			y:10//偏移量
		};
		var opts=$.extend({},defaults,a);
		var $menuBtn=$(opts.btn+'[data-menu][data-menu!=""]');
		var $menuTarget=$(opts.target+'[data-menu][data-menu!=""]');
		var $window=$(window);
		var height=$window.height();
        $window.on('scroll',function(){
			var windowScrollTop=$window.scrollTop();
			$.each($menuTarget,function(){
				var $this=$(this);
				var offset=$this.offset();
				if(offset.top>windowScrollTop && offset.top<windowScrollTop+height){
					$menuBtn.removeClass(opts.activitiedClassName);
					var menu=$this.data('menu');
                    $menuBtn.filter('[data-menu='+menu+']').addClass(opts.activitiedClassName);
                    return false;
                }
			})
        });
		$menuBtn.click(function(){
			var $this=$(this);
			var menu=$this.data('menu');
			var top=$menuTarget.filter('[data-menu='+menu+']').offset().top-parseInt(opts.y);
			$('html,body').animate({'scrollTop':top},200);
		});
	};

    /*
    * 常用功能函数
    */
    window.yst={
		algorithm:function(){
			//会员中心跳转
	    	gotoMember({title:'机制商品',url:'?m=algorithm&c=index&a=index'});
	    },
		recharge:function(){
			//在线充值
	    	gotoMember({title:'我的资产',url:'?m=financial&c=recharge'});
	    },
		cardBinding:function(){
			//卡包
	    	gotoMember({title:'我的资产',url:'?m=financial&c=card&a=index'});
	    }
	};

	module.exports={
		_blank:_blank,//先窗口打开
		memberInit:memberInit,//首页会员中心
		parseUrl:parseUrl,//解析URL
        clickPage:clickPage,//点击加载更多
		limitImg:limitImg,//限制image在div里面的布局
        limitContainer:limitContainer,//限制一个div里面的图片不超出div
        toLimit:toLimit,//截取字符
        quote:quote,//收藏相关
        register:register,//注册接口
        login:login,//登陆接口
        getLogin:getLogin,//弹出登陆窗口
        updataLoginInfo:loginInfo,//更新页面上的账号信息
		loginInfo:loginInfo,//绑定页面的登陆信息
        getLoginInfo:getLoginInfo,//获得账号信息
        getLoginNames:getLoginNames,//获取登陆会员的name和mobile
		isLogin:isLogin,//判断是否登陆
		bindLogin:bindLogin,//绑定某个按钮登陆
		slide:slide,//幻灯
		IE:IE,//IE版本号
		fix:fix,//div跟滚动滚动
		getDate:getDate,//获取系统时间
		changeQuantity:changeQuantity,//改变数量
        addOrder:addOrder,//直接购买
        addCart:addCart,//添加购物车
		bindGoMember:bindGoMember,//绑定会员中心跳转
        gotoMember:gotoMember,//往会员中心跳转
        goMember:goMember,//点击往会员中心跳转
        countdown:countdown,//团购时间
        loadCss:loadCss,//判断css是否加载了，然后加载
		scrollMenu:scrollMenu,//滚动菜单
		browser:browser//终端的信息
	}
})
