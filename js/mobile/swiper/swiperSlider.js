define('swiperSlider',function(require, exports, module){
    require('zepto');
    mBox=require('mBox');
    template=require('template');
	
	var swiperSlider=function(OBJ){
		var OBJ=OBJ||{};
		var OPTS=$.extend({pid:''},OBJ);
		mBox.swiper({
			callback:function(swiper){
				var mySwiper=new swiper('.swiper-contain',{
					direction:'vertical',
					loop:false,
					grabCursor: true,
					paginationClickable: true,
                    mousewheelControl: true,
					watchSlidesProgress: true,
					onInit:function(swiper){
					   swiperInt({swiper:swiper});
                        swiper.myactive = 0;
					},
					onTouchStart:function(swiper){
						removeAnimation(swiper.slides[swiper.activeIndex-1]);
						removeAnimation(swiper.slides[swiper.activeIndex+1]);
					},
//					onSlideNext:function(swiper){
//						removeAnimation(swiper.slides[swiper.activeIndex-1]);
//					},
//					onSlidePrev:function(swiper){
//						removeAnimation(swiper.slides[swiper.activeIndex+1]);
//					},
					onSlideChangeStart:function(swiper){
					   swiperInt({swiper:swiper});
					},
					onProgress: function(swiper) {
						for (var i = 0; i < swiper.slides.length; i++) {
							var slide = swiper.slides[i];
							var progress = slide.progress;
							var translate, boxShadow;

							translate = progress * swiper.height * 0.8;
							scale = 1 - Math.min(Math.abs(progress * 0.2), 1);
							boxShadowOpacity = 0;

							slide.style.boxShadow = '0px 0px 10px rgba(0,0,0,' + boxShadowOpacity + ')';

							if (i == swiper.myactive) {
								es = slide.style;
								es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0,' + (translate) + 'px,0) scale(' + scale + ')';
								es.zIndex=0;


							}else{
								es = slide.style;
								es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform ='';
								es.zIndex=1;
								
							}

						}

					},


					onTransitionEnd: function(swiper, speed) {
						for (var i = 0; i < swiper.slides.length; i++) {
						//	es = swiper.slides[i].style;
						//	es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = '';

						//	swiper.slides[i].style.zIndex = Math.abs(swiper.slides[i].progress);

							
						}

						swiper.myactive = swiper.activeIndex;

					},
					onSetTransition: function(swiper, speed) {

						for (var i = 0; i < swiper.slides.length; i++) {
							//if (i == swiper.myactive) {

								es = swiper.slides[i].style;
								es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
							//}
						}

					}
				});
				var $HTML;//获取总动画库
				mBox.request({
					url:'/js/mobile/swiper/swiperTpl.tpl',
					dataType:'html',
					async:false,
					success:function(ret){
						$HTML=$(ret);
					}
				})
				var url=mBox.getCurUrl({isRemove:['page','pagesize']});
				mBox.request({
					url:url+'&pagesize=200',
					isJson:true,
					success:function(ret){
						if(ret.status){
							var list=ret.info.list;
							if(list.length>0){
								for(var i=0;i<list.length;i++){
									appendSwiper(list[i]);
								}
							}
							swiperInt({swiper:mySwiper,num:1,callback:function(){$('.u-mask').remove();}});//幻灯准备好后初始化下
							//插入最后一个“我也要一个”
							var categoryid=mBox.getCurParams('categoryid');
							mBox.request({
								url:'?m=photo&c=index&a=category&categoryid='+categoryid,
								isJson:true,
								success:function(ret){
									var description='';
									if(ret.status && ret.info.category && ret.info.category.description){
										description=ret.info.category.description;
									}
									var swiperLast=appendSwiper({template:'swiperLast',filepath:'/js/mobile/swiper/last.jpg',description:description,pid:OPTS.pid});
									//如果就这一个的话就直接初始化下
									if(mySwiper.slides.length==1){
										swiperInt({swiper:mySwiper,num:1});
									}
								}
							});
						}
					}
				});
				//获取id的html结构
				function appendSwiper(obj){
					var $template=$HTML.find('.'+(obj.template?obj.template:'swiper03'));
					if($template.size()>0){
						var html=$template[0].outerHTML;
                        template.config('escape',false);
						html=template.compile(html)(obj);
						html='<div class="j-lazy" lazy-src="'+obj.filepath+'"></div>'+html;
						var swiper=mySwiper.appendSlide('<div class="swiper-slide list">'+html+'</div>');
						return swiper;
					}
				}
				//初始化一些东西
				function swiperInt(a){
					var a=a||{};
					var defaults={
						swiper:{},
						num:2,
						callback:''
					};
					var opts=$.extend(defaults,a);
					var index=opts.swiper.activeIndex;
					var arr=opts.swiper.slides;
					layzeSrc({
						arr:arr,
						index:index,
						num:opts.num,
						callback:function(){
							if($.isFunction(opts.callback))opts.callback();
							addAnimation(arr[index]);
						}
					});
				}
				//arr数组，从index开始出现num个背景
				function layzeSrc(a){
					var a=a||{};
					var defaults={
						arr:[],
						index:0,
						num:2,
						callback:''
					};
					var opts=$.extend(defaults,a);
					for(var i=opts.index;i<opts.index+opts.num;i++){
						if(opts.arr[i]){
							var _this=$(opts.arr[i]).find('.j-lazy');
							if(_this.length>0){
								_this.each(function(i,n){
									var $n=$(n);
									var imgSrc=$n.attr('lazy-src');
									if(n.nodeName.toLowerCase()=='img'){
										n.src=imgSrc;
									}else{
										$n.css({'background-image':'url('+imgSrc+')'});
									}
								});
							}
						}
					}
					if($.isFunction(opts.callback))opts.callback();
				}
				//初始动画
				function initAnimation(obj,tx){
					if(!obj)return;
					var _this=tx?obj:$(obj).find('[data-animation]');
					if(_this.size()>0){
						_this.each(function(){
							$(this).hide();
						});
					}
					return _this;
				}
				//添加动画
				function addAnimation(obj,tx){
					if(!obj)return;
					var _this=tx?obj:$(obj).find('[data-animation]');
					if(_this.size()>0){
						_this.each(function(){
							$(this).show();
							var addClass=$(this).data('animation');
							$(this).addClass(addClass+' animated');
						});
					}
				}
				//删除动画
				function removeAnimation(obj,tx){
					if(!obj)return;
					var _this=tx?obj:$(obj).find('[data-animation]');
					if(_this.size()>0){
						_this.each(function(){
							var removeClass=$(this).data('animation');
							$(this).removeClass(removeClass+' animated');
							$(this).hide();
						});
					}
				}
				//制定跳转到某一屏
				function swipeTo(index){
					mySwiper.swipeTo(index);
				}
			}
		})
	}
	
	module.exports={
		swiperSlider:swiperSlider //幻灯	
	};
});