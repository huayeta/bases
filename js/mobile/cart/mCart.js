define('mCart',function(require, exports, module){
	var zepto=require('zepto');
    var mTools=require('mTools');
    var simpop=require('simpop');
    var template=require('template');
    var mWbmc=require('mWbmc');
//
    template.config('openTag', '<<');
    template.config('closeTag', '>>');

    //数量修改函数
    function fnQuantity(a){
        var a=a||{};
		var defaults={
			contain:'.u-quantity',
			minBtn:'.min',
            addBtn:'.add'
		};
		var opts=$.extend(defaults,a);
        var $contain=$(opts.contain);
        $.each($contain,function(){
            var _this=$(this);
            var $ipt=_this.find('input');
            var $min=_this.find(opts.minBtn);
            if($ipt.val()==1){
                $min.addClass('disable');
            }
            _this.on('click',opts.minBtn,function(){
                if($(this).hasClass('disable'))return;
                var val=parseInt($ipt.val());
                $ipt.val(val-1);
                if(val==2){
                    $(this).addClass('disable');
                }
            })
            _this.on('click',opts.addBtn,function(){
                var val=parseInt($ipt.val());
                $ipt.val(val+1);
                if(val>0){
                    $min.removeClass('disable');
                }
            })
            _this.on('change','input',function(){
                var $this=$(this);
                var val=$this.val();
                if(!mTools.isNumber(val) || val==0){
                    simpop.tips({content:'请输入大于1的数字！'});
                    $this.val(1);
                    $min.addClass('disable');
                }
            })
        });
	}

    //规格弹窗函数
    function fnSpic(){
        var $spicTarget=$('.j-spicTarget');
        var $spicBox=$('.j-spicBox');
        var $spicCon=$spicBox.find('.con');
        var $spicClose=$spicBox.find('.close');
        var $spicFt=$spicBox.find('.j-ft');
        $spicClose.click(function(){hideSpic();});
        $spicBox.click(function(){hideSpic();});
        $spicCon.click(function(event){event.stopPropagation();});
        //弹出规格参数
        function showSpic(a){
            if(a=='order'){
                $spicFt.html('<input type="submit" class="order" value="确认" />');
            }else if(a=='cart'){
                $spicFt.html('<a class="cart j-cart">确认</a>')
            }else{
                $spicFt.html('<a class="cart j-cart">加入购物车</a><input type="submit" class="order" value="立即购买" />')
            }
            $spicBox.show();
            setTimeout(function(){$spicCon.addClass('show');},0);
        }
        //隐藏规格参数
        function hideSpic(){
            $spicCon.removeClass('show');
            setTimeout(function(){$spicBox.hide();},300);
        }
        //点击弹出规格
        $spicTarget.click(function(){
           showSpic($(this).data('type'));
        });
    }
    //商品参数函数
    function fnCs(){
        var $target=$('.j-csTarget');
        var $Box=$('.j-csBox');
        var $con=$Box.find('.con');
        var $close=$Box.find('.close');
        $close.click(function(){hide();});
        $Box.click(function(){hide();});
        $con.click(function(event){event.stopPropagation();});
        //弹出规格参数
        function show(a){
            $Box.show();
            setTimeout(function(){$con.addClass('show');},300);
        }
        //隐藏规格参数
        function hide(){
            $con.removeClass('show');
            setTimeout(function(){$Box.hide();},300);
        }
        //点击弹出规格
        $target.click(function(){
           show();
        });
    }
    //邮费
    var freightFn=function(a){
        var a=a||{};
        var defaults={
            freight:'',
			nodelivery:''
        };
        var opts=$.extend(defaults,a);
		//如果无需发货
		if(opts.nodelivery=='1')return;
        if(!opts.freight)return;//防没有运费模板的时候返回
        var $box=$('.j-freightBox');
        if($box.size()==0)return;
        var area;
        var getFreight;
        mWbmc.wbmc({
            target:'.j-freightTarget',
            name:'area',
            pid:'0',
            select:2,
            init:function(obj){
                area=obj;
                //获取邮费
                getFreight=function(id){
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
                $box.html(template('freight',{area:area,cur:opts.cur,freight:opts.freight,getFreight:getFreight})).show();
            },
            callback:function(result){
                if(result && result.length>1){
                    $box.html(template('freight',{area:area,cur:result[1],freight:opts.freight,getFreight:getFreight}))
                }
            }
        })
    }

	var product=function(a){
        var a=a||{};
        var defaults={
			sales_label:[],//商品所有规格
            sales:'',//卖家商品的规格
			sales_arr:[],//商品的组合
            cur:{name:'郑州',id:'149'}
        };
        var opts=$.extend(defaults,a);
        //设置邮费
        freightFn({freight:opts.freight,cur:opts.cur,nodelivery:opts.nodelivery});
        //初始化数量修改函数
        fnQuantity();
        //初始化商品规格弹窗函数
        fnSpic();
        //初始化商品参数弹窗函数
        fnCs();
        var $isSpic=$('.j-isSpic');
        var $spic=$('.j-spic');//规格整个大div
        var $price=$('.j-price');//价格
        var $stock=$('.j-stock');//库存
        var $spicVal=$('.j-spicVal');//规格的真值
        var $spicBox=$('.j-spicBox');
        var $orderForm=$spicBox.find('form');
        var $orderSales=$spicBox.find('.j-sales');//
        var $givepoint=$('.j-givepoint');//赠送的积分的jquery对象
		var	$pointB=$('.j-pointB');
		var $pointBNum=$pointB.find('.j-pointBNum');
        //立即购买按钮
        $orderForm.submit(function(event){
            if(!mTools.isLogin()){
                mTools.getLogin();
                return false;
            }
        });
        //加入购物车
		$orderForm.on('click','.j-cart',function(){
            var salesVal=$orderSales.val();
            if(!$.isEmptyObject(opts.sales_attribute) && !salesVal){
                simpop.tips({content:'请先选择商品规格后添加到购物车',time:2000});
                return false;
            }
            //规格部分
            mTools.request({
                url:'?m=product&c=cart&a=add',
                isLogin:true,
                type:'post',
                data:'products[0][id]='+opts.id+'&products[0][quantity]='+$spicBox.find('.j-quantity').val(),
                success:function(ret){
                    if(ret.status){
                        simpop.tips({
                            content:ret.info,
                            callback:function(){
                                if(ret.url)window.location.href=ret.url;
                            }
                        })
                    }
                    else{simpop.alert({content:ret.info})}
                }
            });
		});
        //设置规格
        if(opts.sales){
			$isSpic.show();
			//如果有规格的话
			// 设置选中
			var salesArr=opts.sales.split('|');
			var label=[];
			for(var i in opts.sales_label){
				label[i]={id:opts.sales_label[i].id,name:opts.sales_label[i].name,children:[]};
				for(var j in opts.sales_label[i].children){
					var tx=false;
					for(var n in salesArr){
						if(j==salesArr[n]){tx=true;break;}
					}
					if(tx){
						label[i].children.push({id:j,name:opts.sales_label[i].children[j],isSel:true});
					}else{
						label[i].children.push({id:j,name:opts.sales_label[i].children[j]});
					}
				}
			}
			$spic.html(template('spic',{'sales':label}));
			$spic.on('click','.btn1:not(.btn1-not-stock)',function(){
				var $this=$(this);
				var id=$this.data('id');
				var index=$this.data('index');
				var sales=[];
				for(var i in label){
					if(i==index){
						sales.push(id);
					}else{
						for(var j in label[i].children){
							var children=label[i].children[j];
							if(children.isSel){
								sales.push(children.id);
							}
						}
					}
				}
				for(var i in opts.sales_arr){
					if(opts.sales_arr[i].sales==sales.join('|')){
						window.location.href="?m=product&a=item&id="+opts.sales_arr[i].id;
					}
				}
			})
        }
	}

	module.exports={
		product:product//商品详情页
	}
})
