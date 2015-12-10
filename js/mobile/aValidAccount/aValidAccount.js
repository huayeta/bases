/*
	验证会员的真实性
*/
define('aValidAccount',function(require, exports, module){
	var angular=require('angular');
    var aForm=require('aForm');
    var aTools=require('aTools');
    var simpop=require('simpop');
    var uiRouter=require('uiRouter');
	var aValidAccount=angular.module('aValidAccount',['ui.router','aForm','aTools']);
	aValidAccount.config(function($stateProvider,$urlRouterProvider){
		$stateProvider
		.state('validAccount',{
			url:'/validAccount',
			templateUrl:'js/mobile/aValidAccount/aValidAccount.htm',
			controller:function($scope,$state,$window,$stateParams,aForm,result){
				$scope.complate=function(){
                    if(!$scope.keywords){
                        simpop.tips({content:'请先填写账号'});
                        return;
                    }
                    //检测账号存在性
                    aForm.request({url:'?m=common&c=index&a=member&keywords='+$scope.keywords}).success(function(ret){
                        if(ret.status){
                            simpop.alert({
                                content:$scope.keywords+'('+ret.info.name+')会员存在，点击“确定”选择该'+$scope.keywords+'('+ret.info.name+')会员',
                                callback:function(){
                                    result.setResult($stateParams.id,ret.info);
                                    $window.history.go(-1);
                                }
                            });
                        }else{
                            simpop.alert({content:ret.info});
                        }
                    });  
                }
			}
		})
	});
	return aValidAccount;
});