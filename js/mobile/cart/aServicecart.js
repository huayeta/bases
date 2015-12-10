seajs.use(['angular','aForm','aTools','simpop'],function(angular,aForm,aTools,simpop){
		var ionicApp=angular.module('ionicApp',['aForm','aTools']);
		ionicApp.controller('ajaxForm',function($scope,$window,aForm){
            $scope.items={};//储存购物车商品的信息
            $scope.total={};//储存购物车商品总价格和数量信息
            $scope.total.num=0;//总购物数量
            $scope.total.price=0;//总购物金额
            $scope.total.isSel=true;//储存购物车商品是否全选
            $scope.total.isEditor=false;//是否在编辑状态
            $scope.total.editorTxt='编辑';//编辑文字
            aForm.request({url:'?m=service&c=cart&a=index',isJson:true})
            .success(function(ret){
                if(ret.status){
                    $scope.items=ret.info.infos;
					//给每一项默认加上选择状态
					angular.forEach($scope.items,function(n,i){
						$scope.items[i].isSel=true;
					});
					$scope.updataForm();
                }
            });
            //编辑状态显示隐藏数量的编辑
            $scope.editor=function(){
                $scope.total.isEditor=!$scope.total.isEditor;
                if($scope.total.isEditor==true){$scope.total.editorTxt='完成'}
                else{$scope.total.editorTxt='编辑'}
            };
            //数量改变时候的函数
            $scope.modify=function(index,type){
                var product=$scope.items[index];
                var quantity=product.quantity;
                if(type=='add'){
                    quantity++;
                }else if(type=='min'){
                    if(quantity!=1){
                        quantity--
                    }
                }else{
                    if(!/^\d+$/.test(quantity)){
                        simpop.tips({content:'请输入正整数'});
                        quantity=1;
                    }
                }
                $scope.items[index].quantity=quantity;
                aForm.request({url:'?m=service&c=cart&a=change_quantity'+'&id='+product.id+'&v='+product.quantity})
                .success(function(ret){
                    if(!ret.status)simpop.tips({content:ret.info});
                    if(product.isSel)$scope.updataForm();
                });
            }
            //删除函数
            $scope.del=function(id,index){
                var product=$scope.items[index];
                simpop.alert({content:'您确定要删除此商品？',callback:function(){
                    aForm.request({url:'?m=service&c=cart&a=del&id='+product.id}).success(function(ret){
                        if(ret.status){
                            simpop.tips({content:ret.info});
                            $scope.items.splice(index,1);
                            $scope.updataForm();
                        }else{simpop.alert({content:ret.info});}
                    });
                }})
            }
			//全选改动
			$scope.changeSel=function(){
				angular.forEach($scope.items,function(n,i){
					$scope.items[i].isSel=$scope.total.isSel;
				});
				$scope.updataForm();
			}
            //更新form提交数据
            $scope.updataForm=function(){
				var num=0;
				var price=0;
				var isSel=true;
                angular.forEach($scope.items,function(n,i){
                    if(n.isSel){
						num+=parseInt(n.quantity);
						price+=parseFloat(n.price)*parseInt(n.quantity);
					}else{
						isSel=false;
					}
                })
				$scope.total.isSel=isSel;
				$scope.total.price=price.toFixed(2);
                $scope.total.num=num;
            };
            //提交函数
			$scope.onSubmit=function(e){
				if($scope.total.num==0){
                    simpop.tips({content:'请先选择商品后再提交'});
                    return;
                }
				var data={products:{}};
				angular.forEach($scope.items,function(n,i){
					if(n.isSel){
						var objTmp={};
						objTmp['id']=n.productid;
						objTmp['quantity']=n.quantity;
						objTmp['description']=n.description;
						objTmp['checked']='on';
						data.products[n.id]=objTmp;
					}
                })
                $scope.disabled=true;
				aForm.form({
					url:'?m=service&c=order&a=submit',
					type:'POST',
					data:data,
					success:function(ret){
						if(ret.status){
							$window.location.href=ret.url;
						}else{
							simpop.alert({content:ret.info});
                            $scope.disabled=false;
						}
					}
				});
			};
		});
	});