seajs.use(['angular','aForm','aTools','simpop','time'],function(angular,aForm,aTools,simpop,TIME){
    var ionicApp=angular.module('ionicApp',['aForm','aTools']);
    ionicApp.config(function($stateProvider,$urlRouterProvider){
		$urlRouterProvider.otherwise("/index");
       $stateProvider
	   .state('index',{
	       url:'/index',
           templateUrl:'index',
           controller:function($scope,$window,aForm,delivery,store,result,$timeout){
               $scope.form={};
               $scope.delivery={};
               $scope.freight={};
               $scope.disabled={};
               $scope.card={};
               $scope.deliverytime={};
               //发货时间
                $scope.deliverytime.getJson=function(delivery_time){
                    $scope.deliverytime.value=delivery_time;
                    var nowTime=new Date();
                    var nowDate=nowTime.getDate();
                    var nowDay=nowTime.getDay();
                    var arr=[];
                    for(var i in delivery_time.value){
                        var val=delivery_time.value[i];
                        if(delivery_time.type==1){
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
                            arr.push({id:i,name:'周'+TIME.getWeekStr(day)+' '+month+'月'+TIME.formatZero(date)+'日',pid:0});
                        }else if(delivery_time.type==2){
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
                            arr.push({id:i,name:'周'+TIME.getWeekStr(i)+' '+month+'月'+TIME.formatZero(date)+'日',pid:0});
                        }
                        if(delivery_time.value[i].time){
                            var time=delivery_time.value[i].time;
                            for(var j in time){
                                arr.push({id:time[j].starttime+'-'+time[j].endtime,name:time[j].starttime+'-'+time[j].endtime,pid:i});
                            }
                        }else if(delivery_time.value[100] && delivery_time.value[100].time){
                            var time=delivery_time.value[100].time;
                            for(var j in time){
                                arr.push({id:time[j].starttime+'-'+time[j].endtime,name:time[j].starttime+'-'+time[j].endtime,pid:i});
                            }
                        }else{
                            arr.push({id:'',name:'任意时间段',pid:i});
                        }
                    }
                    return arr;
               }
               $scope.deliverytime.callback=function(name){
                    $scope.form['deliverytime']=$scope.deliverytime.value.id+','+$scope.deliverytime.date+','+$scope.deliverytime.time+','+name;
               }
               //积分相关
                $scope.jf={};
                $scope.jf.isTrue=false;//是否使用积分
                $scope.jf.isComplete=false;//是否已经确定使用积分
                $scope.jf.total='';//总积分的个数
                $scope.jf.point='';//使用积分的个数
                $scope.jf.rate='';//转换率
                $scope.jf.price='';//积分兑换成人民币
                $scope.$watch('jf.isTrue',function(val){
                    if(!val)$scope.jf.point='';
                })
                $scope.jf.complete=function(){
                    var reg=/^\d*$/ig;
                    if(!$scope.jf.point){
                        simpop.tips({content:'积分不能为空!'});
                    }else if(!reg.test($scope.jf.point)){
                        simpop.tips({content:'积分必须是数字！'});
                    }else if($scope.jf.point>$scope.jf.available){
                        simpop.tips({content:'使用的积分大于可用积分个数'});
                    }else{
                        var price=(parseFloat($scope.jf.point)/parseFloat($scope.jf.rate)).toFixed(2);
                        if(price>parseFloat($scope.freight.total)){
                            simpop.alert({content:'使用的积分换算后的价格为'+price+'大于商品的总价格'});
                            return;
                        }
                        $scope.jf.price=price;
                        $scope.jf.isComplete=true;
                    }
                }
                $scope.jf.cancel=function(){
                    $scope.jf.point='';
                    $scope.jf.price='';
                    $scope.jf.isComplete=false;
                }

               var TX=true;
                $scope.$watch('jf.point',function(val){
                    $scope.form['point']=val;
                })
                $timeout(function(){
                    if($scope.is_nodelivery==0){
                        //需要发货时候
                        $scope.$watch('delivery',function(obj){
                            if(obj && !aTools.isEmptyObject(obj)){
        //                        console.log(obj);
                                var areaid=obj.areaids[1];
                                $scope.form['delivery[realname]']=obj.realname;
                                $scope.form['delivery[area]']=obj.areas;
                                $scope.form['delivery[address]']=obj.address;
                                $scope.form['delivery[mobile]']=obj.mobile;
                                $scope.form['delivery[phone]']=obj.phone;
                                $scope.form['delivery[zipcode]']=obj.zipcode;
                                $scope.form['delivery[city]']=areaid;
        //                        console.log($scope.form);
                                //设置运费
                                var tmp={};
                                var reg=/^products\[(.*?)\]\[(id|quantity)\]$/i;
                                angular.forEach($scope.form,function(n,i){
                                    var result=reg.exec(i);
                                    if(result){
                                        if(!tmp[result[1]]){
                                            tmp[result[1]]={};
                                        }
                                        tmp[result[1]][result[2]]=n;
                                    }
                                });
        //                        console.log(tmp);
                                var products={};
                                for(i in tmp){
                                    if(!products[tmp[i].id]){
                                        products[tmp[i].id]={};
                                        products[tmp[i].id].id=tmp[i].id;
                                        products[tmp[i].id].quantity=tmp[i].quantity;
                                    }else{
                                        products[tmp[i].id].quantity=parseInt(products[tmp[i].id].quantity)+parseInt(tmp[i].quantity)
                                    }
                                }
        //                        console.log(products);
                                aForm.form({
                                    url:'?m=product&c=order&a=freight',
                                    before:function(){TX=false;},
                                    data:{products:products,areaid:areaid},
                                    type:'post',
                                    success:function(ret){
                                        TX=true;
                                        if(ret.status){
                                            var tmp=$scope.freight.freight?$scope.freight.freight:0;
                                            if($scope.freight.free_post_amount && parseFloat($scope.freight.free_post_amount)<parseFloat($scope.freight.amount)){
                                                $scope.freight.free='(订单满'+$scope.freight.free_post_amount+'包邮)';
                                                $scope.freight.freight=0;
                                                $scope.freight.total=(parseFloat($scope.freight.amount)-tmp).toFixed(2);
                                            }else{
                                                $scope.freight.free=null;
                                                $scope.freight.freight=parseFloat(ret.info).toFixed(2);
                                                $scope.freight.total=(parseFloat($scope.freight.amount)-tmp+parseFloat(ret.info)).toFixed(2);
                                            }
                                            //可用积分多少
                                            var tmp=$scope.freight.total*$scope.jf.rate;
                                            if(tmp>parseFloat($scope.jf.total))tmp=$scope.jf.total;
                                            $scope.jf.available=tmp;
                                        }
                                    }
                                });
                            }
                        },true)
                    }else{
                        TX=true;
                    }
                },0)


                //购物卡
                aForm.promise({url:'?m=financial&c=card&a=cart',isJson:true}).then(function(ret){
                    if(ret.status && ret.info && $.isArray(ret.info.infos)){
                        $scope.card.items=ret.info.infos;//总购物卡
                        $scope.card.infos={};//实际花销的购物卡
                        $scope.card.change=function(index){
                            var item=angular.copy($scope.card.items[index]);
                            item.over=parseFloat(item.over);
                            if(!item.isSel){
                                if($scope.freight.total==0){
                                    simpop.tips({content:'不能再使用购物券了'});
                                    return;
                                }
                                if($scope.freight.total>=item.over){
                                    $scope.freight.total=$scope.freight.total-item.over;
                                }else{
                                    $scope.freight.total=0;
                                    item.over=$scope.freight.total;
                                }
                                $scope.card.infos[item.no]=item;
                                $scope.card.items[index].isSel=true;
                            }else{
                                var children=$scope.card.infos[item.no];
                                $scope.freight.total=$scope.freight.total+children.over;
                                delete $scope.card.infos[item.no];
                                $scope.card.items[index].isSel=false;
                            }
                            //更新form
                            $scope.form.cards=[];
                            for(var i in $scope.card.infos){
                                $scope.form.cards.push($scope.card.infos[i].no);
                            }
                        }
                    }
                });

                //提交之前验证表单是否有效
                function valid(){
                    var tx=true;
                    aForm.defer({
                        url:'?m=product&c=order&a=submit',
                        type:'POST',
                        data:$scope.form,
                        success:function(ret){
                            if(!ret.status){
                                simpop.tips({content:ret.info});
                                tx=false;
                            }
                        }
                    })
                    return tx;
                }
                //提交订单
                $scope.onSubmit=function(e){
                    if(!TX){simpop.tips({content:'请稍等页面正在刷新数据！'});e.preventDefault();return false;}
                   var tx=true;
                    if($scope.status==0){simpop.tips({content:'有缺货商品！'});e.preventDefault();return false;}
                    // if(!$scope.form['delivery[city]']){simpop.tips({content:'收货地址不能为空！'});e.preventDefault();return false;}
                    if(!valid()){e.preventDefault();return false;}
                    $scope.disabled.disabled=true;
                    $scope.disabled.txt='正在提交';
                }

                var reslutData=result.getResult();
                //恢复数据相关
                var storeData=store.getStore();
               if(storeData){
                   for(var i in storeData){
                       if(storeData[i]){
                           for(var j in storeData[i]){
                              $scope[i][j]=storeData[i][j];
                           }
                       }
                   }
               }
               $scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
                    if(reslutData){
                        switch (fromState.name){
                            case 'deliveryList':
                            // console.log(reslutData);
                                $scope.delivery=reslutData.result;
                                break;
                            case 'invoice':
                            //1:不开发票，2:明细
                                if(reslutData.result.type==1){
                                    $scope.form['invoiceid']='';
                                    $scope.form['invoiceTitle']='不开发票';
                                }else if(reslutData.result.type==2){
                                    $scope.form['invoiceid']=reslutData.result.item.id;
                                    $scope.form['invoiceTitle']=reslutData.result.item.title;
                                }
                                break;
                        }
                    }
                })
               //获取默认地址
                $timeout(function () {
                    if($scope.is_nodelivery==0){
                        if(!reslutData && !$scope.delivery.realname){
                            delivery.get().then(function(ret){
                                if(ret.status && ret.info.length>0){
                                    var def=0;
                                    angular.forEach(ret.info,function(n,i){
                                        if(n.default=='1'){
                                            def=i;
                                        }
                                    })
                                    $scope.delivery=ret.info[0];
                                }
                            });
                        }
                    }
                }, 0);
           }
	   })
       .state('deliveryList',{
            url:'/delivery/list?id',
            templateUrl:'list',
            controller:function($scope,$state,$stateParams,$window,aForm,delivery,result){
                $scope.form={};
                delivery.get().then(function(ret){
                    if(ret.status){
                        $scope.items=ret.info;
                        angular.forEach($scope.items,function(n,i){
                            if(n.default=='1'){
                                $scope.sel=i;
                            }
                        })
                        $scope.complete=function(){
                            if($scope.sel==undefined){
                                simpop.tips({content:'请先选择地址'});
                                return false;
                            }
                            result.setResult($stateParams.id?$stateParams.id:'default',$scope.items[$scope.sel]);
                            $window.history.go(-1);
                        };
                    }
                });
            }
       })
       .state('deliveryAdd',{
           url:'/delivery/add',
           templateUrl:'add',
           controller:function($scope,$window,$state,$stateParams,aForm,delivery,classify){
               $scope.form={};
               classify.resolve({name:'area',def:['','','']}).then(function(ret){
                $scope.area=ret.data;
                $scope.vm={};
                $scope.vm.slt1='';
                $scope.vm.slt2='';
                $scope.vm.slt3='';
                $scope.$watch('vm.slt1',function(val){
                    if(val){
                        $scope.form['arg[area]']=null;
                        if(!ret.init[0]){
                            $scope.vm.slt2=null;
                            $scope.vm.slt3=null;
                        }else{
                            ret.init[0]=false;
                        }
                    }
                });
                $scope.$watch('vm.slt2',function(val){
                    if(val){
                        $scope.form['arg[area]']=null;
                        if(!ret.init[1]){
                            $scope.vm.slt3=null;
                        }else{
                            ret.init[1]=false;
                        }
                    }
                });
                $scope.$watch('vm.slt3',function(val){
                    if(val){
                        $scope.form['arg[area]']=ret.idObj[val].id;
                    }
                });
            });
               $scope.complete=function(){
                   var tx=true;
                   angular.forEach($scope.form,function(n,i){
                       if(!n){
                           simpop.tips({content:'所填写的信息不对！'});
                           tx=false;
                           return false;
                       }
                   })
                   if(tx){
                       aForm.form({
                           data:$scope.form,
                           url:'?m=member&c=delivery&a=add',
                           success:function(ret){
                                if(ret.status){
                                    simpop.tips({content:ret.info,callback:function(){$window.history.go(-1);}});
                                }else{
                                    simpop.tips({content:ret.info});
                                }
                           }
                       });
                   }
               }
           }
       })
        .state('invoice',{
            url:'/invoice',
            templateUrl:'invoice',
            controller:function($scope,$window,$state,$stateParams,aForm,result){
                $scope.form={};
                $scope.index=0;
                aForm.promise({url:'?m=member&c=invoice&a=index',isJson:true}).then(function(ret){
                    if(ret.status){
                        $scope.items=ret.info.infos;
                        $scope.items.unshift({id:0,title:'个人'});
                    }
                });
                //添加抬头
                $scope.add=function(){
                    simpop.alert({content:'<input type="text" class="u-txt" />',callback:function(obj){
                        var val=$(obj.pop).find('input').val();
                        aForm.form({
                            url:'?m=member&c=invoice&a=index',
                            data:{title:val},
                            success:function(ret){
                                if(ret.status){
                                    $scope.items.push({id:ret.info,title:val});
                                }else{
                                    simpop.alert({content:ret.info});
                                }
                            }
                        });
                    }});
                }
                //完成
                $scope.complete=function(){
                    result.setResult('invoice',{item:$scope.items[$scope.index],type:$scope.form.type});
                    $window.history.go(-1);
                }
            }
        })
    });
    ionicApp.factory('delivery',function(aForm){
        var fact={
                get:function(){//获取最新地址信息
                    var promise=aForm.promise({url:'?m=member&c=delivery',isJson:true});
                    return promise;
                }
            }
        return fact;
    })
})
