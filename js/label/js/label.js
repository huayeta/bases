// JavaScript Document
define(function(require, exports, module){
	require('jquery');
	var dialog=require('fnDialog');
    var validForm=require('validForm');
    var tools=require('tools');
	var params=tools.parseUrl(location.href).params;
	var TAG=params['tag'];
	var ISMOBILE=params['ismobile'];
	
    //切换表单主要内容显示隐藏
	var jMain=function(){
		var type=$('.j-main').val();
        if(type=='type3')jType('#type3');
        if(type=='type10')jType('#type10');
        if(type=='type11')jType('#type11');
        if(type=='type12')jType('#type12');
		$('.type').hide();
		$('.'+type).show();
		dialog.reset();	
	}
	//添加幻灯
    tools.addtpl(
        {
            contain:'.type3',
            addcallback:function(){dialog.reset();},
            delcallback:function(){dialog.reset();}
        }
    );
    
	//jType
    var jType=function(obj){
        var type=$(obj);
        var code=$('[name=code]',type);
		var tpl_json=code.val();
		var tpl_id="";
        tools.slt({contain:obj});
		tools.get({
			target:'[data-get-'+obj.substring(1)+']',
			callback:function(id,block){
			 	var _this=$(block);
				tpl_id=id;
				var url=_this.attr('data-json');
				validForm.request({
					url:url,
					async:false,
					success:function(ret){
						if(ret.status){
							for(var i in ret.info){
								if(ret.info[i].id==tpl_id){
									tpl_json=ret.info[i];
								}
							}
						}
						var blo=$('[data-block]',type);
						$.each(blo,function(i,n){
							var _n=$(n);
							val=_n.data('block');
							if(n.nodeName=='INPUT'){_n.val(tpl_json[val])}
							if(n.nodeName=='SPAN'){_n.text(tpl_json[val])}
							if(n.nodeName=='IMG'){_n.attr('src',tpl_json[val])}
						})
						dialog.reset();
					}
				});
			}
		});
		var mbobj=$('[name="arg[mb]"]',type);
		var mtobj=$('[name="arg[mt]"]',type);
		var wobj=$('[name="arg[width]"]',type);
		var hobj=$('[name="arg[height]"]',type);
		var wpic=$('[name="arg[picwidth]"]',type);
		var hpic=$('[name="arg[picheight]"]',type);
		var use=function(){
			$('.use',type).click(function(){
				var tpl;
				if($.type(tpl_json)=='object'){tpl=tpl_json.html}else{tpl=tpl_json};
				tpl=$('<div>'+tpl+'</div>');
				var mb=parseInt(mbobj.val());
				var mt=parseInt(mtobj.val());
				var width=parseInt(wobj.val());
				var height=parseInt(hobj.val());
				var picwidth=parseInt(wpic.val());
				var picheight=parseInt(hpic.val());
				var loop=tpl.find('[data-loop]').not('[data-loop=img]');
				var loopimg=tpl.find('[data-loop=img]');
				if(mb>=0)loop.css('margin-bottom',mb+'px');
				if(mt>=0)loop.css('margin-top',mt+'px');
				if(width>=0)loop.css('width',width+'px');
				if(height>=0)loop.css('height',height+'px');
				if(picwidth>=0)loopimg.css('width',picwidth+'px');
				if(picheight>=0)loopimg.css('height',picheight+'px');
				var tpl=tpl.html();
				var REGX_HTML_ENCODE =/&\w+;|&#(\d+);/g;
				var HTML_DECODE = {
					"&lt;" : "<", 
					"&gt;" : ">", 
					"&amp;" : "&", 
					"&nbsp;": " ", 
					"&quot;": "\"",
					"&copy;": ""
				};
				tpl=tpl.replace(REGX_HTML_ENCODE,function($0, $1){
					  var c = HTML_DECODE[$0];
					  if(c == undefined){
						  if(!isNaN($1)){
							  c = String.fromCharCode(($1 == 160) ? 32:$1);
						  }else{
							  c = $0;
						  }
					  }
					  return c;
				  });
				code.val(tpl);
			});
		}
		use();
        if(obj=='#type10'){
            tools.slt({
                target:'[data-slt2]',
                contain:obj,
                change:function(slt,ret){
                    var info=ret.info;
                    var module=$(slt).find('option:selected').attr('data-module');
                    var tag;
                    $.each(jstag2block,function(i,n){
                        if(n==module)return tag=i+1;
                    });
                    var url="?m=site&c=editor&a=select_category_block&type="+tag;
					var json_url="?m=site&c=editor&a=block&type="+tag;
					var jBlock=$('.j-block',obj);
					jBlock.attr('data-get-type10',url);
					jBlock.attr('data-json',json_url);
//                    use();
                }
            })
        }
    }
	//提交表单
	var jSubmit=function(obj,type){
		var _this=$(obj);
		var code=_this.find('[name=code]');
		var tpl='';
		switch (type){
			case 0:
				tpl=code.val();
				break;
			case 1:
				var path=$('[name="arg[path]"]',_this).val();
                var url=$('[name="arg[url]"]',_this).val();
				var description=$('[name="arg[description]"]',_this).val();
				var backgroundColor=$('[name="arg[backgroundColor]"]',_this).val();
                var target=$('[name="arg[target]"]',_this).val();
				var widthObj=$('[name="arg[width]"]',_this);
                var width=widthObj.val();
				var widthTpl='width="'+width+'"';
				var heightObj=$('[name="arg[height]"]',_this);
                var height=heightObj.val();
				var heightTpl='height="'+height+'"';
				if(!width){widthObj.removeAttr('name');widthTpl=''}
				if(!height){heightObj.removeAttr('name');heightTpl=''}
				tpl='<a href="'+url+'" target="'+target+'" title="'+description+'" style="'+(backgroundColor?('background-color:'+backgroundColor):'')+'"><img src="'+path+'" '+widthTpl+' '+heightTpl+' alt="'+description+'"></a>';
				break;
			case 2:
                var path=$('[name="arg[path]"]',_this).val();
                var width=$('[name="arg[width]"]',_this).val();
                var height=$('[name="arg[height]"]',_this).val();
				tpl='<object type="application/x-shockwave-flash" data="'+path+'" width="'+width+'" height="'+height+'" wmode="transparent"><param name="movie" value="'+path+'"><param name="wmode" value="transparent"></object>';
				break;
		}
		//#type0 #type3 直接放行
        if(tpl=='' && obj!='#type0' && obj!='#type3')return false;
		//判断#type3
		if(obj=='#type3'){
			var val=$('[name="arg[blockname]"]',_this).val();
			if(!val){dialog.alert({content:'请先选择多图样式，再提交！'});return false;}
			
		}
        tpl=encodeURIComponent(tpl);
        code.val(tpl);
		return true;
	}
	
    //初始表单的内容
    jMain();
    $('.j-main').change(function(){
        jMain();
    });
    //提交函数
    var jForm=function(a){
        var defaults={
            target:'',
            url:'?m=site&c=editor&a=add&tag='+TAG+'&ismobile='+ISMOBILE,
            before:'',
            success:function(ret){
                if(ret.status){
					if(ISMOBILE){
						dialog.tips({content:ret.info,callback:function(){
							dialog.dialog.close(true).remove();
						}});
					}else{
						dialog.dialog.close(true).remove();
					}
                }else{
                    dialog.tips({content:ret.info,time:2500});
                }
            }
        }
        var opts=$.extend(defaults,a);
        validForm.form({
            target:opts.target,
            url:opts.url,
            before:opts.before,
            success:opts.success
        });
    }
    
    //表单提交
    jForm({
        target:'#type0',
		before:function(){return jSubmit('#type0',0);}
    });
    jForm({
        target:'#type1',
        before:function(){return jSubmit('#type1',1);}
    });
    jForm({
        target:'#type2',
        before:function(){return jSubmit('#type2',2);}
    });
    jForm({
        target:'#type3',
		before:function(){return jSubmit('#type3',0);}
    });
    jForm({
        target:'#type10',
		before:function(){return jSubmit('#type10',0);}
    });
    jForm({
        target:'#type11',
		before:function(){return jSubmit('#type11',0);}
    });
    jForm({
        target:'#type12',
		before:function(){return jSubmit('#type12',0);}
    });

	module.exports={
		jSubmit:jSubmit	
	}
});