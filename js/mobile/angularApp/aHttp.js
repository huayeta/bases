define('aHttp',function(require, exports, module){
	require('aPost');
	require('zepto');
	var angular=require('angular');
	var http=angular.module('aHttp',['aPost'])
			.factory('aHttp',function($http,$window,$location){
				var url=$window.location.href;
				var xml=function(a){
					var a=a||{};
					var defaults={
						method:'GET',
						isJson:false,
						url:url,
						data:'',
                        defense:true,
                        event:'',
						before:function(){},
						success:function(){},
						error:function(){}
					};
					var opts=$.extend(defaults,a);
					var tx=true;
					if(opts.before(opts.event)==false)tx=false;
					if(tx){
                        if(opts.defense && opts.event && opts.event.target){
                            var $submitObj=$(opts.event.target).find('input[type=submit]');
                            var $defaultVal=$submitObj.val();
                            $submitObj.val('正在提交');
                            $submitObj.prop('disabled',true);
                        }
                        opts.url=opts.url.replace(new RegExp('#'+$location.path(),'g'),'');//兼容有哈希值的把哈希值去掉
			             if(opts.isJson)opts.url=opts.url+'&HTTP_DATE_TYPE=JSON';
						var ajax=$http({method:opts.method,url:opts.url,data:opts.data});
						ajax.success(function(ret){
							if(opts.defense && opts.event && opts.event.target){
	                            $submitObj.val($defaultVal);
	                            $submitObj.prop('disabled',false);
	                        }
							opts.success(ret);
						});
						ajax.error(function(ret){
							if(opts.defense && opts.event && opts.event.target){
	                            $submitObj.val($defaultVal);
	                            $submitObj.prop('disabled',false);
	                        }
							opts.error(ret);
						})
						return ajax;
					}
				};
				return {
					ajax:xml
				}
			})
	return http;
});