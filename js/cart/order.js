define('order',function(require, exports, module){
	require('jquery');
	var dialog=require('fnDialog');
	var validForm=require('validForm');
	var template=require('template');
	var tools=require('tools');
    var TIME=require('time');
	template.config('openTag', '<<');
    template.config('closeTag', '>>');

	var addrArr=[];
    var tx=false;//判断所有js都加载完

	var getAddr=function(){
		require.async(['validForm','template'],function(validForm,template){
			validForm.request({
				url:'?m=member&c=delivery',
                isJson:true,
				success:function(ret){
                    if(!ret.status)return tx=ret.info;
					var info=ret.info;
                    if(($.isArray(info) && info.length==0) || !info)return tx='请先填写收获地址';
                    $('[data-addr-box]').html(template('addr-list-tpl', {list:info}));
                    addrArr=info;
                    if(addrArr && $.isArray(addrArr) && addrArr.length>0){
                        //存在且有收货地址的时候
                        var $addrCur=$('[data-addr-box]').find('.list.addr-cur');
                        if($addrCur.size()>0){
                            $addrCur.click();
                        }else{
                            $('[data-addr-box]').find('.list:first').click();
                        }
                    }else{
                        tx=true;
                    }
                    return info;
				}
			});
		});
	}

	var addAddr=function(){
		var btn=$('[data-addr-add]');
		btn.click(function(){
			require.async(['validForm','fnDialog','wbmc','template'],function(validForm,dialog,wbmc,template){
				var add_tpl=$("#addr-add-tpl").html();
				var html=add_tpl;
				dialog.alert({
					title:'(添加/修改)地址',
					content:html,
					width:'650',
					icon:false,
					onshow:function(content,obj){
						wbmc({name:'area',pid:'0',val:'id',oid:['#LP','#LC','#LA']});
						validForm.form({
							target:'#addr-form',
							success:function(ret){
								if(ret.status){
                                    dialog.tips({
                                        content:ret.info,
                                        callback:function(){
                                            obj.close().remove();
                                            getAddr();
                                        }
                                    })
                                }else{
                                    dialog.alert({content:ret.info});
                                }
							}
						});
					},
					callback:function(content){
						$('#addr-form').submit();
					}
				});
			});
		});
	}

	var order=function(a){
		var a=a||{};
		var defaults={
			delivery_time:'',//发货时间
			free_post_amount:'',//免邮费
			is_nodelivery:0//是否需要发货地址 1：不需要发货
		};
		var opts=$.extend(defaults,a);
        //发货时间相关
        if(opts.delivery_time){
           // console.log(opts.delivery_time);
            var $deliveryTime=$('.j-deliveryTime');
            var $deliveryTimeDetail=$('.j-deliveryTimeDetail')
            var $deliveryTimeIpt=$('.j-deliveryTimeIpt');
            var nowTime=new Date();
            var nowDate=nowTime.getDate();
            var nowDay=nowTime.getDay();
            var str='';
            for(var i in opts.delivery_time.value){
                var val=opts.delivery_time.value[i];
                if(opts.delivery_time.type==1){
                	if(i==100)continue;
                	var date=i;
                    //按天
                    if(i==50){
                    	//月末
                    	var month=nowTime.getMonth()+1;
                    	date=TIME.getDays()[month-1];
                    }else if(parseInt(i)>nowDate){
                        var month=nowTime.getMonth()+1;
                    }else{
                        var month=nowTime.getMonth()+2;
                    }
                    var day=new Date(nowTime.getFullYear()+'/'+month+'/'+date).getDay();
                    str+='<option value="'+i+'">周'+TIME.getWeekStr(day)+' '+month+'月'+TIME.formatZero(date)+'日</option>';
                }else if(opts.delivery_time.type==2){
                	if(i==100)continue;
                    //按周
                    if(i>nowDay){
                        //当前周
                        var date=(i-nowDay)+nowDate;
                    }else{
                        var date=nowDate+(7-nowDay)+parseInt(i);
                    }
                    var year=nowTime.getFullYear();
                    var month=nowTime.getMonth()+1;
                    var days=TIME.getDays(year)[month-1];
                    if(date>days){
                        date=date-days;
                        month++;
                    }
                    str+='<option value="'+i+'">周'+TIME.getWeekStr(i)+' '+month+'月'+TIME.formatZero(date)+'日</option>';
                }
                $deliveryTime.html(str);
            }
            $deliveryTime.change(function(){
            	var val=$(this).val();
            	var str='';
            	var time={};
            	if(opts.delivery_time.value[val].time){
            		var time=opts.delivery_time.value[val].time;
            		for(var i in time){
	        			str+='<option value="'+time[i].starttime+'-'+time[i].endtime+'">'+time[i].starttime+'-'+time[i].endtime+'</option>';
	        		}
            	}else if(opts.delivery_time.value[100] && opts.delivery_time.value[100].time){
            		var time=opts.delivery_time.value[100].time;
            		for(var i in time){
	        			str+='<option value="'+time[i].starttime+'-'+time[i].endtime+'">'+time[i].starttime+'-'+time[i].endtime+'</option>';
	        		}
            	}else{
            		str+='<option value="">任意时间段</option>';
            	}
            	$deliveryTimeDetail.html(str);
                $deliveryTimeIpt.val(opts.delivery_time.id+','+$deliveryTime.val()+','+$deliveryTimeDetail.val()+','+$deliveryTime.find('option:selected').text());
            }).trigger('change');
            $deliveryTimeDetail.change(function(event) {
            	$deliveryTimeIpt.val(opts.delivery_time.id+','+$deliveryTime.val()+','+$deliveryTimeDetail.val()+','+$deliveryTime.find('option:selected').text());
            }).trigger('change');
        }
		//发票相关
		var $invoiceid=$('.j-invoiceid');
		var $invoiceidCon=$('.j-invoiceid-con');
		tools.get({
			target:'[data-invoice]',
			callback:function(ret){
				if(ret.id!=0){
					$invoiceidCon.html('<span class="f-mr10">纸质发票</span><span class="f-mr10">'+ret.content+'</span>');
				}else{
					$invoiceidCon.html('不开发票');
				}
				$invoiceid.val(ret.id);
			}
		});

		//积分相关
		var jfbox=$('[data-jf-box]');
		var children=jfbox.children(':not(:first)');
		var checkbox=$('[data-jf-checkbox]',jfbox);
		var bind=$('[data-jf-bind]',jfbox);
		var val=$('[data-jf-val]',jfbox);
		var pay=$('[data-jf-btn=pay]',jfbox);
		var cancel=$('[data-jf-btn=cancel]',jfbox);
		var rate=parseFloat(checkbox.attr('data-jf-rate'));
		var point=parseFloat(checkbox.attr('data-jf-point'));
		checkbox.change(function(){
			var _this=$(this);
			if(_this.is(':checked')){
				children.eq(0).show();
			}else{
				val.val('');
				$('[data-jf-bind=val]',jfbox).val('');
				children.hide();
			}
		});
		pay.click(function(){
			var _this=$(this);
			var reg=/^\d*$/ig;
			var value=parseFloat(val.val());
			if(!reg.test(value)){
				dialog.alert({content:'请输入纯数字'});
				return;
			}else if(value>point){
				dialog.alert({content:'您输入的使用积分大于可使用积分总数'});
				return;
			}else{
				var price=(value/rate).toFixed(2);
				if(price>$amountEm.text()){
					dialog.alert({content:'使用的积分换算后的价格为'+price+'大于商品的总价格'});
					return ;
				}
				$.each(bind,function(i,n){
					var bindTxt=$(n).attr('data-jf-bind');
					if(bindTxt=='txt')$(n).text(value);
					if(bindTxt=='val')$(n).val(value);
					if(bindTxt=='price')$(n).text(price);
				});
				children.eq(0).hide();
				children.filter(':gt(0)').show();
			}
		});
		cancel.click(function(){
			val.val('');
			$('[data-jf-bind=val]',jfbox).val('');
			children.eq(0).show();
			children.filter(':gt(0)').hide();
		});

		var $submitBtn=$('.j-submitBtn');//提交订单

		//添加地址信息
		if(opts.is_nodelivery==0){
			//添加收货地址函数
			addAddr();

	        var $products=$('.j-products');//储存有商品的信息
	        var $addrBox=$('[data-addr-box]');//选择收货地址
	        var $addrIpt=$('.j-addrIpt');//提交收货地址
	        var $freightNum=$('.j-freightNum');//商品运费
	        var $freightEm=$freightNum.find('em');
	        var $freightFree=$freightNum.find('.j-free');
	        var $amount=$('.j-amount');//总商品价格
	        var $amountEm=$amount.find('em');
	        var $pointA=$('.j-pointA');//可用积分
	        //地址信息的滑动效果
			$addrBox.delegate('.list', 'mouseover', function () {
				var _this = $(this);
				if (_this.is('.addr-cur') && !_this.is('.addr-def')){
					_this.addClass('addr-set');
					_this.addClass('addr-active');
				}
			}).delegate('.list', 'mouseout', function () {
				$(this).removeClass('addr-active').removeClass('addr-set');
			}).delegate('.list', 'click', function () {
				$(this).addClass('addr-cur').siblings('.list').removeClass('addr-cur');
	            //邮费部分
	            var index=$(this).index();
	            // console.log(addrArr);
	            var areaid=addrArr[index].areaids;
	            if(!areaid){
	                tx='该地址属于老版本的地址，请重新编辑下再提交'
	                return;
	            }
	            areaid=areaid[1]
	            var products={};
	            $.each($products,function(i,n){
	                var $n=$(n);
	                var id=$n.data('id');
	                var quantity=$n.data('quantity');
	                if(!products[id]){
	                    products[id]={};
	                    products[id].id=id;
	                    products[id].quantity=quantity;
	                }else{
	                    products[id].quantity=parseInt(products[id].quantity)+parseInt(quantity);
	                }
	            });
	            validForm.request({
	                url:'?m=product&c=order&a=freight',
	                before:function(){tx=false;},
	                data:{products:products,areaid:areaid},
	                type:'POST',
	                success:function(ret){
	                    if(ret.status){
	                        var freight=parseFloat(ret.info);
	                        var tmp=parseFloat($freightEm.text()?$freightEm.text():0);
	                        var price;
	                        if(opts.free_post_amount && parseFloat(opts.free_post_amount)<(parseFloat($amountEm.text())-tmp)){
	                        	$freightEm.text(0);
	                            $freightFree.html('(订单满'+opts.free_post_amount+'包邮)')
	                        	price=(parseFloat($amountEm.text())-tmp).toFixed(2);
	                        }else{
	                        	$freightEm.text(freight.toFixed(2));
	                            $freightFree.html();
	                        	price=(parseFloat($amountEm.text())-tmp+freight).toFixed(2);
	                        }
	                        $amountEm.text(price);
	                        //可用积分部分
	                        var tmp=price*rate;
	                        if(tmp>point)tmp=point;
	                        $pointA.text(tmp);
	                    }
	                    $freightNum.show();
	                    $amount.show();
	                    tx=true;
	                }
	            });
	            //解析地址
	            $addrIpt.html(template('addrIpt',{area:addrArr[index],areaid:areaid}));
			});
	        //设置默认地址
	        tools.ajax({
	            target:'[data-addr-setDef]',
	            success:function(ret,obj){
	                if(ret.status){
	                    dialog.tips({
	                        content:ret.info,
	                        callback:function(ret){
	                            $(obj).closest('.list').addClass('addr-def').siblings('.list').removeClass('addr-def');
	                        }
	                    });
	                }
	            }
	        });
	        //获取地址信息
			getAddr();
		}else{
			tx=true;
		}


        //购物卡部分
        tools.switchCheckbox({contain:'.j-switchCheckboxParent'});
        var $cardBtn=$('.j-cardBtn');
        var $cardBox=$('.j-cardBox');
        $cardBtn.click(function(){
            var _this=$(this);
            var no=_this.data('no');
            var price=parseFloat(_this.data('price'));
            var amount=parseFloat($amountEm.text());
            var priceTrue;//抵押多少钱
            if(!_this.data('tx')){
                if(amount==0){dialog.tips({content:'不能再使用购物券了'});return;}
                if(amount>=price){
                    priceTrue=price;
                    $amountEm.text(amount-price);
                }else{
                    priceTrue=amount;
                    $amountEm.text(0);
                }
                _this.data('tx',true).removeClass('u-btn').text('取消');
                $cardBox.append('<div class="f-mt10 f-tar" data-no="'+no+'" data-price="'+priceTrue+'"><input type="hidden" name="cards[]" value="'+no+'" />使用卡号（'+no+'）抵押现金￥<b class="s-red f-fs16 f-mlr5">'+priceTrue+'</b>元</div>');
            }else{
                var $children=$cardBox.children('[data-no='+no+']');
                $amountEm.text((amount+parseFloat($children.data('price'))).toFixed(2));
                _this.data('tx',false).addClass('u-btn').text('使用');
                $children.remove();
            }
        });

        //恢复提交按钮
		$submitBtn.prop('disabled',false);
        //提交订单之前的验证
		function formAjax(){
			var status=false;
			var data=$('#orderForm');
			var url=data.attr('action');
			$.ajax({
				type:'post',
				url:url,
				async:false,
				data:data.serialize(),
				success:function(ret){
					if(ret.status){status=true}
					else{
						dialog.tips({content:ret.info,time:2500});
					}
				}
			})
			return status;
		}

		$('#orderForm').submit(function(){
            if(tx===false){
                dialog.tips({content:'请稍等页面正在加载中！'});
                return false;
            }else if($.type(tx)=='string'){
                dialog.tips({content:tx});
                return false;
            }
			var _this=$(this);
			// if(addrArr.length!=0){
			// 	var index=$('[data-addr-box] .addr-cur').index();
			// 	if(index==-1){dialog.tips({content:'请先选择收货地址！'});return false;}
			// }else{
			// 	dialog.tips({content:'请先填写收货地址！'});
			// 	return false;
			// }
			var status=tools.checkval('data-status');
			if(status==''){
				dialog.tips({content:'请先选择商品再结算！',time:2500});
				return false;
			}
			if(status.indexOf('0')!=-1){
				dialog.tips({content:'有缺货的商品，请重新选择！',time:2500});
				return false;
			}
			if(formAjax()==false)return false;
            $submitBtn.prop('disabled',true).val('正在提交中').addClass('submit-btn-disabled');
		});
	}

	module.exports={
		order:order
	}
})
