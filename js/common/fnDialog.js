// JavaScript Document

define('fnDialog',function(require, exports, module){
	if (!top.dialog) {
		var dialog=require('dialog');
		require('dialogPlus');
		top.dialog=dialog;
	}

    require('jquery');
    //url框架弹窗
	function getDialog(a){
		var a=a||{};
		var opts = {
			url:a.url || '',
			data:a.data || '',
			callback:a.callback || '',
			onclose:a.onclose || function(){}
		}
		var d=top.dialog({
				fixed: true,
				title:'loading...',
				padding:0,
				url:opts.url,
				data: opts.data,
				onclose:function(){
					opts.onclose();
					if(this.returnValue && typeof opts.callback == 'function'){
						opts.callback(this.returnValue);
					}
				}
			});
		d.showModal();
		return;
	}
    //有内容html弹窗

	//dialog提示消息
	function tipsDialog(a){
		var defaults={
			// title:'提示消息',
			content:'',
			callback:'',
			time:''
		}
		var opts=$.extend(defaults,a);
		var d=top.dialog({
			title:opts.title,
			padding:'20px 50px',
			content:'<i class="u-icon-warning-big f-mr10"></i>'+opts.content
		});
		d.showModal();
		var time=700;
		if(opts.time!='')time=opts.time;
		setTimeout(function () {
			if(typeof opts.callback == 'function'){
				opts.callback();
			}
			d.close(true).remove();
		}, time);
	}

	//dialog弹窗
	function alertDialog(a){
		var defaults={
			content:'',
			width:'',
			icon:'warning',
			title:'提示消息',
			padding:'20px 50px',
			showModal:true,
			onshow:'',
			callback:'',
			button:'',
			cancel:'',
			close:''
		}
		var opts=$.extend(defaults,a);
		var content;
        var icon='<i class="u-icon-'+opts.icon+'-big"></i>';
        if(a.icon==false || a.icon=='false'){
			content=!$.isFunction(opts.content)?opts.content:opts.content();
		}else{
			content='<i class="u-icon-'+opts.icon+'-big f-mr20 f-dib f-vam"></i><div style="display:inline-block;">'+(!$.isFunction(opts.content)?opts.content:opts.content())+'</div>';
		}
        var id=new Date().getTime();
        var contentDom;
		var d=top.dialog({
            id:id,
			title:opts.title,
			width:opts.width,
			content:content,
			cancel:opts.cancel,//返回false时候禁止关闭
            onshow:function(){
                contentDom=$(window.parent.document).find('body [id="content:'+id+'"]')
                if($.isFunction(opts.onshow)){
                    opts.onshow(contentDom[0],this);//参数为内容dom和对话框实例
                };
            },
			padding:opts.padding
		});
		if($.isFunction(opts.close)){
			d.addEventListener('close', function () {
				opts.close(contentDom[0],this.returnValue);
			});
		}
		if(opts.button){
			d.button(opts.button);
		}else{
			d.button([
//				{
//					value:'取消',
//					callback:function(){
//						if($.isFunction(opts.cancel)){
//							opts.cancel(content[0],d);
//						}else{
//							d.close().remove();
//						}
//						return false;
//					}
//				},
				{
					value:'确定',
					callback:function(){
						if($.isFunction(opts.callback)){
							opts.callback(contentDom[0],d);
						}else{
							d.close().remove();
						}
						return false;
					},
					autofocus: true
				}
			]);
		}
		eval(opts.showModal)?d.showModal():d.show();
	}

	//计算dialog的最大高度
	function maxhDialog(h){
		$('.g-yskj').height('auto');
		var maxH=$(window.parent.window).height()*0.75;
		var height;
		if(h){
			height=(parseFloat(h)>maxH)?maxH:parseFloat(h);
		}else{
			var H=$('.j-dialog').outerHeight()+1;
			height=(H>maxH?maxH:H);
		}
		$('.g-yskj').height(height);
		return height;
	}

	//重新等位dialog的高度
	function resetDialog(){
		var dialog = top.dialog.get(window);
		dialog.height(maxhDialog());
	}

	//弹窗的内部js
	function editorDialog(a){
		var a=a||{};
		var opts = {
			title:a.title || document.title || '提示信息',
			width:a.width,
			height:a.height || '',
			callback: a.callback || '',
            button:'' || a.button
		}
		var dialog = top.dialog.get(window);
		dialog.title(opts.title);
		if(opts.width){dialog.width(opts.width);}
		dialog.height(maxhDialog(opts.height));
		dialog.reset();
        if(opts.button){
            dialog.button(opts.button);
        }else{
            dialog.button([{
                value:'确定',
                callback:function(){
                    if(typeof opts.callback == 'function'){
                        opts.callback(dialog);
                    }
                    return false;
                },
                autofocus: true
            }]);
        }
	}

	module.exports={
		dialogObj:top.dialog,
		dialog:top.dialog.get(window),
		get:getDialog,
		tips:tipsDialog,
		alert:alertDialog,
		maxH:maxhDialog,
		reset:resetDialog,
		editor:editorDialog
	}
})
