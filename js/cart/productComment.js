define('productComment',function(require, exports, module){
	require('jquery');
	var dialog=require('fnDialog');
    var template=require('template');
    var validForm=require('validForm');
    var pages=require('pages');
    var tools=require('tools');
    
    template.config('openTag', '<<');
    template.config('closeTag', '>>');
    
    var init=function(a){
        var a=a||{};
        var defaults={
            productId:''
        }
        var opts=$.extend({},defaults,a);
        var $productComment=$('.j-productComment');
        var $commentTpl;//总tpl
        var commentBox;//评论box
        var $commentLine=$('.j-productCommentLine');
        var $target=$('.j-productCommentTarget');
        if(!opts.productId)return;//当没有商品Id的时候推出
        function getComment(type){
            pages.init({pageBox:'.j-productCommentPageBox',url:'?m=product&c=index&a=comment&id='+opts.productId+'&type='+type,callback:function(cfg,items){
                parseComment(items);
                if($commentLine.size()>0){
                    var offset=$commentLine.offset();
                    $('html,body').animate({scrollTop:offset.top},'slow');
                }
            }});
        }
        function parseComment(items){
//            console.log(items);
            if(!items || items.length==0){
                $productComment.html('<div class="f-mt15">暂时没有商品评价</div>');
                return;
            }
            if(!$commentTpl){
                validForm.request({
                    url:'/js/cart/productComment.tpl',
                    dataType:'html',
                    success:function(ret){
                        if(ret){
                            $commentTpl=$(ret);
                            commentBox=$commentTpl.find('#productComment').html();
                            $productComment.html(template.compile(commentBox)({items:items}));
                            tools.fancyBox();
                        }
                    }
                });
            }else{
                $productComment.html(template.compile(commentBox)({items:items}));
                tools.fancyBox();
            }
        }
        $target.change(function(){
            var val=$target.filter(':checked').val();
            getComment(val);
        })
        getComment(-1);
    };
	
	module.exports={
		init:init
	}
})