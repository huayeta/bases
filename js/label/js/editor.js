// JavaScript Document
define(function(require, exports, module){
	require('jquery');
	var dialog=require('fnDialog');
	var tools=require('tools');
	
	//添加label里面的遮罩层
	var addLayer=function(obj){
		var _this=$(obj);
		_this.css({'min-height':'25px','min-width':'25px'});
		var parent=_this.offsetParent();
		var width=_this.innerWidth();
		var height=_this.innerHeight();	
		var tpl='<div class="yst-label yst" title="点击修改"></div>'
		var children=$(tpl);
        var top,left;
        if(parent[0].nodeName=='HTML'){
            var offset=_this.offset();
            top=offset.top;
            left=offset.left;
        }else{
            var offset=_this.offset();
            var par=parent.offset();
            top=offset.top-par.top-parseFloat(parent.css('border-top'));
            left=offset.left-par.left-parseFloat(parent.css('border-left'));
        }
		if(_this.css("position")!='static'){
			top=0;left=0;
		}
		children.width(width);
		children.height(height);
		children.css({'position':'absolute','top':top+'px','left':left+'px','z-index':'900'}); 
		var css=_this.attr('data-editor-css');
		if(css){
			var css_json={};
			var arr=css.split(';');
			for(var i in arr){
				var arr_a=arr[i].split(':');
				css_json[$.trim(arr_a[0])]=$.trim(arr_a[1]);
			}
			children.css(css_json);
		}
		_this.append(children);
	}
	//初始化标签
	var label=function(){
		var arr=$('[data-editor]');
		$.each(arr,function(i,n){
			addLayer(n);
		});
		// var tpl=$('<div class="yst-bottom yst"><div class="bottom-c"><a data-ajax-fb="index.php?m=site&c=editor&a=publish" class="u-btn-yellow-2 pie u-btn-biger">立即发布</a></div></div>');
		// $('body').append(tpl);
		// tools.ajax({target:'[data-ajax-fb]',success:function(ret){dialog.tips({content:ret.info,time:2000});}});
		var editor_css=false;
		$('link').each(function() {
            var _this=$(this);
			if(_this.attr('href').indexOf('editor.css')!=-1){
				editor_css=true;
				return false;	
			}
        });
		if(!editor_css){
			$('head').append('<link href="/js/label/css/editor.css" rel="stylesheet" type="text/css" />');	
		}
		$(document).delegate('.yst-label','mouseover',function(){
			$(this).addClass('yst-label-hover');
		}).delegate('.yst-label','mouseout',function(){
			$(this).removeClass('yst-label-hover');
		}).delegate('.yst-label','click',function(event){
			var _this=$(this).parent();
			var data=_this.data('editor');
			dialog.get({
				url:'?m=site&c=editor&a=dialog&tag='+data,
				data:{tag:data},
				callback:function(val){
					if(val){
						location.reload();
					}
				}	
			});	
		})
	}
	label();
	module.exports={
		label:label	
	}
});

