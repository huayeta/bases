define('aTemplate',function(require, exports, module){
	require('uiRouter');
	var angular=require('angular');
	var aBox=require('aBox');
    require('ngTouch');
	var aTemplate=angular.module('aTemplate',['ngTouch','ui.router','aBox']);
	aTemplate.factory('ITEMS',function(){
		var obj={};
		obj.data=[];
		obj.addDate=function(items){
			obj.data=items;
		}
		return obj;
	});
	aTemplate.config(function($stateProvider,$urlRouterProvider){
//		$urlRouterProvider.otherwise("/index");
		$stateProvider
//		.state('index',{
//			url:'/index?id&type'
//		})
		.state('template',{
			url:'/template',
			abstract:true,
			template:'<ui-view/>'
		})
		.state('template.list',{
			url:'/list?id&type&typeid&returnResult&url',
			resolve:{
				DATA:function($stateParams){
					var data={};
					data.url=($stateParams.url?$stateParams.url:"?m=member&c=account&a=config_template&type="+$stateParams.type+'&typeid='+$stateParams.typeid);
					data.title=$stateParams.type=='1'?'电脑模板':'手机模板';
					data.type=$stateParams.type;
					data.typeid=$stateParams.typeid;
					data.id=$stateParams.id;
					data.returnResult=$stateParams.returnResult;
					return data;
				}
			},
			templateUrl:'js/mobile/aTemplate/template.list.htm',
			controller:function($scope,$state,$window,DATA,ITEMS){
				$scope.title=DATA.title;
				$scope.scrollPageUrl=DATA.url;
				$scope.getItems=function(items){
					ITEMS.addDate(items);
				}
				$scope.goView=function(index){
					$state.go('template.view',{type:DATA.type,typeid:DATA.typeid,id:DATA.id,viewId:index,returnResult:DATA.returnResult});
				}
				//后退
				$scope.back=function(){
					if(DATA.returnResult){
						$window.history.go(-1);
					}else{
						$state.go('index');
					}
				};
			}
		})
		.state('template.view',{
			url:'/view?viewId&type&typeid&id&returnResult',
			resolve:{
				DATA:function($stateParams,ITEMS){
					var data={};
					data.type=$stateParams.type;
					data.typeid=$stateParams.typeid;
					data.viewId=$stateParams.viewId;
					data.id=$stateParams.id;
					data.view=ITEMS.data[$stateParams.viewId];
					data.returnResult=$stateParams.returnResult;
					return data;
				}
			},
			templateUrl:'js/mobile/aTemplate/template.view.htm',
			controller:function($scope,$state,$stateParams,$window,DATA,$rootScope,result){
				//后退
				$scope.back=function(){
					$state.go('template.list',{type:DATA.type,typeid:DATA.typeid,id:DATA.id,returnResult:DATA.returnResult});
				}
				if(!DATA.view){$scope.back()}
				$scope.view=DATA.view;
				//应用此模板
				$scope.complete=function(){
					if(DATA.returnResult){
						result.setResult(DATA.id,{id:DATA.id,view:$scope.view});
//						$state.go(DATA.returnResult);
                        $window.history.go(-2);
					}else{
						$rootScope.$broadcast('template.updata',{id:DATA.id,view:$scope.view});
						$state.go('index');
					}
				}
			}
		})
	});
	return aTemplate;
});
