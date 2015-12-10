define('aUpload',function(require, exports, module){
    require('uiRouter');
    var simpop=require('simpop');
	var angular=require('angular');
	var aForm=require('aForm');


    var $=require('jqueryFileUpload');

	var uploader=angular.module('aUpload',['ui.router','aForm']);
    uploader.config(function($stateProvider,$urlRouterProvider){
		$stateProvider
		.state('uploadImage',{
			url:'/upload/image?id&size&isProduct&url&isadmin',
			templateUrl:'?m=attachment&c=images&a=dialog',
			controller:function($scope,$stateParams,$window,aForm,result){
                $scope.size=$stateParams.size?$stateParams.size:1;//是否可以多选
                $scope.items=[];
                var serverUrl='?m=attachment&c=images&a=upload';
                if($stateParams.isProduct)serverUrl='?m=attachment&c=images&a=upload&thumb=2';
                if($stateParams.url)serverUrl=$stateParams.url;
                if($stateParams.isadmin)serverUrl+='&isadmin='+$stateParams.isadmin;
                var curPage=0;
                var uploadNum=0;
                var id=0;
                $scope.pageIsComplete=false;
                function getZero(num){
                    return num<10?('0'+num):num;
                }
                //添加单个item
                function addItem(item){
                    var createtime=item.createtime;
                    var createtime=new Date(parseInt(item.createtime)*1000);;
                    var year=createtime.getFullYear();
                    var month=createtime.getMonth()+1;
                    var date=createtime.getDate();
                    var key=getZero(year)+'年'+getZero(month)+'月'+getZero(date)+'日';
                    if($scope.items.length==0){
                        $scope.items.unshift({
                            createtime:key,
                            childrens:[item]
                        });
                    }else{
                        var firstList=$scope.items[0];
                        if(firstList.createtime==key){
                            firstList.childrens.unshift(item);
                        }else{
                            $scope.items.unshift({createtime:key,childrens:[item]});
                        }
                    }

                }
                //data是一个array
                function addItems(data){
                    angular.forEach(data,function(list,index){
                        var createtime=list.createtime;
                        var createtime=new Date(parseInt(list.createtime)*1000);;
                        var year=createtime.getFullYear();
                        var month=createtime.getMonth()+1;
                        var date=createtime.getDate();
                        var key=getZero(year)+'年'+getZero(month)+'月'+getZero(date)+'日';
                        if($scope.items.length==0){
                            $scope.items.push({createtime:key,childrens:[list]});
                        }else{
                            var lastList=$scope.items[$scope.items.length-1];
                            if(lastList.createtime==key){
                                list.isSel=lastList.isSel;
                                lastList.childrens.push(list);
                            }else{
                                $scope.items.push({createtime:key,childrens:[list]});
                            }
                        }
                    });
                }
                //获取items
                $scope.getItems=function(){
                    curPage++;
                    $scope.pageText='正在加载中...';
                    aForm.request({method:'GET',url:'?m=attachment&c=images&a=document&page='+curPage,isJson:true})
                    .success(function(ret){
                        $scope.pageText='加载更多';
                        if(ret.status && ret.info && ret.info.infos && angular.isArray(ret.info.infos) && ret.info.infos.length>0){
                            var infos=ret.info.infos;
                            var pages=ret.info.pages;
                            if(infos.length>uploadNum){
                                infos.splice(0,uploadNum);
                            }else {
                                uploadNum=uploadNum-infos.length;
                                infos=[];
                            }
                            addItems(infos);
                            if(infos.length<pages.pagesize){
                                $scope.pageIsComplete=true;
                            }
                        }else{
                            $scope.pageIsComplete=true;
                        }

                    });
                }
                //重新获取列表
                $scope.resetItems=function(){
                    curPage=0;
                    $scope.items=[];
                    $scope.getItems();
                }
                $scope.getItems();
                //回退
                $scope.goBack=function(){
					$window.history.go(-1);
				};
                //全选这块
                $scope.handleCheck=function(index){
                    var item=$scope.items[index];
                    var childrens=item.childrens;
                    item.isSel=!item.isSel;
                    angular.forEach(childrens,function(children,i){
                        childrens[i].isSel=item.isSel;
                    });
                }
                //改变选择
                $scope.handleChildrenCheck=function(pIndex,index){
                    var item=$scope.items[pIndex];
                    var childrens=item.childrens;
                    var children=item.childrens[index];
                    if(!children.isProgress){
                        children.isSel=!children.isSel;
                        if($scope.size=='1'){
                            angular.forEach($scope.items,function(item,i){
                                angular.forEach(item.childrens,function(children,j){
                                    if(i!=pIndex || (i==pIndex && j!=index)){
                                        children.isSel=false;
                                    }
                                })
                            });
                        }else{
                            if(!children.isSel){
                                item.isSel=false;
                            }else {
                                var tx=true;
                                angular.forEach(childrens,function(children){
                                    if(!children.isSel){
                                        tx=false;
                                        return;
                                    }
                                })
                                item.isSel=tx;
                            }
                        }
                    }else{
                        simpop.tips({content:'请先等待图片上传完成后再选择'});
                        return false;
                    }
				};
                //完成
                $scope.complete=function(){
                    var returnData=[];
                    angular.forEach($scope.items,function(item){
                        angular.forEach(item.childrens,function(children){
                            if(children.isSel){
                                returnData.push(children);
                            }
                        })
                    })
                    if($stateParams.isProduct){
						var _url='';
						if($stateParams.isProduct)_url='index.php?m=attachment&c=images&a=thumb&thumb=2';
						if(parseInt($stateParams.isadmin)==1){_url+='&isadmin=1'}
						angular.forEach(returnData,function(n,i){
							_url+='&path='+encodeURIComponent(n.filepath);
							aForm.request({url:_url,method:'GET',isJson:true}).success(function(ret){
                                if(!ret.status)simpop.tips({content:ret.info});
                            });
						})
					}
                    result.setResult($stateParams.id,returnData);
                    $window.history.go(-1);
				};
                //上传
                $('#fileupload').fileupload({
                    url:serverUrl,
                    dataType: 'json',
                    sequentialUploads:true,
                    add:function(e, data){
                        data.timeId=Math.floor(new Date().getTime()/1000)+id;
                        id++;
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            addItem({
                                createtime:data.timeId,
                                thumb:event.target.result,
                                filename:data.files[0].name,
                                isProgress:true,
                                css:{'width':0.1*100+'%'}
                            })
                            $scope.$apply();
                            data.submit();
                        };

                        reader.onerror = function(event) {
                            simpop.alert({content:event.target.error.code});
                            // console.error("File could not be read! Code " + event.target.error.code);
                        };
                        reader.readAsDataURL(data.files[0]);
                    }
                }).on('fileuploadprogress',function(e, data){
                    var progress = parseInt(data._progress.loaded / data._progress.total * 100, 10);
                    $.each($scope.items,function(pIndex,item){
                        var tx=false;
                        $.each(item.childrens,function(index,children){
                            if(children.createtime==data.timeId){
                                $scope.items[pIndex].childrens[index].css={'width':0.1*progress+'%'};
                                $scope.$apply();
                                tx=true;
                                return false;
                            }
                        })
                        if(tx)return false;
                    });
                }).on('fileuploaddone',function(e, data){
                    var ret=data.result;
                    $.each($scope.items,function(pIndex,item){
                        var tx=false;
                        $.each(item.childrens,function(index,children){
                            if(children.createtime==data.timeId){
                                console.log(data.timeId,children.createtime);
                                if(ret.status){
                                    var thumb=children.thumb;
                                    var obj=$.extend({},ret.info);
                                    obj.thumb=thumb;
                                    obj.isProgress=false;
                                    $scope.items[pIndex].childrens.splice(index,1,obj);
                                    $scope.handleChildrenCheck(pIndex,index);
                                }else{
                                    $scope.items[pIndex].childrens.splice(index,1);
                                    simpop.alert({content:ret.info});
                                }
                                tx=true;
                                return false;
                            }
                        })
                        if(tx)return false;
                    });
                    $scope.$apply();
                });
            }
        })
        .state('uploadFile',{
			url:'/upload/file?id&size&url&isadmin',
			templateUrl:'?m=attachment&c=attachment&a=dialog',
			controller:function($scope,$stateParams,$window,aForm,result){
                var SIZE=$stateParams.size?$stateParams.size:1;//是否可以多选
                $scope.items=[];
                var serverUrl='?m=attachment&c=attachment&a=upload';
                if($stateParams.url)serverUrl=$stateParams.url;
                if($stateParams.isadmin)serverUrl+='&isadmin='+$stateParams.isadmin;
                var curPage=1;
                var uploadNum=0;
                var id=0;
                $scope.pageIsComplete=false;
                $scope.getItems=function(){
                    $scope.pageText='正在加载中...';
                    aForm.request({method:'GET',url:'?m=attachment&c=attachment&a=document&page='+curPage,isJson:true})
                    .success(function(ret){
                        $scope.pageText='加载更多';
                        if(ret.status && ret.info && ret.info.infos && angular.isArray(ret.info.infos) && ret.info.infos.length>0){
                            var infos=ret.info.infos;
                            var pages=ret.info.pages;
                            if(infos.length>uploadNum){
                                infos.splice(0,uploadNum);
                            }else {
                                uploadNum=uploadNum-infos.length;
                                infos=[];
                            }
                            $scope.items=$scope.items.concat(infos);
                            if(infos.length<pages.pagesize){
                                $scope.pageIsComplete=true;
                            }
                        }else{
                            $scope.pageIsComplete=true;
                        }

                    });
                }
                $scope.getItems();
                $scope.goBack=function(){
					$window.history.go(-1);
				};
                $scope.changeClass=function(index){
                    if(!$scope.items[index].isProgress){
                        $scope.items[index].isSel=!$scope.items[index].isSel;
                        if(SIZE=='1'){
                            angular.forEach($scope.items,function(n,i){
                                if(i!=index){
                                    n.isSel=false;
                                }
                            });
                        }
                    }else{
                        simpop.tips({content:'请先等待文件上传完成后再选择'});
                        return false;
                    }
				};
                $scope.complete=function(){
                    var returnData=[];
                    angular.forEach($scope.items,function(n,i){
                        if(n.isSel){
                            returnData.push(n);
                        }
                    })
                    result.setResult($stateParams.id,returnData);
                    $window.history.go(-1);
				};
                $('#fileupload').fileupload({
                    url:serverUrl,
                    dataType: 'json',
                    sequentialUploads:true,
                    add:function(e, data){
                        data.timeId=Math.floor(new Date().getTime()/1000)+id;
                        id++;
                        $scope.items.unshift({
                            createtime:data.timeId,
                            filename:data.files[0].name,
                            isProgress:true,
                            css:{'width':0.1*100+'%'}
                        });
                        $scope.$apply();
                        data.submit();
                    }
                }).on('fileuploadprogress',function(e, data){
                    var progress = parseInt(data._progress.loaded / data._progress.total * 100, 10);
                    $.each($scope.items,function(pIndex,item){
                        if(item.createtime==data.timeId){
                            $scope.items[i].css={'width':0.1*progress+'%'};
                            $scope.$apply();
                            return;
                        }
                    });
                }).on('fileuploaddone',function(e, data){
                    var ret=data.result;
                    $.each($scope.items,function(pIndex,item){
                        if(item.createtime==data.timeId){
                            if(ret.status){
                                var obj=ret.info;
                                obj.isProgress=false;
                                $scope.items.splice(i,1,obj);
                                $scope.changeClass(i);
                            }else{
                                simpop.alert({content:ret.info});
                            }
                            $scope.$apply();
                            return;
                        }
                    });
                });
            }
        })
    });

    return uploader;
})
