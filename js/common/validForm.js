// JavaScript Document

define(function(require,exports,module){
	require('jquery');
	require('../plugins/validform/Validform.js');
	require('form');

    var debug=false;
    if(window.top.location!=window.location){
    	debug=$(window.top.window.document).find('body').attr('debug');
    	debug==1?debug=true:debug=false;
	}

	var form=function(a){
        var a=a||{};
		var defaults={
			target:'form:first',
			isLogin:false,
			isLoginReload:true,
            defense:true,
			btnSubmit:'',
			url:'',
			type:'POST',
			before:'',
			success:'',
			async:false
		}
		var opts=$.extend(defaults,a);
		var _this;
		if(opts.target instanceof jQuery){
			_this=opts.target;
		}else{
			_this=$(opts.target);
		}
		var	valid=_this.Validform({
			btnSubmit:opts.btnSubmit,
			beforeCheck:opts.beforeCheck,
			tiptype:function(msg,o,cssctl){
				if(!o.obj.is("form")){
                    var parent=o.obj.parent();
                    var _thisP;
                    if(parent.is('[data-msg-parent]')){
                        _thisP=parent;
                    }
                    else{
                       _thisP=o.obj;
                    }
                    var objtip=_thisP.next('.u-msg');
                    if(objtip.size()==0){
                        objtip=$('<span class="u-msg f-ml15"></span>')
                    }
                    _thisP.after(objtip);
                    cssctl(objtip,o.type);
                    objtip.text(msg);
				}
			},
			datatype:{
				"z2-4" :/^[\u4E00-\u9FA5\uf900-\ufa2d]{2,4}$/,
				"domain":/^(?!http:\/\/)?(?!www\.)?.*$/,//域名正则匹配
				"domains":/^(?!http:\/\/|www)+.*$/,//域名正则匹配
				"f2-4":/^\d+(\.\d{2,4})?$/,//浮点价格
				"urls":/^(\w+:\/\/)\w+(\.\w+)+.*$/,//http域名正则
                "validAccount":function(gets,obj,curform,datatype){
                    var _this=$(obj);
                    var status;
                    if(_this.data('tx')){_this.val(_this.data('other'));return true;}
                    var url='?m=common&c=index&a=member&keywords=';
                    _this.data('url')?url=_this.data('url'):'';
                    request({
                        url:url+gets,
                        async:false,
                        success:function(ret){
                            if(ret.status){
                                status=true;
                                _this.val(ret.info.name+'('+gets+')');
                                if(_this.data('name')){
                                    var name=_this.data('name');
                                }else{
                                    var name=_this.attr('name');
                                    _this.data('name',name);
                                    _this.removeAttr('name');
                                }
                                _this.data('tx',true);
                                _this.data('account',gets);
                                _this.data('other',_this.val());
                                var next=_this.prev('input[name='+name+']');
                                if(next.size()>0){next.val(ret.info.id);}
                                else{_this.before('<input type="hidden" name="'+name+'" value="'+ret.info.id+'" />');}
                            }else{
                                status=ret.info;
                                _this.data('account','');
                                _this.data('tx',false);
                            }
                        }
                    });
                    _this.focus(function(){
                        var $this=$(this);
                        var account=$this.data('account');
                        if(account){
                            $this.val(account);
                        }
                    });
                    _this.keyup(function(){
                        if(_this.val()!=_this.data('account'))_this.data('tx',false);
                    });
                    return status;
                },
				"idcard":function(gets,obj,curform,datatype){
					var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];// 加权因子;
					var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];// 身份证验证位值，10代表X;

					if (gets.length == 15) {
						return isValidityBrithBy15IdCard(gets);
					}else if (gets.length == 18){
						var a_idCard = gets.split("");// 得到身份证数组
						if (isValidityBrithBy18IdCard(gets)&&isTrueValidateCodeBy18IdCard(a_idCard)) {
							return true;
						}
						return false;
					}
					return false;

					function isTrueValidateCodeBy18IdCard(a_idCard) {
						var sum = 0; // 声明加权求和变量
						if (a_idCard[17].toLowerCase() == 'x') {
							a_idCard[17] = 10;// 将最后位为x的验证码替换为10方便后续操作
						}
						for ( var i = 0; i < 17; i++) {
							sum += Wi[i] * a_idCard[i];// 加权求和
						}
						valCodePosition = sum % 11;// 得到验证码所位置
						if (a_idCard[17] == ValideCode[valCodePosition]) {
							return true;
						}
						return false;
					}

					function isValidityBrithBy18IdCard(idCard18){
						var year = idCard18.substring(6,10);
						var month = idCard18.substring(10,12);
						var day = idCard18.substring(12,14);
						var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
						// 这里用getFullYear()获取年份，避免千年虫问题
						if(temp_date.getFullYear()!=parseFloat(year) || temp_date.getMonth()!=parseFloat(month)-1 || temp_date.getDate()!=parseFloat(day)){
							return false;
						}
						return true;
					}

					function isValidityBrithBy15IdCard(idCard15){
						var year =  idCard15.substring(6,8);
						var month = idCard15.substring(8,10);
						var day = idCard15.substring(10,12);
						var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
						// 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
						if(temp_date.getYear()!=parseFloat(year) || temp_date.getMonth()!=parseFloat(month)-1 || temp_date.getDate()!=parseFloat(day)){
							return false;
						}
						return true;
					}

				}
			},
			ignoreHidden:true,//:hidden的表单元素将不做验证;
			// postonce:true,//开启二次提交防御
			callback:function(data){
				var tx=true;
				if(opts.isLogin){
	                require.async(['box'],function(box){
	                    if(!box.isLogin()){
	                        tx=false;
	                        box.getLogin({callback:function(){if(opts.isLoginReload){window.location.reload();}}});
	                    }
						callback();
	                });
	            }else{
					callback();
				}
                function callback(){
                	if($.isFunction(opts.before) && opts.before(data[0],opts)==false)tx=false;
					if(tx){
                        var $submitObj=data.find('input[type=submit]');
                        var defaultValue=$submitObj.val();
						if(!opts.url){_this.attr('action')==''?opts.url=location.href:opts.url=_this.attr('action');}
						data.ajaxSubmit({
							url:opts.url,
							type:opts.type,
                            beforeSubmit:function(){
                                if(opts.defense && !debug){
                                    $submitObj.val('正在提交');
                                    $submitObj.prop({disabled:true});
                                }
                            },
							dataType:'json',
							success:function(){
                                if(opts.defense && !debug){
                                    $submitObj.val(defaultValue);
                                    $submitObj.prop({disabled:false});
                                }
                                opts.success.apply(data,arguments);
                            },
                            error:function(){
                                if(opts.defense && !debug){
                                    $submitObj.val(defaultValue);
                                    $submitObj.prop({disabled:false});
                                }
                            }
						});
					}
                }
				return false;
			}
		});
		return valid;
	}

	function request(a){
		var a=a||{};
        var defaults={
            url:'',
            isJson:false,
            isLogin:false,
            isLoginReload:false,
            type:'GET',
            dataType:'json',
            async:true,
            data:'',
            before:'',
            success:''
        };
		var opts=$.extend(defaults,a);
        var tx=true;
        if(opts.isLogin){
            require.async(['box'],function(box){
                if(!box.isLogin()){
                    tx=false;
                    box.getLogin({callback:function(){if(opts.isLoginReload){window.location.reload();}}});
                }
				callback();
            });
        }else{
			callback();
		}
        function callback(){
        	if($.isFunction(opts.before) && opts.before()=='false')tx=false;
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
	}

    //异步请求
    var deferFn=function(a){
        var a=a||{};
        var defaults={
            url:'',
            dataType:'JSON'
        };
        var opts=$.extend(defaults,a);
        var data;
        request({
            async:false,
            url:opts.url,
            dataType:opts.dataType,
            success:function(ret){
                data=ret;
            }
        });
        return data;
    }

	var confirm=function(a){
		var a=a || {};
		var opts={
			url:a.url || '',
			content:a.content || '是否确认删除此数据（注意：此操作不可还原）',
			type:'GET',
			dataType:a.dataType || 'json',
			async:a.async || true,
			data:a.data || '',
			success:a.success || function(){}
		}
		require.async(['fnDialog'],function(dialog){
			dialog.alert({
				content:opts.content,
				button:[
					{
						value:'确定',
						callback:function(){
							$.ajax(opts);
							this.close();
							this.remove();
						},
						autofocus: true
					},
					{
						value:'取消',
						vallback:function(){
							this.close();
							this.remove();
						}
					}
				]
			});
		});
	}
	module.exports={
		form:form,
		request:request,
        defer:deferFn,
		confirm:confirm
	}
});
