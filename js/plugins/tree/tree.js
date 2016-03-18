define('tree',function(require, exports, module){
	require('jquery');

	var tree=function(a){
		var defaults={
			url:'',
			callback:''
		}
		var opts=$.extend(defaults,a);
		$(document).delegate('.tree','click',function(){
			var _this=$(this);
			var oid = _this.attr('id'), has = _this.data('has');
			var txt=_this.text();
			if(txt=='+'){
				if(!has){
					$.getJSON(opts.url+'&pid='+oid,function(r){_this.parent().parent().after(opts.callback(r,_this[0]));_this.text('-');_this.data('has',true)});
				}else{
					$('tbody>tr').each(function(){
						var map = $('.tree', this).attr('map'), id = $('.tree', this).attr('id');
						if(oid!=id && map.indexOf('|'+oid+'|') != -1){
							$(this).show();
						}
					});
				}
				_this.text('-');
			}else{
				$('tbody>tr').each(function(){
					var map = $('.tree', this).attr('map'), id = $('.tree', this).attr('id');
					if(oid!=id && map.indexOf('|'+oid+'|') != -1){
						$(this).hide();
					}
				});
				_this.text('+');
			}
		});
	};

	module.exports={
		tree:tree
	}
})
