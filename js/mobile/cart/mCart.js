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
            sales_attributes:[],//商品规格
            sales_attribute:{},//用户填写的商品规格
            cur:{name:'郑州',id:'149'},
            spic:false//是否填写了规格
        };
        var opts=$.extend(defaults,a);
        //设置邮费
        freightFn({freight:opts.freight,cur:opts.cur,nodelivery:opts.nodelivery});
        //商品规格
        for(var i in opts.sales_attribute){
            opts.spic=true;
        }
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
        if(opts.spic)$isSpic.show();
        $price.data('defaultValue',$price.html());
        $stock.data('defaultValue',$stock.html());
        //立即购买按钮
        $orderForm.submit(function(event){
            if(!$.isEmptyObject(opts.sales_attribute) && $orderSales.val()==''){
                simpop.tips({content:'请先选择商品规格后再购买',time:2000});
                return false;
            }
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
                data:'products[0][id]='+$spicBox.find('.j-id').val()+'&products[0][quantity]='+$spicBox.find('.j-quantity').val()+'&products[0][sales]='+salesVal,
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
        // console.log(opts.sales_attributes);
        // console.log(opts.sales_attribute);
		function getGivepoint(result){
			if(opts.give_point_json && !$.isEmptyObject(opts.give_point_json)){
				if(!result)return $givepoint.find('b').text('0');
				var diff=parseFloat(result.price)-parseFloat(result.cost);
				// console.log(opts.give_point_json);
				// console.log(diff);
				var givepoint=opts.give_point_json[diff]?opts.give_point_json[diff]:0;
				return $givepoint.show().find('b').text(givepoint);
			}else{
				$givepoint.show();
				$pointB.show();
				$pointBNum.text(opts.price);
				return $givepoint.show().find('b').text(opts.give_point);
			}

		}
        if($.isEmptyObject(opts.sales_attribute)){
			getGivepoint();
		}else{
            var sales={};
            sales.sales_attribute_str=mTools.serialize(opts.sales_attribute);
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
                $spic.on('click','.btn1:not(.btn1-not-stock)',function(){
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
                            var result=opts.sales_attribute;
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
                        if(result.price){
							$price.html('￥<b>'+result.price+'</b>');
							$pointB.show();
							$pointBNum.text(result.price);
						}
                        else{
							$price.html($price.data('defaultValue'));
							$pointB.hide();
							$pointBNum.text('0');
						}
                        $stock.html('库存'+result.stock+'件');
                        $orderSales.val(sales.sels.join(','));
						//赠送的积分
                        getGivepoint(result);
                    }else{
                        //出现没匹配到的问题
                       $price.html($price.data('defaultValue'));
					   $pointB.hide();
					   $pointBNum.text('0');
                        $stock.html('库存0件');
                        $orderSales.val('');
						//赠送的积分
                        getGivepoint();
                    }
                }
            }
        }
	}

	module.exports={
		product:product//商品详情页
	}
})
