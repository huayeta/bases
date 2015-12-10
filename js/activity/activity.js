// JavaScript Document

define('activity',function(require, exports, module){
	
	require('jquery');
    var validForm=require('validForm');
    var tools=require('tools');
    var box=require('box');
    var template=require('template');
    var dialog=require('fnDialog');
    
    var MC='?m=activity&c=index';
    var activityid=tools.getCurParams('id');
        
    var pagesize=12;
    template.config('openTag', '<<');
    template.config('closeTag', '>>');
    
    function clickpage(a){  
        if(!a)return;
        var opts=a || {};
        var $clickpageBox=$(opts.box);
        if(opts.init)$clickpageBox.html('');
        var clickpage=new box.clickPage({target:opts.target,curPage:0,url:opts.url});
        clickpage.successBefore=function(){clickpage.target.text('正在加载中...');}
        clickpage.complate=function(){
            var $target=clickpage.target;
            clickpage.isComplate=true;
            $target.text('全部加载完');
            $target.hide();
        }
        clickpage.success=function(ret){
            var $target=clickpage.target;
            $target.text('点击加载');
            if(ret.status){
                if(ret.info && $.isArray(ret.info.infos)){
                    if(ret.info.infos.length==0){
                        clickpage.complate();
                    }else{
                        var data={list:[]};
                        data.list=ret.info.infos;
                        var compile = template(opts.tpl, data);
                        $clickpageBox.append(compile);
                        if(ret.info.infos.length<pagesize){
                            clickpage.complate();
                        }
                    }
                }else{
                    clickpage.complate();
                }
            }
        }
    }
    
    
    var init=function(a){
        var a=a||{};
        var defaults={
            callback:function(){}
        }
        var opts=$.extend(defaults,a);
        validForm.request({
            url:window.location.href,
            isJson:true,
            success:function(ret){
                if(ret.status){
//                    bindFn(ret.info);
                    var INFO=ret.info;
                    
                    //报名人列表
                    if($('#j-clickpageAccepttpl').size()>0){
                        clickpage({target:'.j-clickpageAccept',box:'.j-clickpageAcceptbox',tpl:'j-clickpageAccepttpl',url:MC+'&a=accept&pagesize='+pagesize+'&id='+activityid});
                    }
                    //取消报名
//                    tools.ajax({
//                        target:'.j-acceptdel',
//                        url:'?m=activity&c=accept&a=del&id='+activityid
//                    });
                    //支付报名费
                    box.goMember({
                        target:'.j-applyPay',
                        title:'活动付费',
                        url:'?m=activity&c=accept&a=pay&acceptid='+ret.info.acceptid
                    });
                    //获取邀请码
                    function getCode(){
                        dialog.alert({
                            icon:false,
                            title:'填写邀请码',
                            content:'填写邀请码：<input type="text" class="u-txt" />',
                            callback:function(content,dia){
                                var $content=$(content);
                                validForm.request({
                                    url:(INFO.isanonymous=='1')?'?m=activity&c=index&a=beforeapply&id='+activityid:'?m=activity&c=accept&a=beforeapply&id='+activityid,
                                    type:'POST',
                                    data:{'invitecode':$content.find('input').val()},
                                    success:function(re){
                                        if(re.status){
                                            getForm();
                                            dia.close().remove();
                                        }else{
                                            dialog.tips({content:re.info});
                                        }
                                    }
                                });
                            }
                        });
                    }
                    //获取表单
                    function getForm(){
                        dialog.alert({
                            icon:false,
                            title:'提交报名',
                            content:function(){
                                var arr=INFO.applyinfo;
                                // console.log(arr);
                                var tpl='';
                                var names=box.getLoginNames();
                                for(var i=0;i<arr.length;i++){
                                    var val='';
                                    if(arr[i].name=='姓名')val=names.name;
                                    if(arr[i].name=='电话' || arr[i].name=='手机')val=names.mobile;
                                    switch (arr[i].type){
                                        case 'input':
                                            tpl+='<tr><th width="85">'+arr[i].name+'：</th><td><input type="text" class="u-txt title" size="40" name="info['+arr[i].name+']" value="'+val+'" datatype="*"></td></tr>';
                                            break;
                                        case 'select':
                                            var selectArr=arr[i].value.split(',');
                                            var tmp='';
                                            for(var j in selectArr){
                                                tmp+='<option value="'+selectArr[j]+'">'+selectArr[j]+'</option>';
                                            }
                                            tpl+='<tr><th width="85">'+arr[i].name+'：</th><td><select class="u-slt" name="info['+arr[i].name+']">'+tmp+'</select></td></tr>';
                                            break;
                                        case 'radio':
                                            var radioArr=arr[i].value.split(',');
                                            var tmp='';
                                            for(var j in radioArr){
                                                tmp+='<label class="f-mr10"><input type="radio" class="f-mr5 u-radio" name="info['+arr[i].name+']" value="'+radioArr[j]+'" />'+radioArr[j]+'</label>'
                                            }
                                            tpl+='<tr><th width="85">'+arr[i].name+'：</th><td>'+tmp+'</td></tr>';
                                            break;
                                        case 'checkbox':
                                            var checkboxArr=arr[i].value.split(',');
                                            var tmp='';
                                            for(var j in checkboxArr){
                                                tmp+='<label class="f-mr10"><input type="checkbox" class="f-mr5 u-checkbox" name="info['+arr[i].name+']" value="'+checkboxArr[j]+'" />'+checkboxArr[j]+'</label>'
                                            }
                                            tpl+='<tr><th width="85">'+arr[i].name+'：</th><td>'+tmp+'</td></tr>';
                                            break;
                                        case 'textarea':
                                            tpl+='<tr><th width="85">'+arr[i].name+'：</th><td><textarea class="u-txtarea" style="width:285px; height:50px;" datatype="*" name="info['+arr[i].name+']"></textarea></td></tr>';
                                            break;
                                        case 'uploadimage':
                                            tpl+='<tr><th width="85">'+arr[i].name+'：</th><td><input type="text" class="u-txt title" size="40" name="info['+arr[i].name+']" value="'+val+'" datatype="*" data-upload-val><a class="u-btn u-btn-big f-ml10" data-upload>上传图片</a></td></tr>';
                                            break;
                                        case 'uploadfile':
                                            tpl+='<tr><th width="85">'+arr[i].name+'：</th><td><input type="text" class="u-txt title" size="40" name="info['+arr[i].name+']" value="'+val+'" datatype="*" data-upload-val><a class="u-btn u-btn-big f-ml10" data-upload="file">上传附件</a></td></tr>';
                                            break;
                                    }
                                }
                                tpl='<style>.u-msg{ display:none;}</style><div class="m-tabform f-m15" style="width:600px;"><form><table><tbody>'+tpl+'</tbody></table></form></div>';
                                return tpl;
                            },
                            onshow:function(content,dia){
                                var $content=$(content);
                                tools.upload({contain:'tr'});
                                validForm.form({
                                    target:$content.find('form'),
                                    url:(INFO.isanonymous==1)?'?m=activity&c=index&a=anonymousapply&id='+activityid:'?m=activity&c=accept&a=apply&id='+activityid,
                                    success:function(re){
                                        if(re.status){
                                            if(re.url){
                                                dialog.alert({
                                                    content:re.info,
                                                    button:[
                                                        // {value:'取消'},
                                                        {
                                                            value:'去付款',
                                                            autofocus:true,
                                                            callback:function(){
                                                                box.gotoMember({title:'活动付款',url:re.url});
                                                            }
                                                        }
                                                    ]
                                                });
                                            }else{
                                                dialog.tips({
                                                    content:re.info,
                                                    callback:function(c,d){
                                                        window.location.reload();
                                                    }
                                                });
                                            }
                                        }else{
                                            dialog.tips({content:re.info});
                                        }
                                    }
                                });
                            },
                            callback:function(content,dia){
                                $(content).find('form').submit();
                            }
                        });
                    }
                    var $applyBtn=$('.j-applyBtn');
                    $applyBtn.click(function(){
                        if(INFO.isanonymous=='0'){
                            //不允许匿名报名
                            if(!box.isLogin()){
                                box.getLogin({pid:opts.pid,callback:function(){window.location.reload();}});
                                return;
                            }
                        }
                        if(INFO.isinvitecode=='1'){
                            //如果需要邀请码的话
                            getCode();
                            return;
                        }
                        getForm();
                    });
                    
                    function  isEnd(){
                        return !(parseInt(INFO.isopen) && Math.floor(new Date().getTime()/1000)<INFO.applyendtime && ((parseInt(INFO.applynum)>0 && parseInt(INFO.apply_num)<INFO.applynum) || INFO.applynum==0));
                    }
                    //判断当前用户状态
                    if(!isEnd() && INFO.apply_status==0){
                        $applyBtn.show();
                    }
                    if(!isEnd() && INFO.apply_status==1){
                        $('.j-applyPay').show();
                    }
                    if(!isEnd() && INFO.apply_status==2){
                        $('.j-applyCheck').show();
                    }
                    if(!isEnd() && INFO.apply_status==3){
                        $('.j-applyComplate').show();
                    }
                    //点赞人列表
                    if($('#j-clickpagepraisetpl').size()>0){
                        clickpage({target:'.j-clickpagepraise',box:'.j-clickpagepraisebox',tpl:'j-clickpagepraisetpl',url:MC+'&a=praise&pagesize='+pagesize+'&id='+activityid});
                    }
                    //点赞按钮
                    tools.ajax({
                        target:'.j-praise',
                        isLogin:true,
                        url:'?m=activity&c=accept&a=praise&id='+activityid,
                        success:function(ret,obj){
                            var $target=$(obj);
                            if(ret.status){
                                 clickpage({target:'.j-clickpagepraise',init:true,box:'.j-clickpagepraisebox',tpl:'j-clickpagepraisetpl',url:MC+'&a=praise&pagesize='+pagesize+'&id='+activityid});
                                var $num=$('[data-bind=praise_num]');
                                if(ret.info.indexOf('点赞成功')!=-1){
                                    $num.text(parseInt($num.text())+1);
                                    $target.removeClass('corzine_cancel');
                                }else{
                                    $num.text(parseInt($num.text())-1);
                                    $target.addClass('corzine_cancel');
                                }
                            }else{
                                dialog.tips({content:ret.info});
                            }
                        }
                    });
                    
                    opts.callback(ret.info);
                }
            }
        });
    }
	
	module.exports={
		init:init//初始化活动js
	}
});