define('productRecord',function(require, exports, module){
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
        var $productRecord=$('.j-productRecord');
        var $RecordLine=$('.j-productRecordLine');
        if(!opts.productId)return;//当没有商品Id的时候推出
        function getRecord(type){
            pages.init({pageBox:'.j-productRecordPageBox',url:'?m=product&a=records&id='+opts.productId,callback:function(cfg,items){
                parseRecord(items);
                if($RecordLine.size()>0){
                    var offset=$RecordLine.offset();
                    $('html,body').animate({scrollTop:offset.top},'slow');
                }
            }});
        }
        function parseRecord(items){
//            console.log(items);
            if(!items || items.length==0){
                return;
            }
            $productRecord.html(template('productRecord',{items:items}));
            tools.fancyBox();
        }
        getRecord();
    };
	
	module.exports={
		init:init
	}
})