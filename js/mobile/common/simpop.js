define('simpop',function(require, exports, module){
	require('zepto');
	var simpop=require('/js/mobile/plugins/simpop/simpop');

	var tips=function(a){
		var defaults={
			width:'',
			content:'',
			time:1000,
			callback:function(){}
		}
		var opts=$.extend(defaults,a);
		simpop({
			width:opts.width,
			content:opts.content,
			time:opts.time
		}).show();
		setTimeout(function(){
			opts.callback();
		},opts.time)

	}

	var alert=function(a){
		var defaults={
			title:'提示消息',
			mask:true,
			maskclose:true,
			close:true,
			width:'',
			content:'',
			okVal:'确定',
			cancelVal:'取消',
            autoClose:true,
            style:'',
			onShow:function(){},
			callback:function(){},
            cancelFn:function(){}
		}
		var opts=$.extend(defaults,a);
		simpop({
			title:opts.title,
            width:opts.width,
            mask:opts.mask,
            maskclose:opts.maskclose,
            close:opts.close,
			content:($.isFunction(opts.content)?opts.content():opts.content),
            style:opts.style,
            autoClose:opts.autoClose,
			ok:{
				value:opts.okVal,
				callback:function(){
					opts.callback(this);
				}
			},
			cancel:{
				value:opts.cancelVal,
				callback:function(){
					opts.cancelFn(this);
				}
			}
		}).show(function(){
			var self=this;
			//self这个弹窗引用可用调用close()销毁,this.pop这个弹窗的dom
			opts.onShow(self)
		});
	}

	var showLoading=function(content){
		simpop({
            id: 'load',
            mask: false,
            content:content?content:'加载中.....'
        }).showLoading();
	}

	var closeLoading=function(){
		simpop.list['load'] && simpop.list['load'].close();
	}

    var close=function(){
        var list=simpop.list;
        for(id in list){
            simpop.list[id].close();
        }
    }

    var getSimpop=function(){return simpop;}
//	alert({content:'1',autoClose:false,callback:function(pop){}});
	module.exports={
        getSimpop:getSimpop,
		tips:tips,
		alert:alert,
        showLoading:showLoading,
        closeLoading:closeLoading,
        close:close
	}
});
