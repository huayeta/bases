define('mBox',function(require, exports, module){
    require('zepto');
    require('touch');

	//分析url地址
	var parseUrl=function(url) {
        if(!url)url=window.location.href;
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

	//获得当前页面的url
	var getCurUrl=function(a){
		var a=a||{};
		var defaults={
			remove:[]
		};
		var opts=$.extend(defaults,a);
        if(opts.isRemove)opts.remove=opts.isRemove;//兼容老的一些用法
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
	var getCurParams=function(a){
		if(!a)return;
		var url=parseUrl(window.location.href);
		if(url.params[a])return url.params[a];
        return '';
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
    //获取登陆窗口
    var getLogin=function(pid,other){
        if(!pid)pid=getCurParams('pid');
        var str='';
        if(pid)str+='&pid='+pid;
        if(other){
            for(var i in other){
                str=str+'&'+i+'='+other[i];
            }
        }
        window.location.href="?m=member&c=index&a=login"+str+"&redirectURL="+encodeURIComponent(window.location.href);
    }
    //获取注册窗口
    var getRegister=function(pid){
        if(!pid)pid=getCurParams('pid');
        if(!pid){
            pid='';
        }else{
            pid='&pid='+pid;
        }
        window.location.href="?m=member&a=register"+pid+"&redirectURL="+encodeURIComponent(window.location.href);
    }
    //另类会员中心跳转
    var jumpMember=function(a){
        var a=a||{};
        var defaults={
            target:'.j-jumpMember'
        };
        var opts=$.extend(defaults,a);
        $(opts.target).click(function(){
             if(isLogin()){
                window.location.href='?m=member';
            }else{
               getLogin();
            }
        });
    }

    var request=function(a){
        var defaults={
            url:'',
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

    //直接购买
    var addOrder=function(a){
        var a=a||{};
        var defaults={
            target:'data-order'
        }
        var opts=$.extend(defaults,a);
        var tpl='<form action="?m=product&c=order&a=confirm" method="post" data-order-form><input type="hidden" class="u-txt" name="products[0][id]" value=""><input type="hidden" name="products[0][checked]" value="1"><input type="hidden" name="products[0][quantity]" value="1"></form>';
        var form=$('[data-order-form]');
        if(form.size()==0){
            $('body').append(tpl);
            form=$('[data-order-form]');
        }
        var formId=form.find('input:first-child');
        $(document).delegate('['+opts.target+']','click',function(){
            var _this=$(this);
            var id=_this.attr(opts.target);
            formId.val(id);
            form.submit();
        })
    }

    //加入购物车
    var addCart=function(a){
        var a=a||{};
        var defaults={
            target:'data-cart',
            success:''
        }
        var opts=$.extend(defaults,a);
        $(document).delegate('['+opts.target+']','click',function(){
            var _this=$(this);
            var id=_this.attr(opts.target);
            require.async(['simpop'],function(simpop){
                request({
                    url:'?m=product&c=cart&a=add',
                    type:'post',
                    data:'products[0][id]='+id+'&products[0][quantity]=1',
                    success:function(ret){
                        if($.isFunction(opts.success)){
                                opts.success(ret);
                        }else{simpop.tips({content:ret.info});}
                    }
                });
            });
        })
    }
    //加载css
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
		if(!isCss && opts.url){
			$('head').prepend('<link href="'+opts.url+'" rel="stylesheet" type="text/css" />');
		}
    };

    //幻灯特效
    var slide=function(a){
        var defaults={
            contain:'.e-slide',
            targetCell:'',
            animate:false
        };
        var opts=$.extend(defaults,a);
        var contain=$(opts.slideCell);
        opts.slideCell=opts.contain;
        require.async(['touchSlide'],function(touchSlide){
            var _this=$(opts.contain);
            $targetCell=_this.find(opts.targetCell);
            if(opts.animate){
                opts.endFun=function(j,c){
                    var $slide=_this.find(opts.mainCell).children().eq(j).find('[data-animate]');
                    $.each($slide,function(k,m){
                        var $m=$(m);
                        $m.addClass($m.data('animate')).css({opacity:1});
                    })
                    if($.isFunction(a.endFun))a.endFun(j,c);
                }
                opts.startFun=function(j,c){
                    var $slide=_this.find(opts.mainCell).children().eq(j).find('[data-animate]');
                    $.each($slide,function(k,m){
                        var $m=$(m);
                        $m.removeClass($m.data('animate')).css({opacity:0});
                    })
                    if(opts.targetCell){
                        $targetCell.css({opacity:0});
                        $targetCell.eq(j).css({opacity:1});
                    }
                    if($.isFunction(a.startFun))a.startFun(j,c);
                }
            }
            touchSlide(opts);
        });
    }

    //幻灯切换swiperSlide
    var swiperSlide=function(a){
        var a=a||{};
        var defaults={
            isLoadCss:true,
            callback:function(){}
        };
        var opts=$.extend(defaults,a);
        require.async(['swiper','seajsCss'],function(swiper,seajsCss){
            seajs.use('mobile/plugins/swiper/swiper.min.css');
            opts.callback(Swiper);
        })
    }
    //选项卡切换
    var swiperTabs=function(a){
        var a=a||{};
        var defaults={
            onInit:'',
            onSlideChangeStart:'',
        };
        var opts=$.extend(defaults,a);
        swiperSlide({
            callback:function(SWIPER){
                new SWIPER('.m-tabs',{
                    direction:'horizontal',
                    wrapperClass:'tabs-bd',
                    slideClass:'tabs-bd-item',
                    onInit :function(swiper){
                        $(swiper.container[0]).find('.tabs-hd-item').click(function(){
                            var activeIndex=$(this).index();
                            swiper.slideTo(activeIndex);
                        });
                        if($.isFunction(opts.onInit))opts.onInit(swiper);
                    },
                    onSlideChangeStart:function(swiper){
                        var activeIndex=swiper.activeIndex;
                        swiper.container.find('.tabs-hd-item').removeClass('on').eq(activeIndex).addClass('on');
                        if($.isFunction(opts.onSlideChangeStart))opts.onSlideChangeStart(swiper);
                    }
                });

            }
        });
    }
    //幻灯切换
    var swiperImage=function(a){
        var a=a||{};
        var defaults={
            onInit:'',
            onSlideChangeStart:'',
        };
        var opts=$.extend(defaults,a);
        swiperSlide({
            callback:function(SWIPER){
                new SWIPER('.m-image-container',{
                    direction:'horizontal',
                    wrapperClass:'bd',
                    slideClass:'item',
                    initialSlide:0,
                    onInit:function(swiper){
                        init(swiper);
                    },
                    onSlideChangeStart:function(swiper){
                        init(swiper);
                    }
                });
                function init(swiper){
                    var $activeObj=$(swiper.slides[swiper.activeIndex]);
                    $activeObj.css({'background-image':('url('+$activeObj.data('background-image')+')')});
                    var activeIndex=swiper.slides.length!=0?(parseInt(swiper.activeIndex)+1):0;
                    var length=swiper.slides.length;
                    swiper.container.find('.hd').html('<span>'+activeIndex+'/'+length+'</span>');
                }
            }
        });
    }
    //滚动加载
    var scrollPage=function(a){
        if(!(this instanceof scrollPage)){
            return new scrollPage(a);
        }
        var a=a||{};
        var defaults={
            delay:1000,//延迟时间
            marginBottom:100,//滚动条距离底部的距离
            target:'.g-content',
            curPage:1,
            url:document.location.href
        };
        var opts=$.extend(defaults,a);
        var _this=this;
        this.isScrolling=false;//是否在滚动
        this.isComplete=false;//是否已经全部加载完
        this.curPage=opts.curPage;//当前页码
        this.url=opts.url;//请求地址
        this.scroll=function(){};//滚动执行的函数
        this.success=function(){};//请求成功执行的函数
        this.successBefore=function(){};
        this.target=$(opts.target);
        this.requestPage=function(event){
            _this.curPage++;
            request({
                url:_this.url+'&page='+_this.curPage,
                before:function(){_this.successBefore(event);},
                isJson:true,
                success:function(ret){
                    _this.success(ret,event);//触发成功函数
                }
            });
        }
        this.target.on('scroll',function(event){
            var target=event.target;
            var offsetHeight=target.offsetHeight;
            var scrollHeight=target.scrollHeight;
            var scrollTop=target.scrollTop;
            _this.scroll(event);//触发滚动函数
            if(offsetHeight+scrollTop>=scrollHeight-parseInt(opts.marginBottom)){
                if(_this.isScrolling || _this.isComplete)return;
                _this.isScrolling=true;
                setTimeout(function(){_this.isScrolling=false;},opts.delay);//重复触发间隔毫秒
                _this.requestPage(event);
            }
        });
        if(_this.curPage==0){_this.successBefore(event);_this.requestPage();}
        return _this;
    }

    //点击加载
    var clickPage=function(a){
        if(!(this instanceof clickPage)){
            return new clickPage(a);
        }
        var a=a||{};
        var defaults={
            target:'.j-clickpageTarget',
            curPage:1,
            pageSize:'',
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
            request({
                url:_this.url+'&page='+_this.curPage+(_this.pageSize?('&pagesize='+_this.pageSize):''),
                before:function(){_this.successBefore();},
                isJson:true,
                success:function(ret){
                    _this.isLoading=false;
                    _this.success(ret);//触发成功函数
                }
            });
        }
        _this.init=function(){
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
        if(_this.curPage==0){_this.successBefore();_this.requestPage();}
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
        if(target.size()==0)return;
        target.addClass('limitContainer');
        //table and iframe and img
        var tab=target.find('table');
        var iframe=target.find('iframe');
        var img=target.find('img');
        var limit=tab.add(iframe).add(img);
        kb();
        $(window).bind('resize',function(){
            kb();
        });
        function kb(){
            var maxW=target.width();
            if(limit.size()>0){
                $.each(limit,function(i,n){
                    var _n=$(n);
					var timer=setInterval(function(){
						if(n.complete){
							if(_n.width()>maxW){
								_n.css({'padding':'0','margin-left':'0','margin-right':'0','width':'100%','height':'auto'})
							}
							clearInterval(timer);
						}
					},50);
                });
            }
        }
    }

	//判断图片加载完后调用回调函数
	var isLoadImg=function(a){
		var a=a || {};
		var defaults={
			contain:'.j-isLoadImg',
			target:'img',
			callback:function(){},//加载完成一个就输出一个回调
			callbacks:function(){}//全部加载完输出一个回调
		};
		var opts=$.extend(defaults,a);
		var $img;
		//判断是否是Zepto对象
		if(opts.target && $.type(opts.target)=='array' && opts.target.selector!=undefined){
			$img=opts.target;
		}else{
			var $contain=$(opts.contain);
			$img=$contain.find(opts.target);
		}
		var $imgs=$img.clone();
		var timer;//定时器
		var isLoad=false;//是否全部加载完
		isLoadFn();
		function isLoadFn(){
			if($img.size()>0){
				$.each($img,function(i,n){
					if(this.height!=0){
						opts.callback(this);
						$img=$img.not(this);
					}
				});
			}else{
				isLoad=true;
			}
			if(isLoad){
				if(timer)clearInterval(timer);
				opts.callbacks($imgs);
			}else{
				timer=setInterval(function(){
					isLoadFn();
				},500);//500毫秒扫描一次
			}
		}
	};

	var request=function(a){
		var a=a||{};
        var defaults={
            url:window.location.href,
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

    //返回顶部
    var backTop=function(a){
        var a=a||{};
        var defaults={
            target:'.g-content',
            style:''
        };
        var opts=$.extend(defaults,a);
        var $target=$(opts.target);
        var $backTop;
        $target.scroll(function(event) {
            var $this=$(this);
            var clientHeight=this.clientHeight;
            var scrollTop=this.scrollTop;
            if(scrollTop>clientHeight){
                if($backTop)return;
                $backTop=$('<div class="u-back-top" style="'+opts.style+'"><i class="ion-arrow-up-c icon"></i></div>');
                $this.append($backTop);
                $backTop.on('click',function(){
                    $this.scrollTop(0);
                    $backTop.off('cick');
                    $backTop.remove();
                    $backTop='';
                });
            }else{
                if(!$backTop)return;
                $backTop.off('cick');
                $backTop.remove();
                $backTop='';
            }
        });
    }

    //后退
    var goBack=function(a){
        var a=a||{};
        var defaults={
            target:'.j-goBack'
        };
        var opts=$.extend({},defaults,a);
        $(opts.target).on('click',function(){
            var $this=$(this);
            var goback=$this.data('goback');
            if(!goback)goback=-1;
            var length=Math.abs(goback);
            if(window.history.length>length){
                window.history.go(goback);
            }else{
                //如果没有历史记录就跳到首页
                window.location.href=window.location.origin;
            }
        })
    }

    //判断是否是微信浏览器
    function isWeixin(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    // 分享
    var share=function(a){
        var a=a||{};
        var defaults={
            target:'.j-share',
            url:''
        };
        var opts=$.extend(defaults,a);
        if(opts.target){
            $(opts.target).click(shareFn);
        }else{
            shareFn();
        }
        function shareFn(){
            if(!isWeixin()){
                require.async('mTools', function(mTools) {
                    mTools.showBtn({
                        target:false,
                        buttons:[
                            {
                                text:'<img src="index.php?m=common&c=tool&a=qrcode&url=http://'+parseUrl().host+'/'+opts.url+'" style="width:100%;" /><p>快快将二维码分享给小伙伴吧~~</p>',
                                isRemove:false
                            }
                        ]
                    });
                })
            }else{
                var style='';
                style+='.iswx-share{position: absolute; left: 0;bottom:0; width: 100%; height: 100%; background:rgba(0,0,0,.6) url(/wap/images/common/wx-share.png) center top no-repeat; background-size: 70% auto; z-index:9999;text-align: center;}';
                var $box=$('<div><style>'+style+'</style><div class="iswx-share"></div></div>');
                $box.click(function(){
                    $box.remove();
                });
                $('body').append($box);
            }


        }
    }

    //认证手机和填写真实姓名
    var verifyMobile=function(a){
        var a=a||{};
        var defaults={
            verify_realname:false,
            verify_mobile:false,
            callback:''
        }
        var opts=$.extend(defaults,a);
        var loginInfo=getLoginInfo({expand:true});
        if(!loginInfo.status)return getLogin();
        var verify_realname=opts.verify_realname;//是否存在要填写姓名 暂时关闭真实姓名的填写
        if(loginInfo.info.realname)verify_realname=true;//如果存在了就不需要填写姓名
        var verify_mobile=opts.verify_mobile;//是否认证了手机
        if(loginInfo.info.ismobile=='1')verify_mobile=true;//如果存在就不需要认证手机
        if(verify_mobile && verify_realname)return;
        require.async(['simpop'],function(simpop){
            var style='';
            style+='.m-tabform .tab-tr{ margin: 0 10px; line-height: 42px; border-bottom: 1px solid #f5f5f5; font-size: 16px; overflow: hidden;}';
            style+='.m-tabform .tab-tr .tab-th{ width: 80px; float: left; color: #808080;}';
            style+='.m-tabform .tab-tr .tab-td{ overflow: hidden; color: #333; min-height: 42px;}';
            style+='.m-tabform .tab-tr .tab-td .u-txt{display: inline-block; width: 100%; box-sizing: border-box; height: 100%; line-height: normal; border: 0 none; box-shadow: none; color: #333; padding: 0;}';
            style+='.m-tabform .tab-tr .tab-td .u-txt::-webkit-input-placeholder{ color: #bbb;}';
            style+='.m-tabform .tab-tr .tab-td .u-txt:disabled{ opacity: .8; background:none;}';
            style='<style>'+style+'</style>';
            simpop.alert({
                title:'验证手机',
                okVal:'保存',
                autoClose:false,
                style:'padding:5px;',
                content:function(){
                    var tpl='<div class="m-tabform">'+style+(verify_realname?'':'<div class="tab-tr"><div class="tab-th">姓名：</div><div class="tab-td"><input type="text" class="u-txt j-realname" /></div></div>')+(verify_mobile?'':'<div class="tab-tr"><div class="tab-th">手机号：</div><div class="tab-td"><input type="text" class="u-txt j-mobile" /></div></div><div class="tab-tr"><div class="tab-th">验证码：</div><div class="tab-td"><a class="u-lineBtn f-fr f-ml5 f-mt5 j-send">免费发送验证码</a><div class="f-oh"><input type="text" class="u-txt j-vcode" /></div></div>')+'</div>';
                    return tpl;
                },
                onShow:function(obj){
                    var $content=$(obj.pop);
                    $(obj.pop).find('.j-send').click(function(){
                        var mobile=$content.find('.j-mobile').val();
                        if(!mobile)return simpop.tips({content:'手机号码不能为空'});
                        var regM=/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/;
                        if(!regM.test(mobile))return simpop.tips({content:'请填写正确的手机号!'});
                        request({
                            url:'?m=member&c=index&a=verify&t=verify_mobile&no='+mobile,
                            isJson:true,
                            success:function(ret){
                                if(!ret.status){
                                    simpop.tips({content:'该手机已经被注册!'});
                                }else{
                                    simpop.alert({
                                        title:'填写图形安全验证码，获取短信',
                                        okVal:'发送',
                                        autoClose:false,
                                        style:'padding:5px;',
                                        content:function(){
                                            var tpl='<div class="m-tabform">'+style+'<div class="tab-tr"><div class="tab-th">图码：</div><div class="tab-td"><img src="api.php?n=vcode&width=130&height=40" class="f-fr j-switch-vcode" align="absbottom" style="width:130px; height:40px;" /><div class="f-oh"><input type="text" class="u-txt" name="vcode" /></div></div></div></div>';
                                            return tpl;
                                        },
                                        onShow:function(obj){
                                            var $content=$(obj.pop);
                                            $content.find('.j-switch-vcode').click(function(){
                                                $(this).attr('src','api.php?n=vcode&width=130&height=40');
                                            });
                                        },
                                        callback:function(obj){
                                            var $content=$(obj.pop);
                                            var $ipt=$content.find('input');
                                            var vcode=$ipt.val();
                                            if(!vcode)return simpop.tips({content:'请先填写验证码'});
                                            request({
                                                url:'?m=member&c=account&a=verify_mobile&mobile='+mobile+'&vcode='+vcode+'&verify=1',
                                                success:function(ret){
                                                    if(!ret.status){
                                                        if(ret.info.indexOf('一个手机')!=-1){
                                                            return simpop.alert({
                            											content:ret.info,
                            											okVal:'去登录',
                            											callback:function(){
                                                                            request({
                                                                                url:'?m=member&a=logout',
                                                                                isJson:true,
                                                                                success:function(ret){
                                                                                    if(ret.status){
                                                                                        getLogin();
                                                                                    }
                                                                                }
                                                                            })
                            											}
                            										});
                                                        }
                                                        return simpop.tips({content:ret.info});
                                                    }
                                                    simpop.tips({content:ret.info});
                                                    obj.close();
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        })
                    })
                },
                callback:function(obj){
                    var $content=$(obj.pop);
                    if(!verify_realname){
                        var realname=$content.find('.j-realname').val();
                        if(!realname)return simpop.tips({content:'请填写姓名'});
                        request({
                            type:'post',
                            url:'?m=member&c=account',
                            data:{'par[realname]':realname},
                            success:function(ret){
                                if(!ret.status)return simpop.tips({content:ret.info});
                                verify_realname=true;
                                if(verify_mobile && verify_realname){
                                    simpop.tips({content:'保存成功',callback:function(){
                                        if(opts.callback && $.isFunction(opts.callback)){
                                            opts.callback();
                                        }
                                    }});
                                    obj.close();
                                }
                            }
                        });
                    }
                    if(!verify_mobile){
                        var mobile=$content.find('.j-mobile').val();
                        if(!mobile)return simpop.tips({content:'请填写手机号'});
                        var vcode=$content.find('.j-vcode').val();
                        if(!vcode)return simpop.tips({content:'请填写验证码'});
                        request({
                            type:'POST',
                            url:'?m=member&c=account&a=verify_mobile',
                            data:{mobile:mobile,code:vcode},
                            success:function(ret){
                                if(!ret.status){
                                    return simpop.tips({content:ret.info});
                                }
                                verify_mobile=true;
                                if(verify_mobile && verify_realname){
                                    simpop.tips({content:'保存成功',callback:function(){
                                        if(opts.callback && $.isFunction(opts.callback)){
                                            opts.callback();
                                        }
                                    }});
                                    obj.close();
                                }
                            }
                        })
                    }
                }
            });
        })
    }
    //完善手机和姓名
    var fillMobile=function(a){
        var loginInfo=getLoginInfo({expand:true});
        if(!loginInfo.status)return getLogin();
        var is_realname=false;
        if(loginInfo.info.realname)is_realname=true;
        var is_mobile=false;
        if(loginInfo.info.mobile)is_mobile=true;
        if(is_realname && is_mobile)return;
        require.async(['simpop'],function(simpop){
            var style='';
            style+='.m-tabform .tab-tr{ margin: 0 10px; line-height: 42px; border-bottom: 1px solid #f5f5f5; font-size: 16px; overflow: hidden;}';
            style+='.m-tabform .tab-tr .tab-th{ width: 80px; float: left; color: #808080;}';
            style+='.m-tabform .tab-tr .tab-td{ overflow: hidden; color: #333; min-height: 42px;}';
            style+='.m-tabform .tab-tr .tab-td .u-txt{display: inline-block; width: 100%; box-sizing: border-box; height: 100%; line-height: normal; border: 0 none; box-shadow: none; color: #333; padding: 0;}';
            style+='.m-tabform .tab-tr .tab-td .u-txt::-webkit-input-placeholder{ color: #bbb;}';
            style+='.m-tabform .tab-tr .tab-td .u-txt:disabled{ opacity: .8; background:none;}';
            style='<style>'+style+'</style>';
            simpop.alert({
                title:'完善信息',
                okVal:'保存',
                autoClose:false,
                style:'padding:5px;',
                content:function(){
                    var tpl='<div class="m-tabform">'+style+(is_realname?'':'<div class="tab-tr"><div class="tab-th">姓名：</div><div class="tab-td"><input type="text" class="u-txt j-realname" /></div></div>')+(is_mobile?'':'<div class="tab-tr"><div class="tab-th">手机号：</div><div class="tab-td"><input type="text" class="u-txt j-mobile" /></div></div>')+'</div>';
                    return tpl;
                },
                callback:function(obj){
                    var $content=$(obj.pop);
                    var realname=$content.find('.j-realname').val();
                    if(!realname)return simpop.tips({content:'请填写姓名'});
                    var mobile=$content.find('.j-mobile').val();
                    if(!mobile)return simpop.tips({content:'请填写手机号'});
                    request({
                        type:'post',
                        url:'?m=member&c=account',
                        data:{'par[realname]':realname,'par[mobile]':mobile},
                        success:function(ret){
                            if(!ret.status)return simpop.tips({content:ret.info});
                            simpop.tips({content:ret.info});
                            obj.close();
                        }
                    });
                }
            });
        })
    }

    return {
        isWeixin:isWeixin,//判断是否是微信浏览器
		parseUrl:parseUrl,//解析url
		getCurUrl:getCurUrl,//获取当前网址
		getCurParams:getCurParams,//获取当前页面某个参数
        limitContainer:limitContainer,//限制一个div里面的内容不超出
        isLogin:isLogin,//判断是否登陆
		getLoginInfo:getLoginInfo,//获取登陆后会员信息
        getLogin:getLogin,//获取登陆窗口
        getRegister:getRegister,//获取注册接口
        jumpMember:jumpMember,//另类会员中心跳转
        loadCss:loadCss,//加载css
        addOrder:addOrder,//直接购买
        addCart:addCart,//添加购物车
        slide:slide,
        swiper:swiperSlide,//幻灯
        swiperTabs:swiperTabs,//选项卡切换
        swiperImage:swiperImage,//幻灯图片切换
        clickPage:clickPage,//点击加载
        scrollPage:scrollPage,//滚动加载
		isLoadImg:isLoadImg,//判断图片加载完后调用回调函数
		request:request,//请求数据
        backTop:backTop,//返回顶部
        goBack:goBack,//后退按钮
        share:share,//分享按钮
        verifyMobile:verifyMobile,//验证手机和填写真实姓名
        fillMobile:fillMobile//完善手机和真实姓名
    }
});
