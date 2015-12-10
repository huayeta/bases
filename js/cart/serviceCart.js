define('serviceCart',function(require, exports, module){
	require('jquery');
	var dialog=require('fnDialog');
	var tools=require('tools');
	var validForm=require('validForm')
	
	var $bind=$('[data-bind]');
	
	function updata(arr){
		var num=0;
		var amount=0;
		var point=0;
        var givepoint=0;
		for(var i in arr){
			num+=parseInt(arr[i]['quantity']);
			amount+=parseInt(arr[i]['quantity'])*parseFloat(arr[i]['price']);
		}
		$.each($bind,function(i,n){
			var _this=$(n);
			var bind=_this.data('bind');
			if(bind=='num')_this.text(num);
			if(bind=='amount')_this.text(amount.toFixed(2));
			if(bind=='total'){
				var parent_tag=$('[data-unit]').data('unit');
				var unit=_this.closest(parent_tag).find('[data-unit]');
				_this.text((parseInt(unit.data('quantity'))*parseFloat(unit.data('price'))).toFixed(2));
			}
		})
	}
	
	var arrData=function(a){
		var defaults={
			contain:document
		}
		var opts=$.extend(defaults,a);
		var arr=[];
        var $unit=$('[data-unit]:checked',opts.contain);
		$.each($unit,function(i,n){
			var _this=$(n);
			var obj={};
			obj.id=_this.data('id');
			obj.price=_this.data('price');
			obj.quantity=_this.data('quantity');
			arr[obj.id]=obj;
		})
		updata(arr);
		return arr;
	}
	
	var modifyQuantify=function(a){
		require.async(['validForm'],function(validForm){
			var defaults={
				num:'',
				url:'?m=service&c=cart&a=change_quantity',
				id:'',
				success:''
			}
			var opts=$.extend(defaults,a);
			validForm.request({
				url:opts.url+'&id='+opts.id+'&v='+opts.num,
				before:function(){
					if(opts.num<=0)return false;
				},
				success:function(ret){
					if($.isFunction(opts.success))opts.success(ret);
				}
			});
		});
	}
	
	var fnQuantity=function(a){
		var defaults={
			contain:'.u-quantity',
			btn:'[data-quantity-btn]',
			txt:'[data-quantity-val]',
			id:'',
			isajax:true,
			success:''
		};
		var opts=$.extend(defaults,a);
		var id=opts.id;
		$(document).delegate(opts.btn,'click',function(){
			var sx=opts.btn.substring(1,opts.btn.length-1);
			var _this=$(this);
			var parent=_this.closest(opts.contain);
			var txt=$(opts.txt,parent);
			var val=parseInt(txt.val());
			if(!id)id=txt.data('id');
			var new_val;
			if(_this.attr(sx)=='add'){new_val=val+1;txt.val(new_val);}
			if(_this.attr(sx)=='min'){
				if(val==1){
					require.async(['fnDialog'],function(dialog){
						dialog.tips({content:'最少一个'});
					});
				}
				else{new_val=val-1;txt.val(new_val);}
			}
			if(opts.isajax){
				modifyQuantify({id:id,num:new_val});
			};
			if($.isFunction(opts.success))opts.success(txt[0],new_val);
		});
		$(document).delegate(opts.txt,'change',function(){
			var _this=$(this);
			var id=_this.data('id');
			var val=_this.val();
			if(val<1){
				_this.val(1);
				require.async(['fnDialog'],function(dialog){
					dialog.tips({content:'最少一个'});
				});
			}else{
				if(opts.isajax)modifyQuantify({id:id,num:val});
				if($.isFunction(opts.success))opts.success(this,val);
			}
		});
	}
	
	var  cart=function(){
		var arr;
		var parent_tag=$('[data-unit]').data('unit');
        arr=arrData();
		require.async(['tools'],function(tools){
			tools.del({target:'[data-cart-del]',content:'是否确认删除此商品',success:function(ret,obj){
				if(ret.status){
					var parent=$(obj).closest(parent_tag);
					parent.remove();
					arr=arrData();
				}
			}});
			tools.checkSel({change:function(){
				arr=arrData();
			}});
			tools.del();
		});
		fnQuantity({success:function(obj,val){
			$(obj).closest(parent_tag).find('[data-unit]').data('quantity',val);
			arr=arrData();
		}});
		
		$('[data-submit-btn]').prop('disabled',false);
		
		validForm.form({
			target:'#formCart',
			before:function(){
				var num=0;
				for(var i in arr){
					num++;
				}
				if(num==0){
					dialog.tips({content:'请先选择服务再结算！',time:2500});
					return false;
				}
				return true;
			},
			success:function(ret){
				if(ret.status){
					location.href=ret.url;
				}else{
					dialog.alert({content:ret.info});
				}
			}
		});
	}
	var init=function(){
        arrData();
    }	
	module.exports={
		fnQuantity:fnQuantity,//点击增改变商品个数
        cart:cart,//购物车的初始函数
        init:init,//再次刷新购物车函数
	}
})