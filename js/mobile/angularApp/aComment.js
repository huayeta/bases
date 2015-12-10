define('aComment',function(require, exports, module){
    var zepto=require('zepto');
    var simpop=require('simpop');
    var mBox=require('mBox');
    var mTools=require('mTools');
    var angular=require('angular');
    var aForm=require('aForm');
    var aBox=require('aBox');
    var aTools=require('aTools');
    require('ngTouch');
    var aComment=angular.module('aComment',['ngTouch','aForm','aBox','aTools']);
    aComment.factory('aCommentFactory',function(){
        var obj={};
        obj.m='article';
        obj.c='comment';
        obj.a='index';
        obj.id='';
        obj.formid='articleid';
        return obj;
    });
    aComment.controller('aCommentController',function($scope,$timeout,aForm,aCommentFactory,getLoginInfo){
        $scope.comment={};
        $scope.comment.items=[];//评论列表
        var commentNum=0;//添加的评论的个数
        $scope.comment.isLoading=true;//评论列表正在加载中
        $scope.comment.reply=false;//是否出现回复或者添加评论窗口

        var MC='?m='+aCommentFactory.m+'&c='+aCommentFactory.c;
        var MCA='?m='+aCommentFactory.m+'&c='+aCommentFactory.c+'&a='+aCommentFactory.a;
		if(!aCommentFactory.listUrl)aCommentFactory.listUrl=MCA+'&id='+aCommentFactory.id;
		if(!aCommentFactory.addUrl)aCommentFactory.addUrl=MC+'&a=add';
		if(!aCommentFactory.delUrl)aCommentFactory.delUrl=MC+'&a=del';

        $scope.comment.form={}
        $scope.comment.form[aCommentFactory.formid]=aCommentFactory.id;

        var pageSize=10;
        //点击列表显示函数
        var clickPage=new mBox.clickPage({target:'.j-clickpageCommenttarget',curPage:0,url:aCommentFactory.listUrl,pageSize:pageSize});
        clickPage.successBefore=function(){
            clickPage.target.text('正在加载中');
            $scope.comment.isLoading=true;
        };
        clickPage.complete=function(){
            clickPage.target.text('已经全部加载完');
            clickPage.isComplete=true;
            clickPage.target.hide();
        }
        clickPage.success=function(ret){
            clickPage.target.text('展开更多评论');
            $scope.comment.isLoading=false;
            if(ret.status){
                var items=[];
                if(ret.info && angular.isArray(ret.info) && ret.info.length>0){
                    items=ret.info;
                }else if(ret.info && ret.info.infos && angular.isArray(ret.info.infos) && ret.info.infos.length>0){
                    items=ret.info.infos;
                }
                if(items.length==0 || items.length<clickPage.pageSize){
                    clickPage.complete();
                }
                if(items.length>commentNum){
                    //初始化commentNum
                    items.splice(0,commentNum);
                    commentNum=0;
                    $scope.comment.items=$scope.comment.items.concat(items);
                }else{
                    commentNum=commentNum-items.length;
                }
            }else{
                simpop.tips({content:ret.info});
            }
            $scope.$apply();
        };
        //切换按钮添加或者回复评论
        mTools.showBtn({
            target:'.j-showBtnComment',
            isDelect:function(obj){
                var _this=$(obj);
                if(getLoginInfo().status && getLoginInfo().info.account==_this.attr('data-comment-mid')){
                    return true;
                }
            },
            delect:function(obj){
                var _this=$(obj);
                var id;
                if(_this.attr('data-comment-childrenid')){
                    id=_this.attr('data-comment-childrenid');
                }else{
                    id=_this.attr('data-comment-id')
                }
                 aForm.request({url:commentMC+'&a=del&id='+id}).success(function(ret){
                    if(ret.status){
                        simpop.tips({content:ret.info,callback:function(){
                            $scope.comment.items=[];
                            clickPage.init();
                        }});
                    }else{
                        simpop.tips({content:ret.info});
                    }
                 });
            },
            buttons:[
                {
                   text:'回复',
                    callback:function(obj){
                        var _this=$(obj);
                        var children=_this.attr('data-comment-children');
                        $scope.comment.reply=true;
                        if(_this.attr('data-comment-childrenid')){
                            $scope.comment.addReply(_this.attr('data-comment-id'),children);
                        }else{
                            $scope.comment.addReply(_this.attr('data-comment-id'));
                        }
                        $scope.$apply();
                    }
                }
            ]
        });
        //切换评论和回复
        $scope.comment.addReply=function(commentid,children){
            $scope.comment.reply=true;
            if(!commentid){
                delete $scope.comment.form.commentid;
                $scope.comment.form[aCommentFactory.formid]=aCommentFactory.id;
                $scope.comment.form.content='';
            }else{
                delete $scope.comment.form[aCommentFactory.formid];
                $scope.comment.form.commentid=commentid;
                children?$scope.comment.form.content='回复 '+children+'：':$scope.comment.form.content='';
            }
        }
        //添加评论
        $scope.comment.add=function($event){
            if(!getLoginInfo().status)mBox.getLogin();
            aForm.form({
                url:aCommentFactory.addUrl,
                event:$event,
                data:$scope.comment.form,
                success:function(ret){
                    if(ret.status){
                        $scope.comment.reply=false;
                        $scope.comment.form.content='';
                        $scope.comment.items=[];
                        clickPage.init();
                    }else{
                        simpop.tips({content:ret.info});
                    }
                }
            });
        }
    });
    return aComment;
});
