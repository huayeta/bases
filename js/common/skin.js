// JavaScript Document

define('skin',['jquery','cookie','fnDialog'],function(require, exports, module){

	require('jquery');
	var cookie=require('cookie');
	var dialog=require('fnDialog');

	var index=$(window.parent.document);
	var body=index.find('.j-member-body');

	var skin=$.cookie('skin') || 'skin-01';
	var opacity=$.cookie('opacity') || 'opacity-01';
	if(skin) exeSkin(skin);
	if(opacity) exeOpactity(opacity);
	function exeSkin(val){
		body.removeClass(function(index,className){
			var classNameArr=className.split(' ');
			if(classNameArr.length==0)return;
			classNameArr=$.map(classNameArr,function(n){
				var _n=$.trim(n);
				if(!_n)return null;
				if(/^skin-\d+$/i.test(_n)){return _n}
				return null;
			})
			return classNameArr.join(' ');
		}).addClass(val);
		$.cookie('skin',val);
	}
	//设置皮肤
	var setSkin=function (){
		dialog.get({
			url:'?m=common&c=dialog&a=skin',
			callback:function(val){
				exeSkin(val);
			}
		});
	}
	function exeOpactity(val){
		var layer=index.find('.layer-bg');
		if(layer.size()>0)layer.removeClass('opacity-02').removeClass('opacity-01').addClass(val);
		$.cookie('opacity',val);
	}
	//设置透明度
	var setOpacity=function (){
		dialog.get({
			url:'?m=common&c=dialog&a=opacity',
			callback:function(val){
				exeOpactity(val)
			}
		});
	};
	module.exports={
		setSkin:setSkin,
		setOpacity:setOpacity
	}
});
