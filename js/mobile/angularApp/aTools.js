define('aTools',function(require, exports, module){
	var simpop=require('simpop');
	require('zepto');
    require('uiRouter');
    var aForm=require('aForm');
	var angular=require('angular');
    var aTools=angular.module('aTools',['ui.router','aForm']);
    aTools.directive('toolsSelparent',function(){
        return{
            restrict:'A',
            scope:true,
            name:'selparent',
            controller:function(){},
            link:function(scope,ele,attrs){
                var size=attrs.toolsSelparent;
                scope.$on('selChild.updata',function(e){
                    scope.$broadcast('selParent.updata',size);
                });
                scope.$on('toolsSelbtn.updata',function(e,sel){
                    scope.$broadcast('toolsSel.updata',sel);
                });
            }
        }
    });
    aTools.directive('toolsSelbtn',function(){
        return{
            restrict:'A',
            scope:{
                sel:'=toolsSelbtn'
            },
            link:function(scope,ele,attrs){
                if(!scope.sel)scope.sel=false;
                ele.bind('click',function(){
                    scope.sel=!scope.sel;
                    scope.$emit('toolsSelbtn.updata',scope.sel);
                    scope.$apply();
                })
            }
        }
    })
    aTools.directive('toolsSel',function(){
        return{
            restrict:'A',
            scope:{
                name:'='
            },
            require:'^?selparent',
            link:function(scope,ele,attrs,parent){
                var tx=attrs.name;
                var val=attrs.toolsSel;
                var _this=angular.element(ele[0]);
                scope.$on('selParent.updata',function(e,size){
                    if(size=='1'){
                        _this.removeClass('u-sel');
                    }
                });
                scope.$on('toolsSel.updata',function(e,sel){
                    if(sel){
                        _this.addClass('u-sel');
                        if(tx){
                            scope.$apply(function(){
                                scope.name=val;
                            })
                        }
                    }else{
                        _this.removeClass('u-sel');
                        if(tx){
                            scope.$apply(function(){
                                scope.name='';
                            })
                        }
                    }
                })
                if(scope.name && scope.name==val){
                    _this.addClass('u-sel');
                }
                ele.bind('click',function(){
                    if(parent)scope.$emit('selChild.updata');
                    if(_this.hasClass('u-sel')){
                        _this.removeClass('u-sel');
                        if(tx){
                            scope.$apply(function(){
                                scope.name='';
                            })
                        }
                    }else{
                        _this.addClass('u-sel');
                        if(tx){
                            scope.$apply(function(){
                                scope.name=val;
                            })
                        }
                    }
                });
            }
        }
    });
    aTools.factory('selDate',function(){
        return {
            data:{},
            add:function(a){
               if(!this.data[a.id]){
                   this.data[a.id]={};
                   this.data[a.id].data=[];
               }
                this.data[a.id].isSel=true;
                this.data[a.id].data.push(a);
            },
            modify:function(a,index){
                this.data[a.id][index]=a;
            }
        }
    });
    aTools.directive('selParent',function($rootScope,selDate){
        return{
            restrict:'A',
            scope:{
                sel:'=selParent'
            },
            link:function(scope,ele,attrs){
                ele.bind('click',function(){
                    scope.sel=!scope.sel;
                    angular.forEach(selDate.data,function(n,i){
                        n.isSel=scope.sel;
                        angular.forEach(n.data,function(m,j){
                            m.isSel=scope.sel;
                        })
                    })
                    $rootScope.$broadcast('selParent.updata',scope.sel);
                });
                $rootScope.$on('selParentsub.updata',function(e,val){
                    if(val.isSel==false){
                        scope.sel=false;
                    }else{
                        var isSel=true;
                        angular.forEach(selDate.data,function(n,i){
                            if(n.isSel==false){
                                isSel=false;return;
                            }
                        })
                        scope.sel=isSel;
                    }
                    scope.$apply();
                })
                $rootScope.$on('selChild.updata',function(e,val){
                    if(val.isSel==false){
                        scope.sel=false;
                    }else{
                        var isSel=true;
                        angular.forEach(selDate.data,function(n,i){
                            if(n.isSel==false){isSel=false;return}
                        })
                        scope.sel=isSel;
                    }
                    scope.$apply();
                })
            }
        }
    });
    aTools.directive('selParentsub',function($rootScope,selDate){
        return{
            restrict:'A',
            scope:{
                sel:'=selParentsub'
            },
            link:function(scope,ele,attrs){
                var id=attrs.selId;
                var obj={};
                obj.id=id;
                obj.isSel=scope.sel;
                ele.bind('click',function(){
                    scope.sel=!scope.sel;
                    obj.isSel=scope.sel;
                    selDate.data[id].isSel=scope.sel;
                    angular.forEach(selDate.data[id],function(n,i){
                        n.isSel=scope.isSel;
                    })
                    $rootScope.$broadcast('selParentsub.updata',obj);
                });
                scope.$on('selParent.updata',function(e,val){
                    scope.sel=val;
                    scope.$apply();
                });
                scope.$on('selChild.updata',function(e,val){
                    if(val.id==id){
                        scope.sel=selDate.data[val.id].isSel;
                        scope.$apply();
                    }
                })
            }
        }
    });
    aTools.directive('selChild',function($rootScope,selDate){
        return{
            restrict:'A',
            scope:{
                sel:'=selChild'
            },
            link:function(scope,ele,attrs){
                var id=attrs.selId;
                var index=parseInt(attrs.selIndex)-1;
                var obj={};
                obj.id=id;
                obj.isSel=scope.sel;
                selDate.add(obj);
                ele.bind('click',function(){
                    scope.sel=!scope.sel;
                    obj.isSel=scope.sel;
                    selDate.data[id]['data'][index].isSel=scope.sel;
                    if(scope.sel==false){
                        selDate.data[id].isSel=false;
                    }else{
                        var isSel=true;
                        angular.forEach(selDate.data[id].data,function(n,i){
                            if(n.isSel==false){isSel=false;return;}
                        })
                        selDate.data[id].isSel=isSel;
                    }
                    $rootScope.$broadcast('selChild.updata',obj);
                })
                scope.$on('selParent.updata',function(e,val){
                    scope.sel=val;
                    scope.$apply();
                });
                scope.$on('selParentsub.updata',function(e,val){
                    if(val.id==id){
                       scope.sel=val.isSel;
                        scope.$apply();
                    }
                })
            }
        }
    });
    //repeat渲染完毕之后执行某个函数
    aTools.directive('myRepeatFinished',function($timeout){
        return{
            restrict:'A',
            link:function(scope,ele,attrs){
                if(scope.$last===true){
                    $timeout(function() {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    });
	//点击到某一网址
    aTools.directive('goto',function($window){
        return{
            restrict:'A',
            scope:{
                goTo:'@goto'
            },
            link:function(scope,ele,attrs){
                ele.bind('click',function(){
					if(!scope.goTo)return;
                    if(attrs.out){
                        $window.top.window.location.href=scope.goTo;
                    }else{
						if(attrs.replace){
							window.history.replaceState(null,null,scope.goTo);
							window.location.href=scope.goTo;
						}else{
							$window.location.href=scope.goTo;
						}
                    }
				})
            }
        }
    });
	//点击回退
	aTools.directive('goback',function($window){
		return{
			restrict:'A',
			link:function(scope,ele,attrs){
				ele.bind('click',function(){
                    var length=Math.abs(attrs.goback?attrs.goback:-1);
					if($window.history.length>length){
                        $window.history.go(attrs.goback?attrs.goback:-1);
                    }else{
                        //如果没有历史记录就跳到首页
                        $window.location.href=$window.location.origin;
                    }
				})
			}
		}
	});
	//点击阻止冒泡
	aTools.directive('stoppropagation',function(){
		return{
			restrict:'A',
			link:function(scope,ele,attrs){
				ele.bind('click',function(event){
					event.stopPropagation();
				});
			}
		}
	});
    //点击执行某个函数
    aTools.directive('myClick',function($parse){
        return{
            restrict:'A',
            link:function(scope,ele,attrs){
                ele.bind('click',function(){
                    $parse(attrs.myClick)(scope);
                    scope.$apply();
                })
            }
        }
    })
    //点击执行某个函数
    aTools.directive('myChange',function($parse){
        return{
            restrict:'A',
            link:function(scope,ele,attrs){
                ele.bind('change',function(){
                    $parse(attrs.myChange)(scope);
                    scope.$apply();
                })
            }
        }
    })
	//服务加入购物车
	aTools.directive('serviceCart',function(aForm){
		return{
			restrict:'A',
			scope:{
				before:'&before',
				success:'&success',
                datafn:'&datafn'
			},
			link:function(scope,ele,attrs){
                ele.bind('click',function(){
                    var tx=true;
                    if(attrs.before)tx=scope.before();
                    if(!tx)return;
                    var name=attrs.name;
                    if(!attrs.name)name='id';
                    var nameArr=name.split(',');
                    var data={products:[]};
                    if(!attrs.datafn){
                        var objTmp={};
                        for(var i in nameArr){
                            objTmp[nameArr[i]]=attrs[nameArr[i]];
                        }
                        objTmp['quantity']=1;
                        data.products.push(objTmp);
                    }else{
                        var dataTmp=scope.datafn();
                        for(var obj in dataTmp){
                            var objTmp={};
                            for(var i in nameArr){
                                objTmp[nameArr[i]]=dataTmp[obj][nameArr[i]];
                            }
                            objTmp['quantity']=1;
                            data.products.push(objTmp);
                        }
                    }
                    aForm.form({
                        url:attrs.serviceCart?attrs.serviceCart:'?m=service&c=cart&a=add',
                        type:'POST',
                        data:data,
                        success:function(ret){
                            if(attrs.success){
                                scope.success({response:ret});
                            }else{
                                simpop.tips({content:ret.info});
                            }
                        }
                    });
                });
			}
		}
	});
	//服务立即购买
	aTools.directive('serviceOrder',function($window,aForm){
			return{
				restrict:'A',
				scope:{
					before:'&before',
					success:'&success',
                    datafn:'&datafn'
				},
				link:function(scope,ele,attrs){
                    ele.bind('click',function(){
                        var tx=true;
                        if(attrs.before)tx=scope.before();
                        if(!tx)return;
                        var nameArr=attrs.name.split(',');
                        var data={products:[]};
                        if(!attrs.datafn){
                            var objTmp={};
                            for(var i in nameArr){
                                objTmp[nameArr[i]]=attrs[nameArr[i]];
                            }
                            objTmp['quantity']=1;
                            objTmp['checked']='on';
                            data.products.push(objTmp);
                        }else{
                            var dataTmp=scope.datafn();
                            for(var obj in dataTmp){
                                var objTmp={};
                                for(var i in nameArr){
                                    objTmp[nameArr[i]]=dataTmp[obj][nameArr[i]];
                                }
                                objTmp['quantity']=1;
                                objTmp['checked']='on';
                                data.products.push(objTmp);
                            }
                        }
                        aForm.form({
                            url:attrs.serviceOrder?attrs.serviceOrder:'?m=service&c=order&a=submit',
                            type:'POST',
                            data:data,
                            success:function(ret){
                                if(attrs.success){
                                    scope.success({response:ret});
                                }else{
                                    if(ret.status){
                                        $window.location.href=ret.url;
                                    }else{
                                        simpop.alert({content:ret.info});
                                    }
                                }
                            }
                        });
                    });
				}
			}
		});
    aTools.directive('atoolsDel',function($window,aForm){
        return{
            restrict:'A',
            scope:{
                url:'@atoolsDel',
                parames:'=parames',
                paramesFn:'&paramesfn',
                successFn:'&successfn',
                cancelFn:'&cancelfn'
            },
            link:function(scope,ele,attrs){
                ele.bind('click',function(){
                    if(!scope.url)return;
                    var _url=scope.url;
                    if(scope.parames){
                       var id=aTools.arrVal(scope.parames);
                        if(!id){simpop.tips({content:'请先选择信息'});return;}
                        _url+=id;
                    }else if(attrs.paramesfn){
                        var id=scope.paramesFn();
                        if(!id){simpop.tips({content:'请先选择信息'});return;}
                        _url+=id;
                    }
                    simpop.alert({
                        content:attrs.content?attrs.content:'你确定要删除吗（删除后不可恢复）？',
                        callback:function(){
                            aForm.request({url:_url})
                            .success(function(ret){
                                if(ret.status){
                                    if(attrs.successfn){scope.successFn({ret:ret});}
                                    else{
                                        simpop.tips({content:ret.info,callback:function(){$window.location.reload();}})
                                    }
                                }else{
                                    simpop.tips({content:ret.info});
                                }
                            });
                        },
                        cancelFn:function(){
                            if(attrs.cancel){scope.cancelFn();}
                        }
                    });
                });
            }
        }
    })
	aTools.directive('atoolsAjax',function($window,aForm,$window){
        return{
            restrict:'A',
            scope:{
                url:'@atoolsAjax',
                parames:'=parames',
                paramesFn:'&paramesfn',
                successFn:'&successfn',
				callback:'&callback'
            },
            link:function(scope,ele,attrs){
                ele.bind('click',function(){
					var obj={};
					obj.isLogin=attrs.login;//判断是否需要登陆
					obj.successContent=attrs.successcontent;//成功后显示的文字
                    obj.alert=attrs.alert;//是否是弹窗
					obj.isReload=attrs.isreload;//成功后是否需要刷新
					if(obj.isLogin=='true'){
						var status=false;
						$.ajax({
							url:'?m=member&c=index&a=getinfo',
							dataType:'json',
							async:false,
							success:function(ret){
								if(ret.status)status=true;
							}
						})
						if(!status){
                            require.async(['mBox'],function(mBox){
                                mBox.getLogin(attrs.pid);
                            });
                            return;
                        }
					}
                    if(!scope.url)return;
                    var _url=scope.url;
                    if(scope.parames){
                       var id=aTools.arrVal(scope.parames);
                        if(!id){simpop.tips({content:'请先选择信息'});return;}
                        _url+=id;
                    }else if(attrs.paramesfn){
                        var id=scope.paramesFn();
                        if(!id){simpop.tips({content:'请先选择信息'});return;}
                        _url+=id;
                    }
                    aForm.request({url:_url,isJson:true})
					.success(function(ret){
						if(attrs.callback){return scope.callback({ret:ret});}
						if(ret.status){
							if(attrs.successfn){scope.successFn({ret:ret});}
							else{
								if(obj.alert){
                                    simpop.alert({content:obj.successContent?obj.successContent:ret.info,callback:function(){obj.isReload!='false'?$window.location.reload():'';}})
                                }else{
                                    simpop.tips({content:obj.successContent?obj.successContent:ret.info,callback:function(){obj.isReload!='false'?$window.location.reload():'';}})
                                }
							}
						}else{
							simpop.tips({content:ret.info});
						}
					});
                });
            }
        }
    });
	//长按执行的函数
	aTools.directive('press',function($parse){
		return{
			restrict:'A',
			link:function(scope,ele,attrs){
				require.async(['hammer'],function(hammer){
					var hammertime=new Hammer(ele[0],{});
                    hammertime.on('press',function(ev){
                        scope.$eval(attrs.press);
                        scope.$apply();
                    })
				});
			}
		}
	});
	//判断是否是微信
	aTools.directive('iswx',function(){
		return{
			restrict:'EACM',
			link:function(scope,ele,attrs){
				var isWeixin=aTools.isWeixin();
                if(!isWeixin){ele.remove();}
				// if(isWeixin){
				// 	ele.addClass('f-db');
				// }else{
    //                 ele.remove();
				// }
			}
		}
	});
	aTools.directive('nowx',function(){
		return{
			restrict:'EACM',
			link:function(scope,ele,attrs){
				var isWeixin=aTools.isWeixin();
                if(isWeixin){ele.remove();}
				// if(!isWeixin){
    //                 ele.addClass('f-db');
				// }else{
    //                 ele.remove();
				// }
			}
		}
	});
	aTools.directive('agreement',function(aForm){
		return{
			restrict:'A',
			link:function(scope,ele,attrs){
				var type=attrs.agreement;
				if(!type)return;
				aForm.promise({
					url:'?m=member&a=agreement&name='+type,
					isJson:true
				}).then(function(ret){
					if(!ret.status)return;
					angular.element(ele).text(ret.info.title)
				});
			}
		}
	});
    aTools.config(function($stateProvider,$urlRouterProvider){
//       $urlRouterProvider.otherwise("/index");
       $stateProvider
       .state('chooseMember',{
            url:'/chooseMember?id&size&url',
            templateUrl:function(stateParams){
                return aTools.chooseMemberUrl(stateParams);
            },
            controller:function($scope,$rootScope,$state,$stateParams,$window,aForm,result){
                $scope.title="快速查找";
                $scope.sel={};
                var size=$stateParams.size?$stateParams.size:1;
				$scope.goBack=function(){
					 $window.history.go(-1);
				}
                var _url=aTools.chooseMemberUrl($stateParams);
				$scope.scrollPageUrl=_url;
				$scope.getItems=function(items){
					$scope.items=items;
				}
                $scope.change=function(index){
                    var sel=!$scope.sel[index];
					if(size==1){
                        $scope.sel={};
                        if(sel){
                            $scope.sel[index]=sel;
                        }
                    }else{
                        if(sel){
                            $scope.sel[index]=sel;
                        }else{
                            delete $scope.sel[index];
                        }
                    }
				}
                $scope.complete=function(){
                    var arr=[];
                    for(var i in $scope.sel){
                        arr.push($scope.items[i]);
                    }
					result.setResult($stateParams.id,arr);
                    $scope.goBack();
                }
            }
       })
    });
    //引导认证信息服务
    aTools.factory('openInfo',function(aForm,$window){
        var obj={};
        var _this={};
        obj.alert=function(a){
            var a=a||{};
            var defaults={
                callback:function(){}
            }
            var opts=$.extend(defaults,a);
            aForm.request({url:'?m=member&c=index&a=getconfig'}).success(function(re){
                if(re.status && re.info){
                    var member=re.info.member;
                    if(member.addinfo=='1'){
                        aForm.request({url:'?m=member&c=index&a=getinfo&expand=true'}).success(function(ret){
                            var str='';
                            var arr=[];
                            _this.isStatus=true;
                            if(member.isemail && member.isemail=='1' && ret.info.isemail!='1'){
                                arr.push({
                                    verify:'email',
                                    callback:verify_email,
                                    txt:'邮箱',
                                    url:'?m=member&c=account&a=verify_email'
                                });
								$window.location.href='?m=member&c=account&a=verify_email';
								return;
                                _this.isStatus=false;
                            }
                            if(member.ismobile && member.ismobile=='1' && ret.info.ismobile!='1'){
                                arr.push({
                                    verify:'mobile',
                                    callback:verify_mobile,
                                    txt:'手机',
                                    url:'?m=member&c=account&a=verify_mobile'
                                });
								$window.location.href='?m=member&c=account&a=verify_mobile';
								return;
                                _this.isStatus=false;
                            }
                            if(member.isauth && member.isauth=='1' && ret.info.isidcard!='1'){
                                arr.push({
                                    verify:'auth',
                                    callback:verify_auth,
                                    txt:'身份',
                                    url:'?m=member&c=account&a=verify_card'
                                });
								$window.location.href='?m=member&c=account&a=verify_card';
								return;
                                _this.isStatus=false;
                            }
                            // if(member.isgroupid && member.isgroupid=='1' && !isTrue(ret.info.groupid)){
                            //     arr.push({
                            //         verify:'isgroupid',
                            //         callback:verify_isgroupid,
                            //         txt:'认证vip会员',
                            //         url:opts.is_yst=='1'?'?m=service&c=vip&a=buy':'?m=algorithm&c=index&a=index'
                            //     });
                            //     _this.isStatus=false;
                            // }
                            //判断是否为真
                            function isTrue(a){
                                if(!a)return false;
                                if(a=='0')return false;
                                if(a=='')return false;
                                return true;
                            }
                            //认证邮箱
                            function verify_email(){
                                simpop.close();
                                simpop.alert({
                                    title:'认证邮箱',
                                    style:'padding:10px; width:320px;',
                                    content:'<div class="u-simtable"><div class="str"><div class="sth">认证邮箱：</div><div class="std"><input type="text" class="u-txt"  /></div></div><div class="str"><div class="sth">验证码：</div><div class="std"><input type="text" class="u-txt" /></div></div><div class="str"><div class="sth"></div><div class="std"><input type="submit" class="u-btn-blue" value="发送验证码" /></div></div></div>',
                                    autoClose:false,
                                    onShow:function(pop){
                                    },
                                    okVal:'<span class="s-red">认证</span>',
                                    callback:function(pop){
                                        var $content=$(pop.pop);
                                    }
                                });
                            }
                            //认证手机
                            function verify_mobile(){
                                simpop.close();
                            }
                            //认证身份
                            function verify_auth(){
                                simpop.close();
                            }
                            //认证vip会员
                            function verify_isgroupid(){
                                simpop.close();
                            }
                            if(!_this.isStatus){
                                var tmp=[];
                                for(var i=0;i<arr.length;i++){
                                    tmp.push(arr[i].txt);
                                }
                                str='请认证（'+tmp.join('/')+'），拥有密码信、登陆特权！';
                                simpop.alert({
									close:false,
									maskclose:false,
									cancelVal:false,
                                    content:str,
                                    callback:function(content,dia){
                                        $window.location.href=arr[0].url;
//                                        arr[0].callback();
                                    },
                                    cancelFn:function(){
                                        opts.callback(false);
                                    }
                                });
                            }else{
                                opts.callback(true);
                            }
                        });
                    }
                }
            });
        }
        return obj;
    })
    //跳转到某个地方
    aTools.factory('anchorScroll', function ($window) {
        function toView(a) {
            var a=a||{};
            var defaults={
                target:'',
                contain:'body,html'
            };
            var opts=$.extend(defaults,a);
            if(!opts.target)return;
            var $target= opts.target.selector!=undefined?opts.target:$(opts.target);
            var $contain= opts.contain.selector!=undefined?opts.contain:$(opts.contain);
            var offset=$target.offset();
            $contain.scrollTop(offset.top-$contain.offset().top);
        }

        return toView;
    })
    /************ 复制一些另类的函数 ************/
    //一个简单的函数
    aTools.chooseMemberUrl=function(stateParams){
        if(stateParams.url)return stateParams.url;
        var url='?m=common&c=dialog&';
        if(!stateParams.a){
            url+='a=choose_member';
        }else{
            url=url+'a='+stateParams.a;
        }
        return url;
    }
    //判断一个对象是否为空
    aTools.isEmptyObject=function(obj){
        var name;
        for(name in obj)return false;
        return true;
    };
    //串联array
    aTools.arrVal=function(arr){
        if(angular.isArray(arr)){
            return arr.join(',');
        }
    };
    //判断是否是微信浏览器
    aTools.isWeixin=function(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    return aTools;
});
