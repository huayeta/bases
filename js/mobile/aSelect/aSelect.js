define('aSelect',function(require, exports, module){
	require('uiRouter');
	var angular=require('angular');
	var aSelect=angular.module('aSelect',['ui.router']);
	aSelect.factory('aSelectData',function(){
		var obj={};
		obj.data={};//储存的数据，私有的
		obj.resultData;
		obj.isResult=false;
		obj.removeResult=function(){
			obj.resultData=undefined;
		}
		obj.setResult=function(id,val){
			obj.resultData={id:id,val:val};
			obj.isResult=true;
		}
		obj.getResult=function(){
			var result=obj.resultData;
			obj.removeResult();
			return result;
		}
		obj.setData=function(id,data){
			obj.data[id]=data;
		};
		obj.getData=function(id){
			return obj.data[id]?obj.data[id]:'';
		};
		//回收空间
		obj.takeData=function(id){
			var data=obj.data[id]?obj.data[id]:'';
			if(data){
				delete obj.data[id];
			}
			return data;
		};
		obj.store;
		obj.setStore=function(store){obj.store=store;}
		obj.getStore=function(){var store=obj.store;obj.store=undefined;return store;}
		return obj;
	});
	aSelect.config(function($stateProvider,$urlRouterProvider){
		$stateProvider
		.state('selectTemplate',{
			url:'/selectTemplate?id',
			onExit:function($stateParams,aSelectData){
				if(!aSelectData.isResult){aSelectData.removeResult();}
				else{aSelectData.isResult=false}
				aSelectData.takeData($stateParams.id);
			},
			templateUrl:'/js/mobile/aSelect/selectTemplate.htm',
			controller:function($scope,$rootScope,$state,$stateParams,$window,aSelectData,$location){
				$scope.gotoBack=function(){
//					$state.go('search');
//					$location.path('search').replace();
					$window.history.go(-1);
				}
				if(!$stateParams.id)$scope.gotoBack();//如果不存在id，返回
				var DATA=aSelectData.getData($stateParams.id);
				if(!DATA)$scope.gotoBack();//如果是刷新过来的，返回
				var formState=DATA.formState;
				$scope.id=DATA.id;
				$scope.title=DATA.title;
				$scope.items=DATA.data;
				$scope.def=DATA.def;
				$scope.change=function(val){
					$scope.def=val;
//					$rootScope.$broadcast('aSelect.updata',{id:$scope.id,val:val});
					aSelectData.setResult($scope.id,val);
					$scope.gotoBack();
				}
			}
		})
	});
	aSelect.directive('mySelect',function($location,$window,aSelectData){
		return{
			restrict:'A',
			scope:{
				mySelect:'=mySelect',
				myStore:'=myStore'
			},
			link:function(scope,ele,attrs){
				ele.bind('click',function(){
					var data={};
					for(var i in scope.mySelect.data){
						data[i]={name:scope.mySelect.data[i].name,val:i};
					}
					if(scope.mySelect.id){
						aSelectData.setData(scope.mySelect.id,{
							data:data,
							id:scope.mySelect.id,
							title:scope.mySelect.title,
							def:scope.mySelect.def,
							formState:$location.url()?$location.url():''
						});
						aSelectData.setStore(scope.myStore);
						$location.url('selectTemplate?id='+scope.mySelect.id);
						$window.location.href=$location.absUrl();
					}
				})
			}
		}
	});
	return aSelect;
});