define('aForm',function(require, exports, module){
	require('aHttp');
	require('zepto');
    var simpop=require('simpop');
	var angular=require('angular');
	var form=angular.module('aForm',['aHttp']);
	form.directive('uTxt',function($parse){
		return {
			restrict:'C',
			require:'?ngModel',
			link:function(scope,ele,attrs,ngModel){
				if(ngModel && !$parse(attrs.ngModel)(scope) && attrs.value){
					ngModel.$setViewValue(attrs.value);
				}
			}
		}
	});
	//当需要绑定的model是动态生成的时候用这个指令
	form.directive('myModel',function($parse){
		return{
			restrict:'A',
			link:function(scope,ele,attrs){
				var model=$parse(attrs.myModel);
				//设置scope
				function setScope(bind,val){
					model.assign(scope,val);
					if(attrs.myChange)scope.$eval(attrs.myChange);
				}
				//从view到model
				ele.bind('keyup',function(){
					setScope(attrs.myModel,ele.val());
					scope.$apply();
				});
				ele.bind('paste',function(){
					setScope(attrs.myModel,ele.val());
					scope.$apply();
				});
				//设置默认值
				if(attrs.value){
					setScope(attrs.myModel,attrs.value);
				}
			}
		}
	});
	form.directive('uTxtarea',function($parse){
		return {
			restrict:'C',
			require:'?ngModel',
			link:function(scope,ele,attrs,ngModel){
				if(ngModel && !$parse(attrs.ngModel)(scope) && ele.val()){
					ngModel.$setViewValue(ele.val());
				}
			}
		}
	});
	form.directive('mySlt',function($parse){
		return {
			restrict:'EAC',
			require:'?ngModel',
			link:function(scope,ele,attrs,ngModel){
				if(ngModel && !$parse(attrs.ngModel)(scope)){
					var val=attrs.def;
					if(!val){
						val=$(ele[0]).find('option:first-child').attr('value');
					}
					$(ele[0]).val(val);
					ngModel.$setViewValue(val);
				}
			}
		}
	});
	form.directive('myInit',function($parse){
		return {
			restrict:'EAC',
            require:'?ngModel',
			link:function(scope,ele,attrs,ngModel){
				if($parse(attrs.myInit)(scope)==undefined){
                    if(ngModel){
                        // console.log(attrs.value);
                        ngModel.$setViewValue(attrs.value);
                        // $parse(attrs.myInit).assign(scope,attrs.value);
                        // console.log($parse(attrs.ngModel)(scope));
                    }else{
                       $parse(attrs.myInit).assign(scope,attrs.value);
                    }
                }
			}
		}
	});
	form.directive('mySref',function($location,$window,$parse,store){
		return{
			restrict:'A',
			// scope:{
			// 	store:'=store'
			// },
			link:function(scope,ele,attrs){
				var state=attrs.mySref;
				var storeArr=[];
				ele.bind('click',function(event){
					if(attrs.store)storeArr=attrs.store.split(',');
					if(state){
						var obj={};
						for(var i=0,n=storeArr.length;i<n;i++){
							obj[storeArr[i]]=$parse(storeArr[i])(scope);
						}
						store.setStore(obj);
						if(attrs.before){
							var tx=scope.$eval(attrs.before);
							scope.$apply();
							if(tx===false)return;
						}
						$location.url('/'+state);
						$window.location.href=$location.absUrl();
					}
				})
			}
		}
	});
	form.directive('uRadio',function($parse){
		return {
			restrict:'C',
			scope:{
				ngModel:'=ngModel'
			},
			link:function(scope,ele,attrs){
				if(attrs.ngModel && scope.ngModel==undefined && attrs.ngChecked){
					if(attrs.ngValue!=undefined){
						scope.ngModel=attrs.ngValue;
					}else{
						scope.ngModel=true;
					}
				}
			}
		}
	});
	form.factory('REG',function(){
		var obj={};
		obj.reg={
			'*':/[\w\W]+/,//任意字符
			'*2-5':/[\w\W]{2,5}/,
			'n':/^\d+$/,//整数
			'n2-5':/^\d{2,5}$/,
			'f':/^\d+(\.\d+)?$/,//小数或者整数
			'f2-5':/^\d+(\.\d{2,5})?$/,//2-5位小数
			'p':/^[0-9]{6}$/,//邮编
			'm':/^1\d{10}$/,//手机
			'e':/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,//邮箱
			'url':/^(\w+:\/\/)?\w+(\.\w+)+.*$/,//网址
			"domain":/^(?!http:\/\/|www)+.*$///域名正则匹配
		};
		return obj;
	})
	form.factory('showMsg',function(){
		var obj={};
		var $body=$('body');
		var $msg=$('<div class="u-error show"></div>');
		var MSG={};
		obj.msg=MSG;
		obj.showMsg=function(a){
			var a=a||{};
			var defaults={
				id:new Date().getTime(),
				msg:'请填写正确信息'
			};
			var opts=angular.extend(defaults,a);
			if(!MSG[opts.id]){
				var $tmp=$msg.clone().text(opts.msg);
				MSG[opts.id]=$tmp[0];
				$body.append($tmp);
			}
			return opts.id;
		};
		obj.closeMsg=function(a){
			var a=a||{};
			var defaults={
				id:''
			};
			var opts=angular.extend(defaults,a);
			if(!opts.id)return;
			var $tmp=$(MSG[opts.id]);
			delete MSG[opts.id];
			$tmp.remove();
			return opts.id;
		}
		return obj;
	})

	form.directive('myPattern',function(REG,showMsg){
		return{
			restrict:'A',
			require:'ngModel',
			link:function(scope,ele,attrs,ngModel){
				if(!ngModel || !attrs.myPattern)return;
				var angularEle=angular.element(ele);
				ngModel.$parsers.unshift(function(viewValue){
					var regPattern=/\/(.+)\//g;//匹配正则标签
					var pattern=attrs.myPattern;//获得需要匹配的正则标签
					var pass=true;//测试是否通过
					var result=regPattern.exec(pattern);//匹配正则标签的结果
					var regResult;//获得最后的正则
					var isFunction=false;//pattern是否是函数
					var fnReturnVal;//函数返回结果
					var msg='请输入正确的信息';//错误信息的内容
					//添加真值是否为空class
					if(viewValue==''){
						angularEle.addClass('my-nullValue');
					}else{
						angularEle.removeClass('my-nullValue');
					}
					if(scope[pattern] && $.type(scope[pattern])=='function'){
						isFunction=true;
						fnReturnVal=scope.$eval(pattern);
						if($.type(fnReturnVal)=='string')msg=fnReturnVal;
					}
					//获取结果验证正则
					if(isFunction){
						regResult=fnReturnVal;
					}else if(result){
						//如果是正则表达式,创建结果验证正则
						regResult=new RegExp(result[1],"g")
					}else if(REG.reg[pattern]){
						//如果是预设好的正则表达式，直接获得结果验证表达式
						regResult=REG.reg[pattern];
					}else{
						//如果是预设表达式切有个数限制，先匹配出个数在拼接结果验证表达式
						var regNum=/^(.+?)(\d+-\d+)$/g;
						var regNumResult=regNum.exec(pattern);//匹配pattern结果
						if(regNumResult[1] && REG.reg[regNumResult[1]] && regNumResult[2]){
							var arr=regNumResult[2].split('-');
							var regTmp=/\{\d+?\,\d+?\}/g;//匹配已存在的正则表达式里面的个数{2,5};
							var regString=REG.reg[regNumResult[1]+'2-5'].toString();
//							console.log(regString);
//							console.log(regTmp.exec(regString));
//							console.log(regString.replace(regTmp,'{'+arr[0]+','+arr[1]+'}'));
//							console.log(regString.replace(regTmp,'{'+arr[0]+','+arr[1]+'}').slice(1,-1));
							regResult=new RegExp(regString.replace(regTmp,'{'+arr[0]+','+arr[1]+'}').slice(1,-1),'g');
//							console.log(regResult);
						}
					}
					//判断当值为空的时候是否验证
					var isValid=true;//是否验证
					if(!attrs.required && !viewValue)isValid=false;
					if(isValid){
						if((isFunction && (fnReturnVal==false || $.type(fnReturnVal)=='string')) || (!isFunction && regResult && !regResult.test(viewValue))){
							pass=false;
							ngModel.$setValidity('myPattern',false);
						}else{
							pass=true;
							ngModel.$setValidity('myPattern',true);
						}
					}else{
						pass=true;
						ngModel.$setValidity('myPattern',true);
					}
					//获取显示错误信息的弹窗id;
					var showMsgId;
					if(angularEle.data('showMsgId')){
						showMsgId=angularEle.data('showMsgId');
					}else{
						showMsgId=new Date().getTime();
						angularEle.data('showMsgId',showMsgId);
					}
					//获取错误显示内容
					if(ngModel.$error.myPattern){
						msg=attrs.errormsg?attrs.errormsg:msg;
					}
					//当失去焦点的时候删除它的错误信息提示
					ele.bind('blur',function(){
						showMsg.closeMsg({id:showMsgId});
					});
					//当获取焦点的时候显示它的错误信息提示
					ele.bind('focus',function(){
						if(pass){
							showMsg.closeMsg({id:showMsgId});
						}else{
							showMsg.showMsg({msg:msg,id:showMsgId});
						}
					});
					//最后返回信息
					if(pass){
						showMsg.closeMsg({id:showMsgId});
						return viewValue;
					}
					else{
						showMsg.showMsg({msg:msg,id:showMsgId});
						return undefined;
					}
				});
			}
		}
	});
    //value=name,1
	form.directive('slt',function(classify){
		return {
			restrict:'A',
			compile:function(ele,attrs,transclude){
                //血型（blood）、性别（sex）、属相（zodiac）、星座（constellation）、职业（profession）、学历（educational）、年龄（age）、行业（industry）
				var blood=["A型","B型","O型","AB型","其他"];
				var sex=["男","女"];
				var zodiac=["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];
				var constellation={"121-219":"水瓶座","220-320":"双鱼座","321-420":"白羊座","421-521":"金牛座","522-621":"双子座","622-722":"巨蟹座","723-823":"狮子座","824-923":"处女座","924-1023":"天秤座","1024-1122":"天蝎座","1123-1221":"射手座","1222-120":"魔羯座"};
				var profession=["在校学生","固定工作者","自由职业者","待业/无业/失业","退休","其他"];
				var educational=["小学以下","初中","高中","中专","大专","本科","研究生","博士及以上"];
				var _this=$(ele[0]);
				var option=_this.find('option');
				var tpl='';
				var arr=[];
				if(option.size()==0){
					tpl='<option value="">请选择</option>';
				}
				if(attrs.slt=='blood')arr=blood;
				if(attrs.slt=='sex')arr=sex;
				if(attrs.slt=='zodiac')arr=zodiac;
				if(attrs.slt=='profession')arr=profession;
				if(attrs.slt=='educational')arr=educational;
				if(attrs.slt=='constellation'){
					angular.forEach(constellation,function(n){
						arr.push(n);
					})
				}
				if(attrs.slt=='age'){
					for(var i=12;i<120;i++){
						arr.push(i);
					}
				}
                if(attrs.slt=='industry'){//所属行业
                    $.ajax({
                        url:'/js/dict/dict_'+attrs.slt+'.js',
                        dataType:'json',
                        async:false,
                        success:function(DATA){
                            arr=DATA;
                            angular.forEach(arr,function(n){
                                tpl+='<option value="'+n.name+'">'+n.name+'</option>';
                            })
                            _this.append(tpl);
                        }
                    })
                }else{//其他的处理
                    angular.forEach(arr,function(n){
                        tpl+='<option value="'+n+'">'+n+'</option>';
                    });
                    _this.append(tpl);
                }

			}
		}
	});
	form.directive('switchchildren',function(){
        return{
            restrict:'A',
            link:function(scope,ele,attrs){
                var _this=$(ele[0]);
                var $ipt=_this.find('input');
                var $hide=_this.children().eq(1);
                $hide.show();
                $ipt.hide();
                $(ele[0]).click(function(){
                    $ipt.show();
                    $hide.hide();
                    $ipt.focus();
                });
                $ipt.blur(function(){
                    $ipt.hide();
                    $hide.show();
                });
            }
        }
    })
	form.factory('editorFactory',function(){
		var obj={};
		obj.range='';
		obj.resultData;//返回的数据
		obj.removeResult=function(){
			obj.resultData=undefined;
			obj.isResult=false;
		}
		obj.setResult=function(id,result){
			obj.resultData={id:id,result:result};
		}
		obj.getResult=function(){
			var result=obj.resultData;;
			obj.resultData=undefined;
			return result;
		}
		return obj;
	})
	//https://github.com/akatov/angular-contenteditable
	form.directive('editor', ['$timeout','$parse','editorFactory', function($timeout,$parse,editorFactory) {
	    return {
	        restrict: 'AE',
	        require: '?ngModel',
			transclude: true,
			replace: true,
			scope:true,
            template: '<div class="j-ueditor ueditor"><div class="tools"><a class="del f-fr f-mr10" ng-click="clear();">清空</a><a class="uploadimage icon" my-sref="upload/image?id=editorImage&size=2" store="{{store}}">上传图片</a></div><div class="u-txtarea j-editor" contenteditable="true" style="width:100%;overflow-y:scroll;min-height:150px;" ng-style="style" ng-transclude="true"></div><div class="j-ueditor ueditor"><div class="tools f-mt10"><a class="delf-mr10" ng-click="br();">插入新一行</a></div></div>',
	        link: function(scope, element, attrs, ngModel) {
				var editor=element.find('.j-editor');
	            // don't do anything unless this is actually bound to a model
	            if (!ngModel) {
	                return
	            }
	            // options
	            var opts = {}
	            angular.forEach([
	                'stripBr',
	                'noLineBreaks',
	                'selectNonEditable',
	                'moveCaretToEndOnChange',
	                'stripTags'
	            ], function(opt) {
	                var o = attrs[opt]
	                opts[opt] = o && o !== 'false'
	            })
				scope.style={};
				scope.store=attrs.store;

				//默认值
				if(!$parse(attrs.ngModel)(scope))ngModel.$setViewValue(editor.html());

				//清空函数
				scope.clear=function(){
					editor.html('');
					ngModel.$setViewValue('');
				}
				//换行函数
				scope.br=function(){
					var html=editor.html();
					editor.html(html+'<div><br/></div>')
				}

	            // view -> model
	            editor.bind('input', function(e) {
	                scope.$apply(function() {
	                    var html, html2, rerender
	                    html = editor.html()
	                    rerender = false
	                    if (opts.stripBr) {
	                        html = html.replace(/<br>$/, '')
	                    }
	                    if (opts.noLineBreaks) {
	                        html2 = html.replace(/<div>/g, '').replace(/<br>/g, '').replace(/<\/div>/g, '')
	                        if (html2 !== html) {
	                            rerender = true
	                            html = html2
	                        }
	                    }
	                    if (opts.stripTags) {
	                        rerender = true
	                        html = html.replace(/<\S[^><]*>/g, '')
	                    }
	                    ngModel.$setViewValue(html)
	                    if (rerender) {
	                        ngModel.$render()
	                    }
	                    if (html === '') {
	                        // the cursor disappears if the contents is empty
	                        // so we need to refocus
	                        $timeout(function() {
	                            editor[0].blur()
	                            editor[0].focus()
	                        })
	                    }
	                })
	            })

	            // model -> view
	            var oldRender = ngModel.$render
	            ngModel.$render = function() {
	                var el, el2, range, sel
	                if (!!oldRender) {
	                    oldRender()
	                }
	                var html = ngModel.$viewValue || '';
	                if (opts.stripTags) {
	                    html = html.replace(/<\S[^><]*>/g, '')
	                }
					// if(!html){
					// 	//默认值
					// 	var defHtml=attrs.def;
					// 	ngModel.$setViewValue(defHtml);
					// 	html=defHtml;
					// }
	                editor.html(html)
	                if (opts.moveCaretToEndOnChange) {
	                    el = editor[0]
	                    range = document.createRange()
	                    sel = window.getSelection()
	                    if (el.childNodes.length > 0) {
	                        el2 = el.childNodes[el.childNodes.length - 1]
	                        range.setStartAfter(el2)
	                    } else {
	                        range.setStartAfter(el)
	                    }
	                    range.collapse(true)
	                    sel.removeAllRanges()
	                    sel.addRange(range)
	                }
	            }
	            if (opts.selectNonEditable) {
	                editor.bind('click', function(e) {
	                    var range, sel, target
	                    target = e.toElement
	                    if (target !== this && angular.element(target).attr('contenteditable') === 'false') {
	                        range = document.createRange()
	                        sel = window.getSelection()
	                        range.setStartBefore(target)
	                        range.setEndAfter(target)
	                        sel.removeAllRanges()
	                        sel.addRange(range)
	                    }
	                })
	            }

				scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
					if(fromParams && fromParams.id=='editorImage'){
						var returnData=editorFactory.getResult();
						if(returnData){
							$timeout(function(){
								var oldHtml=editor.html();
								var str='';
								returnData.result.forEach(function(item){
									str+='<img src="'+item.filepath+'" style="max-width:100%;" />'
								});
								editor.html(oldHtml+str);
								ngModel.$setViewValue(oldHtml+str);
							},0)
						}
					}
				})

	        }
	    }
	}]);
	form.directive('ueditor', function ($timeout,$parse) {
        return {
            restrict: 'AE',
            transclude: true,
            replace: true,
            template: '<div class="j-ueditor ueditor"><div class="tools"><a class="del f-fr f-mr10">清空</a><a class="bold icon">加粗</a><a class="italic icon">斜体</a><a class="underline icon">下划线</a><a class="fontsize icon">字体大小</a></div><script type="text/plain" style="height:200px;width:100%;" ng-transclude id="myEditor1"></script></div>',
            require: '?ngModel',
            scope: {
                config: '='
            },
            link: function (scope, element, attrs, ngModel) {
            	var $editor=$(element[0]).find('script');
                var $tools=$(element[0]).find('.tools');
                if(!$parse(attrs.ngModel)(scope.$parent))ngModel.$setViewValue($editor.html());

                var setContent;
                var timer;

                //Model数据更新时，更新百度UEditor
                ngModel.$render = function () {
                    try {
                        if(timer)clearInterval(timer);
                        timer=setInterval(function(){
                            if(setContent){
                                clearInterval(timer);
                                setContent(ngModel.$viewValue);
                            }
                        },100)
                    } catch (e) {}
                };

                require.async(['mUeditor'],function(mUeditor){
                	// seajs.use('/js/mobile/plugins/ueditor/themes/default/css/ueditor.min.css');

                	var editor = new UE.ui.Editor(scope.config || {});

	                editor.render($editor[0]);
//
	                editor.addListener('ready',function(){
	                    setContent=function(html){
	                        if(html)editor.setContent(html)
	                    }
	                })
                    $tools.find('.icon').click(function(){
                        var _this=$(this);
                        if(_this.hasClass('sel')){
                            _this.removeClass('sel');
                        }else{
                            _this.addClass('sel');
                        }
                    });
                    //字体加粗
                    var $bold=$tools.find('.bold');
                    $bold.click(function(){
                        editor.execCommand('bold');
                    });
                    //字体斜体
                    var $italic=$tools.find('.italic');
                    $italic.click(function(){
                        editor.execCommand('italic');
                    });
                    //字体下划线
                    var $underline=$tools.find('.underline');
                    $underline.click(function(){
                        editor.execCommand('underline');
                    });
                    //字体大小
                    var $fontsize=$tools.find('.fontsize');
                    $fontsize.click(function(){
                    	// console.log(window.getSelection());
                        setTimeout(function(){
                        	if($fontsize.hasClass('sel')){editor.execCommand('fontsize','18px');}
                        	else{editor.execCommand('fontsize','14px');}
                        },0)
                    });
                    //字体删除
                    var $del=$tools.find('.del');
                    $del.click(function(){
                        editor.execCommand('cleardoc');
                    });
//	                //百度UEditor数据更新时，更新Model
	                editor.addListener('contentChange', function () {
                        //更新外层的高度
                        var height=editor.iframe.contentDocument.documentElement.scrollHeight;
                        $(editor.container).find('#edui1_iframeholder').height(height<200?200:height);
                        //更新model
	                    ngModel.$setViewValue(editor.getContent());
	                })
                })
            }
        }
    });
    form.directive('mselect',function($parse){
        return{
            restrict:'A',
            scope:true,
            require: '?ngModel',
            link:function(scope,ele,attrs,ngModel){
                scope.select={};
                var value=form.strToJson(attrs.mselect);
                //设置默认值
                var VAL='';
                if(ngModel)VAL=$parse(attrs.ngModel)(scope.$parent);
                if(!VAL){
                	if(attrs.def==''){
	                    for(var i in value){
	                        scope.select={name:value[i],value:i};
	                       break;
	                    }
	                }else{
	                    scope.select={name:value[attrs.def],value:attrs.def};
	                }
	                if(ngModel)$parse(attrs.ngModel).assign(scope.$parent,scope.select.value);
                }else{
                	scope.select={name:value[VAL],value:VAL};
                }
				if(ngModel){
					ngModel.$render=function(){
						try{
							scope.select={name:value[ngModel.$viewValue],value:ngModel.$viewValue};
						}catch(e){}
					}
				}
                require.async(['mSelect'],function(mSelect){
                	mSelect.mSelect({
                		target:ele[0],
                        value:value,
                        def:scope.select.value,
                        click:function(opts){opts.def=scope.select.value;},
                        callback:function(val){
                            if(ngModel){
                            	$parse(attrs.ngModel).assign(scope.$parent,val.value);
	                            scope.$parent.$apply();
                            }else{
                                scope.select=val;
                                scope.$apply();
                            }
                            if(attrs.callback)scope.$eval(attrs.callback);
                        }
                    });
                });
            }
        }
    });
    form.directive('mtime',function($parse){
        return{
            restrict:'A',
            scope:true,
            require:'?ngModel',
            link:function(scope,ele,attrs,ngModel){
            	//设置默认值
                var VAL=$parse(attrs.ngModel)(scope.$parent);
                if(!VAL){
	                if(attrs.def){
	                    $parse(attrs.ngModel).assign(scope.$parent,form.toDate(attrs.def,'yyyy-MM-dd hh:mm:ss'));
	                }else{
	                    $parse(attrs.ngModel).assign(scope.$parent,'');
	                }
                }
                require.async(['mTime'],function(mTime){
            		mTime.mTime({
            			target:ele[0],
                        click:function(opts){
                        	opts.def=$parse(attrs.ngModel)(scope.$parent);
                        },
                        callback:function(val){
                            $parse(attrs.ngModel).assign(scope.$parent,val.year+'-'+val.month+'-'+val.date+' '+val.hours+':'+val.minutes+':00');
                            scope.$parent.$apply();
                        }
                    });
                });
            }
        }
    });
    form.directive('mwbmc',function($parse){
        return{
            restrict:'A',
            scope:true,
            link:function(scope,ele,attrs){
                scope.select=[];
                var setVal;//设置scope函数
                var timer=[];//定时器
                var model=attrs.model.split(',');
                var defArr=(attrs.def?attrs.def.split(','):[]);
                for(var i in model){
                    (function(i){
                        scope.$parent.$watch(model[i],function(news,old){
                            if(news){
                                if(!scope.select[i])scope.select[i]={};
                                if(attrs.val=='name'){
                                    scope.select[i].name=news;
                                }
                                if(attrs.val=='id'){
                                    scope.select[i].id=news;
                                    if(setVal){
                                        scope.select[i].name=setVal(news);
                                    }else{
                                        if(timer[i])clearInterval(timer[i]);
                                        timer[i]=setInterval(function(){
                                            if(setVal){
                                                clearInterval(timer[i]);
                                                scope.select[i].name=setVal(news);
                                                scope.$apply();
                                            }
                                        },100)
                                    }
                                }
                            }else{
                            	scope.select[i]={};
                            }
                        });
                    })(i)
                    if(!$parse(model[i])(scope.$parent))$parse(model[i]).assign(scope.$parent,defArr[i]);
                }

                require.async(['mWbmc'],function(mWbmc){
                	var nameArray=attrs.mwbmc;
                	if(attrs.namearray){
                		nameArray=scope.$eval(attrs.namearray);
                	}
                	if(!nameArray)return;
                    mWbmc.wbmc({target:ele[0],name:nameArray,pid:attrs.pid,select:attrs.select?attrs.select:'3',root:attrs.root?attrs.root:0,val:attrs.val,defId:attrs.defid,def:attrs.def?attrs.def.split(','):'',init:function(obj){
                    	if(attrs.defid){
                    		for(var i in obj.opts.def){
                    			if(obj.opts.def[i])$parse(model[i]).assign(scope.$parent,obj.opts.def[i]);
                    		}
                    		// scope.$parent.$apply();
                    	}
                         setVal=function(id){
                             if(!id)return;
                            return obj.findId[id].name;
                         }
                    },click:function(obj){
                        obj.opts.def=[];
                       for(var i in model){
                            obj.opts.def.push($parse(model[i])(scope.$parent));
                       }
                    },callback:function(ret){
                    	// console.log(ret);
                        for(var i in ret){
                            $parse(model[i]).assign(scope.$parent,ret[i][attrs.val]);
                        }
                        if(attrs.callback)scope.$eval(attrs.callback);
						scope.$parent.$apply();
                    }});
                });
            }
        }
    });
	form.factory('classify',function($http,$q){
		var get=function(a){
			var deferred=$q.defer();
			$http({method:'GET',url:'/js/dict/'+a+'.js',cache: true}).success(function(ret){
				deferred.resolve(ret);
			});
			return deferred.promise;
		}
		var resolve=function(a){
            var a=a||{};
            var defaults={
                pid:0,//根
                pidId:'',//根对应的id
                val:'id',//对应的真值字段
                name:'',//获取的js名字
                def:[]//默认值
            }
            var opts=$.extend(defaults,a);
            if(!opts.name)return;
			var deferred=$q.defer();
			$http({method:'GET',url:'/js/dict/'+opts.name+'.js',cache: true}).success(function(ret){
				var area={
                    name:opts.name,
                    pid:opts.pid,
                    pidId:opts.pidId,
                    val:opts.val,
                    data:[],
                    idObj:{},
                    def:opts.def,
                    defId:[],
                    init:[true,true,true]
                }
                var DATA={};
                var idObj={};
                angular.forEach(ret,function(n){
                    if(n.pid==area.pid)area.pidId=n.id;
                    idObj[n.id]=n;
                    if(!DATA[n.pid]){
                        DATA[n.pid]=[];
                        DATA[n.pid].push(n);
                    }else{
                        DATA[n.pid].push(n);
                    }
                });
                area.data=DATA;
                area.idObj=idObj;
                var tmp=0;
                while(tmp<area.def.length){
                    var data;
                    if(tmp==0){data=area.data[area.pidId]}
                    else{data=area.data[area.defId[tmp-1]]}
                    angular.forEach(data,function(n){
                        if(n[area.val]==area.def[tmp]){area.defId.push(n.id);return;}
                    })
                    tmp++;
                }
                deferred.resolve(area);
			});
			return deferred.promise;
		}
		return {
			get:get,
			resolve:resolve
		};
	});
	form.run(function($http){
		$http.defaults.headers.common['x-requested-with'] = 'XMLHttpRequest';
	});
	form.factory('aForm',function($window,$http,$q,aHttp,$location){
        //表单提交函数
		var form=function(a){
			var defaults={
				url:'',
				data:'',
                defense:true,
                event:'',
                isJson:false,
				before:function(){},
				success:function(){}
			}
			var opts=angular.extend(defaults,a);
			var _url=opts.url;
			if(_url=='')_url=$window.location.href;
			aHttp.ajax({
				url:_url,
				method:'POST',
				data:opts.data,
                isJson:opts.isJson,
                defense:opts.defense,
                event:opts.event,
				before:opts.before,
				success:opts.success
			});
		}

        var request=function(a){
            var a=a || {};
            var defaults={
				url:'',
                isJson:false
            }
            var opts=angular.extend(defaults,a);
			if(!opts.url)return;
//            if(opts.isJson){
//                $http.defaults.headers.common['Date-Type'] = 'json';
//            }else{
//                delete $http.defaults.headers.common['Date-Type'];
//            }
			opts.url=opts.url.replace(new RegExp('#'+$location.path(),'g'),'');//兼容有哈希值的把哈希值去掉
			if(opts.isJson)opts.url=opts.url+'&HTTP_DATE_TYPE=JSON';
            return $http(opts);
        }

		var promise=function(a){
            var a=a||{};
            var defaults={
                isJson:false,
                method:'GET',
                cache:false,
                url:''
            }
            var opts=angular.extend(defaults,a);
            if(!opts.url){console.log('同步请求函数url不能为空');return false;}
            var deferred=$q.defer();
            request({method:opts.method,url:opts.url,cache:opts.cache,isJson:opts.isJson,data:opts.data}).success(function(re){
                deferred.resolve(re);
            });
            return deferred.promise;
        }
        //同步获取服务器数据函数
        var defer=function(a){
            var defaults={
				url:'',
				isJson:false,
				type:'GET',
				dataType:'json',
				async:false,
				data:'',
				before:'',
				success:''
			};
			var opts=$.extend(defaults,a);
			var tx=true;
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
					data:opts.data,
					success:opts.success
				});
			}
        }

		return {
			promise:promise,
			request:request,//同步请求数据
            defer:defer,//异步请求数据
            form:form
		}
	});
	//hash值跳转
	form.factory('hash',function($location,$window){
		var obj={};
		obj.go=function(state){
			$location.url('/'+state);
			$window.location.href=$location.absUrl();
		}
		return obj;
	});
    //栈
    form.factory('stack',function(){
		var obj={};
		var set=function(name,val){
			obj[name]=val;
		}
		var del=function(name){
			if(!name)return;
			for(i in obj){
				if(i==name){
					delete obj[name];
				}
			}
		}
		var get=function(name){
			if(!name)return;
			return obj[name];
		}
        return{
            data:obj,
            set:set,
            del:del,
			get:get
        }
    });
	//储存数据服务接口，单一储存,主要用来两个view的传递数据
	form.factory('store',function(){
		var obj={};
		obj.store;
		obj.setStore=function(store){obj.store=store;}
		obj.getStore=function(){var store=obj.store;obj.store=undefined;return store;}
		return obj;
	});
	//返回结果服务接口
	form.factory('result',function(){
		var obj={};
		obj.resultData;//返回的数据
		obj.isResult=false;//是否有返回
		obj.removeResult=function(){
			obj.resultData=undefined;
			obj.isResult=false;
		}
		obj.setResult=function(id,result){
			obj.resultData={id:id,result:result};
			obj.isResult=true;
		}
		obj.getResult=function(){
			var result;
			if(obj.isResult){
				result=obj.resultData;
			}
			obj.removeResult();
			return result;
		}
		return obj;
	})
	form.factory('removeHtml',function(){
		return function(str){
			str=str.replace(/<[^>].*?>/g,"");
			str=str.replace(/(&#60;)(?!&#62;).*?(&#62;)/g,"");
			return str;
		}
	});
    form.filter('toTrust',function($sce){
        return function(val){
            return $sce.trustAsHtml(val);
        }
    });
    form.filter('toLimit',function(removeHtml){
        return function(str,num){
			str=removeHtml(str);
            if(str.length>num){
                str=str.substring(0,num);
            }
            return str;
        }
    });
    form.filter('toLimitHtml',function($sce,removeHtml){
        return function(str,num){
			str=removeHtml(str);
            if(str.length>num){
                str=str.substring(0,num);
            }
            return $sce.trustAsHtml(str);
        }
    });
    form.filter('toDate',function(){
        return function(date,format){
            date = new Date(parseInt(date)*1000);
            var map = {
				"y":date.getFullYear(), //年
                "M": date.getMonth() + 1, //月份
                "d": date.getDate(), //日
                "h": date.getHours(), //小时
                "m": date.getMinutes(), //分
                "s": date.getSeconds(), //秒
                "q": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            var nowDate=new Date().getTime();
            var betDate=parseInt((nowDate-date)/1000);
            if(betDate>0 && betDate<24*60*60){
                var h=parseInt(betDate/(60*60));
                if(h>0)return h+'小时前';
                var m=parseInt(betDate/(60));
                if(m>0)return m+'分钟前';
                var s=parseInt(betDate);
                return s+'秒前';
            }else{
                format = format.replace(/([yMdhmsqS])+/g, function(regStr,val,index,str){
                    var v = map[val];
                    if(v !== undefined){
                        if(parseInt(v) < 10){
                            v = '0' + v;
                        }
                        return v;
                    }
                    return val;
                });
            }
            return format;
        }
    });

    /************ 复制一些另类的函数 ************/

    //字符串转换成json
    form.strToJson=function(str){
        var json = (new Function("return " + str))();
        return json;
    }
    form.toDate=function(date,format){
       date = new Date(parseInt(date)*1000);
        var map = {
            "y":date.getFullYear(), //年
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "h": date.getHours(), //小时
            "m": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        format = format.replace(/([yMdhmsqS])+/g, function(regStr,val,index,str){
            var v = map[val];
            if(v !== undefined){
                if(parseInt(v) < 10){
                    v = '0' + v;
                }
                return v;
            }
            return val;
        });
        return format;
    }
	return form;
});
