define('cart',function(require, exports, module){
	require('jquery');
	var dialog=require('fnDialog');
	var tools=require('tools');
    var template=require('template');
    var box=require('box');
    var wbmc=require('wbmc');

    template.config('openTag', '<<');
    template.config('closeTag', '>>');

	var $bind=$('[data-bind]');

	function updata(arr){
		var num=0;
		var amount=0;
		var point=0;
        var givepoint=0;
		for(var i in arr){
			num+=parseInt(arr[i]['quantity']);
			amount+=parseInt(arr[i]['quantity'])*parseFloat(arr[i]['price']);
			point+=parseFloat(arr[i]['quantity'])*parseFloat(arr[i]['point']);
			givepoint+=parseFloat(arr[i]['quantity'])*parseFloat(arr[i]['givepoint']);
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
            if(bind=='point'){
                _this.text(parseFloat(point).toFixed(2));
            }
			if(bind=='givepoint'){
                _this.text(parseFloat(givepoint).toFixed(2));
            }
			if(bind=='isPoint'){
				if(parseInt(point)>0){_this.show();}else{_this.hide()}
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
			obj.status=_this.data('status');
			obj.point=_this.data('point')?_this.data('point'):0;
			obj.givepoint=_this.data('givepoint')?_this.data('givepoint'):0;
            obj.purchase=_this.data('purchase');
			arr[obj.id]=obj;
		})
		updata(arr);
		return arr;
	}

	var modifyQuantify=function(a){
		require.async(['validForm'],function(validForm){
			var defaults={
				num:'',
				url:'?m=product&c=cart&a=change_quantity',
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
			tools.del({target:'[data-malldel]',checkval:'data-check-mallval',content:'是否确认删除此商品',success:function(ret,obj){
				if(ret.status){
                    var _this=$(obj);
					if(!_this.attr('data-check')){
                        var parent=_this.closest(parent_tag);
                        parent.remove();
                    }else{
                        var $val=tools.checkObj('data-check-mallval');
                        var parent=$val.closest(parent_tag);
                        parent.remove();
                    }
					arr=arrData();
				}else{
                    dialog.alert({content:ret.info});
                }
			}});
			tools.checkSel({btn:'[data-check-mallbtn]',val:'[data-check-mallval]',change:function(){
				arr=arrData();
			}});
		});
		fnQuantity({success:function(obj,val){
			$(obj).closest(parent_tag).find('[data-unit]').data('quantity',val);
			arr=arrData();
		}});

		$('[data-submit-btn]').prop('disabled',false);

		var mepointObj,pointObj,pointAObj,mepoint,pointA;
		$.each($bind,function(i,n){
			var _this=$(n);
			var bind=_this.data('bind');
			if(bind=='mepoint')mepointObj=_this;
			if(bind=='point')pointObj=_this;
			if(bind=='pointA')pointAObj=_this;
		});
		if(mepointObj)mepoint=mepointObj.text()?parseInt(mepointObj.text()):0;
		if(pointAObj)pointA=pointAObj.text();

		$('#formCart').submit(function(){
			if(mepoint && pointAObj && mepoint<(pointObj.text()?parseInt(pointObj.text()):0)){
				dialog.tips({content:pointA+'不足',time:2500});
				return false;
			}
            var purchase;
            var num=0;
            for(var i in arr){
                if(arr[i].status==0){
                    dialog.alert({content:'有缺货的商品，请重新选择！',time:2500});
                    return false;
                }
                if(num==0){purchase=arr[i].purchase;}
                else{
                    if(arr[i].purchase!=purchase){
                        dialog.alert({content:'请选择相同的付款方式商品再重新结算！',time:2500});
                        return false;
                    }
                }
                num++;
            }
            if(num==0){
				dialog.alert({content:'请先选择商品再结算！',time:2500});
				return false;
			}
		});
	}
	var init=function(){
        arrData();
    }

    //邮费
    var freightFn=function(a){
        var a=a||{};
        var defaults={
            freight:'',
			nodelivery:''
        }
        var opts=$.extend(defaults,a);
		//如果是无需发货时候
		if(opts.nodelivery)return;
		//如果没有运费模板的时候返回
        if(!opts.freight)return;
		var $box=$('.j-freightBox');
//        console.log(opts.freight);
        wbmc({name:'area',init:function(area){
//            console.log(area);
            //获取邮费
            function getFreight(id){
                if(!id)return '';
                //卖家承担运费
                if(opts.freight.type=='1'){
                    return '免运费';
                }
                //买家自提
                if(opts.freight.type=='2'){
                    return '买家自提：'+area.getName(area.getId(opts.freight.area))+' '+opts.freight.address;
                }
                //如果自定义运费
                if(opts.freight.type=='0'){
                    var detail=opts.freight.detail;
                    //如果只有默认邮费时
                    if(detail.length==1){
                        return '快递：'+detail[0].postage;
                    }
                    //判断该id或其省份id是否在特殊运费里面
                    for(var i in detail){
                        if(i>0){
                            var tmp=','+detail[i].area+',';
                            if(tmp.indexOf(','+id+',')!=-1 || tmp.indexOf(','+area.findIdObj[id]+',')!=-1){
                                return '快递：'+detail[i].postage;
                            }
                        }
                    }
                    //最后返回默认邮费
                    return '快递：'+detail[0].postage;
                }
                return '';
            }
            $box.html(template('freight',{area:area,freight:opts.freight,getFreight:getFreight})).show();
            var $target=$box.find('.j-freightTarget');
            var $Txt=$box.find('.j-freightTxt');
            var $content=$box.find('.j-freightContent');
            var $close=$box.find('.j-freightClose');
            var $first=$content.find('li.first');
            var $city;//储存市的jquery对象
            $target.click(function(){
                if($content.is(':hidden')){$content.show();}
                else{$content.hide();}
            });
            $close.click(function(){$content.hide();});
            //点击省份的时候
            $first.delegate('a','click',function(){
                var _this=$(this).closest('li.first');
                var index=$first.index(_this);
                var m=parseInt(index/6);//整数部分
                var n=index%6;//小数部分
                $(this).addClass('sel');
                _this.siblings('li.first').find('a').removeClass('sel');
                if($city)$city.remove();
                $city=getCity(_this.data('id'));
                if($first.size()>(6*m+5)){
                    $first.eq(6*m+5).after($city);
                }else{
                    $first.filter(':last').after($city);
                }
            });
            //点击市的时候
            $content.delegate('li.cur a','click',function(){
                var _this=$(this).closest('li');
                $Txt.html(getFreight(_this.data('id')));
                $close.click();
                $target.html($(this).text()+'<i class="addr-icon"></i>');
            })
            //获取市部分的html
            function getCity(id){
                if(!id)return '';
                var tpl='<li class="cur"><ul>';
                for(var i in area.data[id]){
                    tpl+='<li class="f-toe" data-id="'+area.data[id][i].id+'"><a>'+area.data[id][i].name+'</a></li>'
                }
                tpl+='</ul></li>';
                return $(tpl);
            }
        }})
    }

	var product=function(a){
        var a=a||{};
        var defaults={
            sales_attributes:[],//商品所有规格
            sales_attribute:{},//卖家商品的规格
            freight:'',
			nodelivery:'',//是否需要发货
            givepoint:'',//赠送积分
            point:'',//商品必须多少积分购买
            purchase:''//3的时候是混合购买
        };
        var opts=$.extend(defaults,a);
        //设置邮费
        freightFn({freight:opts.freight,nodelivery:opts.nodelivery});
        //商品规格
        var $spic=$('.j-spic');//商品规格jquery对象
        var $price=$('.j-price');//商品价格jquery对象
        var $stock=$('.j-stock');//商品库存的jquery对象
        var $point=$('.j-point');//需要多少积分的jquery对象
        var $givepoint=$('.j-givepoint');//赠送的积分的jquery对象
        //如果point存在就直接显示出来
        if(opts.purchase=='3' && opts.point){
            $point.show().find('b').text(opts.point);
        }
        //如果赠送的积分存在就直接显示出来
        if(opts.givepoint){
            $givepoint.show().find('b').text(opts.givepoint);
        }
        $price.data('defaultValue',$price.html());
        $stock.data('defaultValue',$stock.html());
        // console.log(opts);
        //恢复立即购买按钮
        var $order=$('.j-order');
        var $orderForm=$order.closest('form');
        var $orderSales=$orderForm.find('.j-sales');
        $order.prop('disabled',false);
        $orderForm.submit(function(event){
            if(!$.isEmptyObject(opts.sales_attribute) && !$orderSales.val()){
                dialog.tips({content:'请先选择商品规格后再购买',time:2000});
                return false;
            }
            if(!box.isLogin()){
                box.getLogin();
                return false;
            }
        });
        //调节商品数目
		fnQuantity({
			contain:'[data-q-box]',
			btn:'[data-q-btn]',
			txt:'[data-q-val]',
			isajax:false
		});
        //加入购物车
		$('[data-cart-add]').click(function(){
			var _this=$(this);
			var parent=_this.closest('form');
			var bind=parent.find('[data-bind]');
			var id,quantity;
            var salesVal=$orderSales.val();
			$.each(bind,function(i,n){
				var _this=$(n);
				var bindval=_this.data('bind');
				if(bindval=='id')id=_this.val();
				if(bindval=='quantity')quantity=_this.val();
			});
            if(!$.isEmptyObject(opts.sales_attribute) && !salesVal){
                dialog.tips({content:'请先选择商品规格后添加到购物车',time:2000});
                return false;
            }
            //规格部分
			require.async(['fnDialog','validForm'],function(dialog,validForm){
				validForm.request({
					url:'?m=product&c=cart&a=add',
                    isLogin:true,
					type:'post',
					data:'products[0][id]='+id+'&products[0][quantity]='+quantity+'&products[0][sales]='+salesVal,
					success:function(ret){
						if(ret.status){
                            dialog.tips({
                                content:ret.info,
                                callback:function(){
                                    if(ret.url)window.location.href=ret.url;
                                }
                            })
                        }
                        else{dialog.alert({content:ret.info})}
					}
				});
			});
		});
        //设置规格
        // console.log(opts.sales_attributes);
        // console.log(opts.sales_attribute);
        if(!$.isEmptyObject(opts.sales_attribute)){
            var sales={};
            sales.sales_attribute_str=tools.serialize(opts.sales_attribute);
            sales.attribute=[];//页面应该显示的规格
            sales.sels=[];//用户选择的规格
            sales.spic={};//用户最终的规格
            sales.num=0;//用户选择了几个规格
            // console.log(sales.sales_attribute_str);
            //组合显示那些规格
            for(var i in opts.sales_attributes){
                var tmp={name:opts.sales_attributes[i].name,id:opts.sales_attributes[i].id,'children':[]};
                for(var j in opts.sales_attributes[i]['children']){
                    var children=opts.sales_attributes[i]['children'][j];
                    var reg=new RegExp('(\{|,)'+children.id+'\:');
                    var tx=reg.test(sales.sales_attribute_str);
                    if(!tx)continue;
                    tmp['children'].push(children);
                }
                if(tmp.children.length>0)sales.attribute.push(tmp);
            }
            if(sales.attribute.length>0){
                //如果有规格的话
                $spic.html(template('spic',{'attribute':sales.attribute}));
                $spic.delegate('.btn1:not(.btn1-not-stock)','click',function(){
                    var _this=$(this);
                    var pindex=_this.data('pindex');
                    var index=_this.data('index');
                    if(_this.hasClass('btn1-active')){
                        _this.removeClass('btn1-active').siblings().removeClass('btn1-active');
                        sales.sels[pindex]=null;
                        sales.num--;
                        updateSales();
                    }else{
                        _this.addClass('btn1-active').siblings().removeClass('btn1-active');
                        if(!sales.sels[pindex])sales.num++;
                        sales.sels[pindex]=sales.attribute[pindex].children[index].id;
                        //更新规格
                        if(sales.num==sales.attribute.length){
                            var result=$.extend({},opts.sales_attribute);
                            for(var i in sales.sels){
                                result=result[sales.sels[i]];
                            }
                            updateSales(result);
                        }else{
                            updateSales();
                        }
                    }
                })
                function updateSales(result){
                    if(result){
                        //当匹配出规格的时候
                        if(result.price){$price.html('￥<b>'+result.price+'</b>');}
                        else{$price.html($price.data('defaultValue'))}
                        $stock.html('库存'+result.stock+'件');
                        $orderSales.val(sales.sels.join(','));
                        //需要购买积分
                        if(opts.purchase=='3'){
                            var point=result.point;
                            if(!point)point=opts.point;
                            if(point!=0)$point.show().find('b').text(point);
                        }
                        //赠送的积分
                        var givepoint;
                        if(result.givepoint){
                            givepoint=parseInt(result.givepoint);
                            if(opts.scale){givepoint=(givepoint*parseFloat(opts.scale)).toFixed(2)}
                        }else{
                            givepoint=opts.givepoint;
                        }
                        $givepoint.show().find('b').text(givepoint);
                    }else{
                        //出现没匹配到的问题
                       $price.html($price.data('defaultValue'));
                        $stock.html('库存0件');
                        $orderSales.val('');
                        //需要购买的积分
                        if(opts.purchase=='3'){
                            $point.hide();
                        }
                        //赠送的积分
                        if(!opts.givepoint)$givepoint.hide();
                    }
                }
            }
        }
	}

	module.exports={
		fnQuantity:fnQuantity,//点击增改变商品个数
        cart:cart,//购物车的初始函数
        init:init,//再次刷新购物车函数
		product:product//商品详情页
	}
})
