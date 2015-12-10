/*
	会员显示页面
*/
define('aMemberView',function(require, exports, module){
	var angular=require('angular');
    var aForm=require('aForm')
    var uiRouter=require('uiRouter');
	var aMemberView=angular.module('aMemberView',['ui.router','aForm']);
	aMemberView.factory('aMemberViewData',function(){
		var obj={};
		obj.data;
        obj.get=function(){
            return obj.data;
        }
		obj.set=function(view){
			obj.data=view;
		}
        obj.id='id';
		return obj;
	});
	aMemberView.config(function($stateProvider,$urlRouterProvider){
		$stateProvider
		.state('memberView',{
			url:'/memberView',
			resolve:{
				DATA:function($window,aMemberViewData){
					if(!aMemberViewData.get())$window.history.go(-1);
				}
			},
			templateUrl:'js/mobile/aMemberView/aMemberView.htm',
			controller:function($scope,$state,$window,aMemberViewData,aForm){
				$scope.item=aMemberViewData.get();
                var id=$scope.item[aMemberViewData.id];
				//是否有微网，微店
				aForm.request({url:'?m=member&c=index&a=getpageurl&id='+id}).success(function(ret){
					if(ret.status && ret.info){
						$scope.item=angular.extend($scope.item,ret.info);
					}
				});
				//是否有站点
				aForm.request({url:'?m=member&c=client&a=get_member_sites&id='+id}).success(function(ret){
					if(ret.status && ret.info){
						$scope.item.sites=ret.info;
					}
				});
			}
		})
	});
	return aMemberView;
});