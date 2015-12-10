/*
    图片浏览插件
*/
define('aImageView',function(require, exports, module){
	require('uiRouter');
	var angular=require('angular');
    var aForm=require('aForm')
    var uiRouter=require('uiRouter');
    var mBox=require('mBox');
    var mTools=require('mTools');
	var aImageView=angular.module('aImageView',['ui.router','aForm']);
	aImageView.factory('aImageViewData',function(){
		var obj=[];
		obj.data;
        obj.get=function(){
            return obj.data;
        }
		obj.set=function(arr){
			obj.data=arr;
		}
        obj.opts={};
		return obj;
	});
	aImageView.config(function($stateProvider,$urlRouterProvider){
		$stateProvider
		.state('imageView',{
			url:'/imageView?id',
			resolve:{
				DATA:function($window,aImageViewData){
					if(!aImageViewData.get())$window.history.go(-1);
				}
			},
			templateUrl:'js/mobile/aImageView/aImageView.htm',
			controller:function($scope,$state,$window,$stateParams,aImageViewData,result){
				$scope.items=aImageViewData.get();
                var returnData=$scope.items;//记录返回的data
                $scope.swiper={};//记录当前活动的index和总length
                $scope.btn={};//记录两个按钮,编辑按钮和返回按钮
                var mySwiper;
                $scope.$on('ngRepeatFinished',function(){
                    mBox.swiper({
                        callback:function(Swiper){
                            mySwiper=new Swiper('.m-imageView .imageView-container',{
                                direction:'horizontal',
                                wrapperClass:'bd',
                                slideClass:'item',
                                initialSlide:aImageViewData.opts.activeIndex?aImageViewData.opts.activeIndex:0,
                                onInit:function(swiper){
                                    init(swiper);
                                },
                                onSlideChangeStart:function(swiper){
                                    init(swiper);
                                }
                            });
                            $scope.btn.menu=function(){
                                var activeIndex=mySwiper.activeIndex;
                                mTools.showBtn({isTarget:false,isdel:aImageViewData.opts.isdel,del:del,buttons:(aImageViewData.opts.buttons?aImageViewData.opts.buttons(returnData[activeIndex]):[])});
                            }
                        }
                    });
                });
                //初始化swiper和css背景图片
                function init(swiper){
                    var $activeObj=$(swiper.slides[swiper.activeIndex]);
                    $activeObj.css({'background-image':('url('+$activeObj.data('background-image')+')')});
                    $scope.swiper.activeIndex=swiper.slides.length!=0?(parseInt(swiper.activeIndex)+1):0;
                    $scope.swiper.length=swiper.slides.length;
                    $scope.$apply();
                }
                function del(){
                    var activeIndex=mySwiper.activeIndex;
                    mySwiper.removeSlide(activeIndex);
                    init(mySwiper);
                    if(aImageViewData.opts.del && $.isFunction(aImageViewData.opts.del))aImageViewData.opts.del(returnData[activeIndex]);
                    returnData.splice(activeIndex,1);
                }
                $scope.btn.complate=function(){
                    result.setResult($stateParams.id?$stateParams.id:'default',returnData);
                    $window.history.go(-1);
                }
			}
		})
	});
	return aImageView;
});