define('aBox',function(require, exports, module){
	require('simpop');
	require('zepto');
    require('uiRouter');
    var aForm=require('aForm');
    var angular=require('angular');
    var aBox=angular.module('aBox',['aForm','ui.router']);

    aBox.factory('loginInfo',function(aForm){
		var defer=function(a){
			var a=a||{};
			var url=a.expand?'?m=member&c=index&a=getinfo&expand=true':'?m=member&c=index&a=getinfo';
			var data;
			aForm.defer({url:url,success:function(ret){data=ret}});
			return data;
		}
        var promise=function(a){
			var a=a||{};
			var url=a.expand?'?m=member&c=index&a=getinfo&expand=true':'?m=member&c=index&a=getinfo';
            return aForm.promise({url:url});
        }
        var request=function(a){
			var a=a||{};
			var url=a.expand?'?m=member&c=index&a=getinfo&expand=true':'?m=member&c=index&a=getinfo';
            return aForm.request({url:url});
        }
        var getName=function(a,tx){
        	var a=a||{};
            var defaults={};
            var opts=$.extend(defaults,a);
			//个人用户
			if(tx=true)return opts.realname;
			if(opts.nickname)return opts.nickname;//昵称
			if(opts.realname)return opts.realname;//真实姓名
            return '';
        }
        var getMobile=function(a){
            var a=a||{};
            var opts=$.extend({},a);
            if(opts.mobile)return opts.mobile;
            if(opts.phone)return opts.phone;
            return '';
        }
        return{
            promise:promise,
            request:request,
			defer:defer,
			getName:getName,
			getMobile:getMobile
        }
    });
	aBox.factory('loginInfos',function(getLoginInfo){
        return getLoginInfo({expand:true});
    });
	aBox.factory('getLoginInfo',function(aForm){
        var defer=function(a){
			var a=a||{};
			var data;
			var _url='?m=member&c=index&a=getinfo';
			if(a.expand)_url+='&expand=true';
			aForm.defer({
				url:_url,
				success:function(ret){
					data=ret;
				}
			});
			return data;
		}
		return defer;
    });
    aBox.factory('isLogin',function(aForm){
        var obj={};
        obj.tx=false;//是否初始化了
        obj.isLogin=false;//是否登陆了
		obj.info={};
        obj.isLoginFn=function(){
            var status=false;
            $.ajax({
                url:'?m=member&c=index&a=getinfo',
                dataType:'json',
                async:false,
                success:function(ret){
                    if(ret.status)status=true;
					obj.info=ret;
                }
            })
            obj.isLogin=status;
            return status;
        }
        obj.status=function(){
        	return obj.isLoginFn();
            // if(!obj.tx){
            //     obj.tx=true;
            //    return obj.isLoginFn();
            // }else{
            //     return obj.isLogin;
            // }
        }
        return obj;
    });
    aBox.directive('islogin',function($window,isLogin){
        return{
            restrict:'A',
            scope:{
                fn:'&islogin'
            },
            link:function(scope,ele,attrs){
                ele.bind('click',function(event){
                    if(isLogin.status()){
                        if(angular.isFunction(scope.fn)){scope.fn();}
                    }else{
                        require.async(['mBox'],function(mBox){
                            mBox.getLogin(attrs.pid);
                        });
                        event.preventDefault();
                    }
                })
            }
        }
    });
    aBox.directive('submitislogin',function($window,isLogin){
        return{
            restrict:'A',
            link:function(scope,ele,attrs){
                ele.bind('submit',function(event){
                    if(!isLogin.status()){
                        require.async(['mBox'],function(mBox){
                            mBox.getLogin(attrs.pid);
                        });
                        event.preventDefault();
                		return false;
                    }
                });
            }
        }
    });
    aBox.directive('scrollPage',function(aForm,$window){
        return{
            restrict:'AE',
//            transclude:true,
            templateUrl:function(ele,attr){
                return attr.scrolltpl?attr.scrolltpl:'scrollPageHtml';
            },
            scope:{
                url:'=url',
				callback:'&callback',
				success:'&success'
            },
            link:function(scope,ele,attrs){
				//调用父级函数时候使用,这个遗留问题慢慢的删除掉，直接使用$parent这个作用域
				scope.parent=function(fn){
					scope.$parent.$eval(fn);
				}
                scope.items=[];
                var opts={
                    delay:500,//延迟时间
                    marginBottom:100,//滚动条距离底部的距离
                    curPage:1,
                    url:document.location.href,
					scrollTarget:$(ele[0])
                };
                if(attrs.delay)opts.delay=attrs.delay;
                if(attrs.marginbottom)opts.marginBottom=attrs.marginbottom;
                if(attrs.curpage)opts.curPage=attrs.curpage;
                if(attrs.url)opts.url=attrs.url;
				if(attrs.scrolltarget){
					if(attrs.scrolltarget=='window'){
						opts.scrollTarget=$($window);
					}else{
						opts.scrollTarget=$(attrs.scrolltarget);
					}
				}
                var arg={};
				arg.isScroll=false;//是否滚动过
                arg.isScrolling=false;//是否在滚动
                arg.isComplete=false;//是否已经全部加载完
                arg.isEmpty=false;//是否有数据
                arg.curPage=opts.curPage;//当前页码
                arg.url=opts.url;//请求地址
                arg.scroll=function(){};//滚动执行的函数
                arg.success=function(){};//请求成功执行的函数
                arg.target=ele;
				arg.scrollTarget=opts.scrollTarget;
                arg.successBefore=function(){
                    scope.isLoading=true;
                }
                scope.isEmpty=arg.isEmpty;
                scope.$watch('url',function(val){
                    if(val){
                        arg.url=val;
                        arg.init();
                    }
                });
                arg.init=function(){
                    scope.items=[];
					scope.isLoading=false;
					scope.isEmpty=false;
                    arg.isScrolling=false;
                    arg.isComplete=false;
                    arg.isEmpty=false;
                    arg.curPage=0;
                    arg.requestPage();
                }
                arg.success=function(ret){
                    scope.isLoading=false;
                    if(ret.status && ret.info){
						//为了兼容后台前台返回的数据格式不一致
						if(ret.info.infos && ret.info.infos.length>0){
                        	scope.items=scope.items.concat(ret.info.infos);
                        	if(ret.info.pages && ret.info.pages.pagesize>ret.info.pages.totalnumber){
                        		arg.isComplete=true;
	                            scope.isComplete=true;
                        	}
						}else if(ret.info.list && ret.info.list.length>0){
							scope.items=scope.items.concat(ret.info.list);
							if(ret.info.pages && ret.info.pages.pagesize>ret.info.pages.totalnumber){
                        		arg.isComplete=true;
	                            scope.isComplete=true;
                        	}
						}else{
                            arg.isComplete=true;
                            scope.isComplete=true;
                            if(arg.curPage==1){
	                        	arg.isEmpty=true;
	                        	scope.isEmpty=true;
	                        }
                        }
                        //保存下载一些对象
                        if(attrs.store){
                        	var objArr=attrs.store.split(',');
                        	for(var i in objArr){
								if(scope[objArr[i]]){
									if(angular.isObject(scope[objArr[i]])){
										angular.extend(scope[objArr[i]],ret.info[objArr[i]]);
									}
								}else{
									scope[objArr[i]]=ret.info[objArr[i]];
								}
                        	}
                        }
//						判断下第一屏是否加载完
//						setTimeout(function(){
//							if(!arg.isScroll && !arg.isComplete){
//								arg.scroll();
//							}
//						},opts.delay)
                    }else{
                        arg.isComplete=true;
                        if(arg.curPage==1){
                        	arg.isEmpty=true;
                        	scope.isEmpty=true;
                        }
                    }
					if(scope.callback && angular.isFunction(scope.callback))scope.callback({items:scope.items});
					if(scope.success && angular.isFunction(scope.success))scope.success({ret:ret});
                }
                arg.requestPage=function(){
                    arg.curPage++;
                    arg.successBefore();//触发请求之前函数
                    aForm.request({url:arg.url+'&page='+arg.curPage,isJson:true})
                    .success(function(ret){
                        arg.success(ret);//触发请求成功函数
                    });
                }
				arg.scroll=function(){
					var offsetHeight,scrollHeight,scrollTop;
					if(attrs.scrolltarget!='window'){
						var target=arg.scrollTarget[0];
						scrollTop=target.scrollTop;
						offsetHeight=target.offsetHeight;
						scrollHeight=target.scrollHeight;
					}else{
						var _this=arg.scrollTarget;
						scrollTop=_this.scrollTop();
						offsetHeight=_this.height();
						scrollHeight=$(document).height();
					}
					if(offsetHeight+scrollTop>=scrollHeight-parseInt(opts.marginBottom)){
						if(arg.isScrolling || arg.isComplete)return;
						arg.isScrolling=true;
						setTimeout(function(){arg.isScrolling=false;},opts.delay);//重复触发间隔毫秒
						arg.requestPage();
						scope.$apply();
					}
				}
                arg.scrollTarget.bind('scroll',function(event){
					arg.isScroll=true;
					arg.scroll();
					if(attrs.scrolltarget!='window')event.stopPropagation();
                })
                if(arg.curPage==0 && !attrs.url){arg.requestPage();}
            }
        }
    })
	//点击加载
	aBox.directive('clickPage',function($window,aForm){
		return {
			restrict:'AE',
            templateUrl:function(ele,attr){
                return attr.clicktpl?attr.clicktpl:'clickPageHtml';
            },
			scope:true,
			link:function(scope,ele,attrs){
				var arg={};
				arg.url=attrs.url?attrs.url:$window.location.href;
				arg.curPage=parseInt(attrs.curpage?attrs.curpage:0,10);
				arg.request=function(){
					arg.curPage++;
					aForm.request({url:arg.url+'&page='+arg.curPage,isJson:true}).success(function(ret){
						scope.isClick=false;
						if(ret.status){
							if(ret.info && ret.info.infos && angular.isArray(ret.info.infos) && ret.info.infos.length>0){
								arg.pageMax=Math.ceil(parseInt(ret.info.pages.totalnumber,10)/parseInt(ret.info.pages.pagesize,10))
								if(ret.info.infos<ret.info.pages.pagesize || arg.curPage>=arg.pageMax)scope.isComplete=true;
								scope.items=scope.items.concat(ret.info.infos);
							}else{
								scope.isComplete=true;
							}
						}else{
							scope.isComplete=true;
						}
					});
				}
				scope.isClick=false;
				scope.isComplete=false;
				scope.items=[];
				scope.click=function(){
					if(scope.isClick || scope.isComplete)return;
					scope.isClick=true;
					arg.request();
				}
				if(arg.curPage==0)scope.click();
			}
		}
	});
    //滚动事件
    aBox.directive('myscroll',function($window){
        return{
            restrict:'AE',
            scope:{
                myScroll:'&myscroll'
            },
            link:function(scope,ele,attrs){
                var opts={
                    delay:500,//延迟时间
                    marginBottom:100,//滚动条距离底部的距离
					scrollTarget:$(ele[0])
                };
                if(attrs.delay)opts.delay=attrs.delay;
                if(attrs.marginbottom)opts.marginBottom=attrs.marginbottom;
				if(attrs.scrolltarget){
					if(attrs.scrolltarget=='window'){
						opts.scrollTarget=$($window);
					}else{
						opts.scrollTarget=$(attrs.scrolltarget);
					}
				}
                var arg={};
				arg.isScroll=false;//是否滚动过
                arg.isScrolling=false;//是否在滚动
                arg.isComplete=false;//是否已经全部加载完
                arg.scrollTarget=opts.scrollTarget;//滚动元素
                arg.scroll=function(event){
					var offsetHeight,scrollHeight,scrollTop;
					if(attrs.scrolltarget!='window'){
						var target=arg.scrollTarget[0];
						scrollTop=target.scrollTop;
						offsetHeight=target.offsetHeight;
						scrollHeight=target.scrollHeight;
					}else{
						var _this=arg.scrollTarget;
						scrollTop=_this.scrollTop();
						offsetHeight=_this.height();
						scrollHeight=$(document).height();
					}
					if(offsetHeight+scrollTop>=scrollHeight-parseInt(opts.marginBottom)){
						if(arg.isScrolling || arg.isComplete)return;
						arg.isScrolling=true;
						setTimeout(function(){arg.isScrolling=false;},opts.delay);//重复触发间隔毫秒
						scope.myScroll({event:event,arg:arg,ele:ele});
					}
				}
                arg.scrollTarget.bind('scroll',function(event){
					arg.isScroll=true;
					arg.scroll(event);
					if(attrs.scrolltarget!='window')event.stopPropagation();
                })
                arg.scroll();//上来就初始化一次
            }
        }
    });

	aBox.directive('searchOrder',function($window,$location){
		return{
			restrict:'A',
			scope:{
				callback:'&callback'
			},
			link:function(scope,ele,attrs){
				var type=attrs.searchOrder;
				var url=parseUrl($location.absUrl());
				attrs.sort=attrs.sort?attrs.sort:'ASC';
				ele.bind('click',function(){
					var tpl='/?';
					for(var i in url.params){
						if(i=='order')continue;
						tpl=tpl+i+'='+url.params[i]+'&';
					}
					tpl+='order='+type;
					if(attrs.sort!='DESC'){
						attrs.sort='DESC';
						tpl+='%20DESC';
						ele.addClass('my-searchOrder');
					}else{
						attrs.sort='ASC';
						ele.removeClass('my-searchOrder');
					}
					tpl='http://'+url.host+tpl;
					scope.callback({url:tpl});
				})
				if(url.params['order'] && url.params['order'].search(type)!=-1 && url.params['order'].search('DESC')!=-1)ele.addClass('my-searchOrder');
			}
		}
	})

	//返回顶部
	aBox.directive('backTop',function(){
		return {
			restrict:'A',
			link:function(scope,ele,attrs){
				require.async(['mBox'],function(mBox){
					mBox.backTop({target:ele[0]});
				});
			}
		}
	})

	//幻灯
	aBox.directive('swiperContainer',function(){
		return{
			restrict:'EAC',
			compile:function(ele,attrs){
				angular.element(ele).addClass('swiper-container');
				require.async(['mBox'],function(mBox){
					mBox.swiper({
						callback:function(swiper){
							var mySwiper=new swiper('.swiper-container',{
								pagination:'.swiper-pagination',
								direction:'horizontal',
								autoplay:parseInt(attrs.autoplay,10)?parseInt(attrs.autoplay,10):3000,
								speed:800,
								// autoplayDisableOnInteraction:false,
								onInit:function(swiper){
									var index=swiper.activeIndex;
									var arr=swiper.slides;
									var _this=$(arr[index]).find('[lazy-src]');
									var imgSrc=_this.attr('lazy-src');
									_this.attr({'src':imgSrc});
								},
								onSlideNext:function(swiper){
									var index=swiper.activeIndex;
									var arr=swiper.slides;
									var _this=$(arr[index]).find('[lazy-src]');
									var imgSrc=_this.attr('lazy-src');
									_this.attr({'src':imgSrc});
								}
							});
						}
					});
				});
			}
		}
	})
	aBox.directive('slick',function(){
		return{
			restrict:'EAC',
			compile:function(ele,attrs){
				var opts={
					arrows:false,//前后左右按钮
					infinite: false,
					dots:true,//分页
					autoplay:false
				};
				if(attrs.infinite)opts.infinite=attrs.slickInfinite;
				if(attrs.slickShow)opts.slidesToShow=parseInt(attrs.slickShow,10);//显示多少个
				if(attrs.slickScroll)opts.slidesToScroll=parseInt(attrs.slickScroll,10);//滚动多少个
				if(attrs.slickDots)opts.dots=attrs.slickDots;//分页是否显示
				if(attrs.slickAutoplay)opts.autoplay=!!attrs.slickAutoplay;
				if(attrs.slickVertical)opts.vertical=!!attrs.slickVertical;
				require.async(['slick'],function(slick){
					slick(ele[0]).slick(opts);
				});
			}
		}
	})

	/************ 复制一些另类的函数 ************/

	//分析url地址
	function parseUrl(url) {
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
	}
	aBox.parseUrl=parseUrl;
    //获得当前页面的url
	aBox.getCurUrl=function(a){
		var a=a||{};
		var defaults={
			remove:[]
		};
		var opts=$.extend(defaults,a);
		var url=parseUrl(window.location.href);
		var tpl='/?';
		for(var i in url.params){
			if(!opts.isPage && i=='page')continue;
			if(opts.remove.length>0){
				var isContinue=false;
				for(var j=0;j<opts.remove.length;j++){
					if(opts.remove[j]==i)isContinue=true;
				}
				if(isContinue)continue;
			}
			tpl=tpl+i+'='+url.params[i]+'&';
		}
		if(tpl.charAt(tpl.length-1)=='&')tpl=tpl.substr(0,tpl.length-1);
		return tpl;
	}
    //获取当前页面某个参数
	aBox.getCurParams=function(a){
		if(!a)return;
		var url=parseUrl(window.location.href);
		if(url.params[a])return url.params[a];
        return undefined;
	}
    return aBox;
});
