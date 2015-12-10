define('mProductComment',function(require, exports, module){
	var Zepto=require('zepto');
	var simpop=require('simpop');
    var template=require('template');
    var mBox=require('mBox');
    var mTools=require('mTools');
    
    template.config('openTag', '<<');
    template.config('closeTag', '>>');
    
    var init=function(a){
        var a=a||{};
        var defaults={
            productId:''
        }
        var opts=$.extend({},defaults,a);
        var $productComment=$('.j-productCommentCon');
        var $commentTpl;//总tpl
        var commentBox;//评论box
        
        var _scrollPage=mBox.scrollPage({target:$('.j-productComment')[0],curPage:0,url:'?m=product&c=index&a=comment&id='+opts.productId+'&type=-1'});
        _scrollPage.success=function(ret){
        	if(!ret.status){
        		_scrollPage.isComplete=true;
        		return simpop.tips({content:ret.info});
        	}
        	if(ret.info.pages.totalnumber==0){
        		_scrollPage.isComplete=true;
        		return $productComment.html('现在还没有商品评论~');
        	}
        	if(!ret.info.infos){
        		_scrollPage.isComplete=true;
        		return;
        	}
        	if(_scrollPage.curPage==1)$productComment.html('');
        	if(ret.info.infos && ret.info.infos.length<ret.info.pages.pagesize)_scrollPage.isComplete=true;
        	if(!$commentTpl){
                mBox.request({
                    url:'/js/mobile/cart/mProductComment.tpl',
                    dataType:'html',
                    success:function(re){
                        if(re){
                            $commentTpl=$(re);
                            commentBox=$commentTpl.find('#productComment').html();
                            $productComment.append(template.compile(commentBox)({items:ret.info.infos}));
                        }
                    }
                });
            }else{
                $productComment.append(template.compile(commentBox)({items:items}));
            }
        }
    };
	
	module.exports={
		init:init
	}
})