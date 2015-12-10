define(function(require, exports, module){
	require('jquery');
	var wbmc=function(a){
        var a=a||{};
        var defaults={
            name:'',//获取哪个分类的js
            val:'id',
            root:0,//最顶层的id是多少
            pid:'',//最顶层的pid
            oid:[],
            hide:false,//是否隐藏没有选项的select
            contain:document,//再什么环境下找oid
            def:[],//以前遗留的
			defId:'',//填写最后一个默认值
            change:'',
            init:''//初始化数据
        }
        var opts=$.extend(defaults,a);
        var json;//储存原始json数据
        var DATA={};//储存重新排版后的json数据
        if($.isArray(opts.name)){
            json=opts.name;
        }else{
            $.ajax({
                url:'/js/dict/'+opts['name']+'.js',
                async:false,
                dataType:'json',
                success:function(ret){
                    json=ret;
                }
            });
        }
        if (!json || !$.isArray(json)) {return ;};
		var findIdObj={};//id->pid的对应
        var findId={};//id->{}
        $.each(json,function(i,n){
			findIdObj[n.id]=n.pid;
            findId[n.id]=n;
            if(!DATA[n.pid]){
                DATA[n.pid]=[];
                DATA[n.pid].push(n);
            }else{
                DATA[n.pid].push(n);
            }
        });
        if(opts.pid){
            opts.root=DATA[opts.pid][0].id;
        }
//       console.log(DATA);
		if(opts.defId){
            opts.def=getId(opts.defId);
		}
        //函数从真值到id的转换
        function getId(id){
            if(!id)return '';
            var pid=findIdObj[id];
            if(pid!=undefined){
                //不存在解析的默认值
                var arr=[];
                arr.push(id);
                var tmp=pid;
                while(tmp!=opts.root){
                    arr.push(tmp);
                    tmp=findIdObj[tmp];
                }
                return arr.reverse();
            }
            return '';
        }
        //函数从id到name的转换
        function getName(id){
            if(!id)return '';
            var arr=$.isArray(id)?id:id.split(',');
            var result=[];
            for(var i in arr){
                result.push(findId[arr[i]].name);
            }
            return result.join(',');
        }
//         console.log(opts);
        if($.isFunction(opts.init))opts.init({json:json,data:DATA,findIdObj:findIdObj,findId:findId,getName:getName,getId:getId});
        if(!opts.name || !opts.oid.length)return;//如果请求地址或者目录对象为空则返回
        if(!json || ($.isArray(json)&&json.length==0))return;//如果没有json解析数据则返回
        var tpl='<option value="">请选择</option>';
        for(var i=0;i<opts.oid.length;i++){
            var slt=$(opts.oid[i],$(opts.contain));
            slt.change(function(){
                var _this=$(this);
                var next=_this.data('next');
                var pid=_this.find('option:selected').attr('id');
                var tmp=tpl;
                if($.isFunction(opts.change))opts.change(_this[0],DATA[pid]);
                if(DATA[pid]){
                    for(var i=0;i<DATA[pid].length;i++){
                        tmp+='<option id="'+DATA[pid][i]['id']+'" value="'+DATA[pid][i][opts.val]+'">'+DATA[pid][i]['name']+'</option>';
                    }
                }
                $.each(next,function(j,n){
                    var $n=$(n,$(opts.contain));
                    if(j!=0){
                        $n.html(tpl);
                        //是否隐藏
                        if(opts.hide){$n.hide();}else{$n.show();}
                    }else{
                        $n.html(tmp);
                        //是否隐藏
                        if(opts.hide && (!DATA[pid] || (DATA[pid] && DATA[pid].length==0))){
                            $n.hide();
                        }else{
                            $n.show();
                        }
                    }
                })
                next0=$(next[0],$(opts.contain));
                if(next0.data('tx')){
                    next0.data('tx',false);
                    var def=next0.data('def');
                    if(def){
                        next0.val(def);
                        next0.change();
                    }
                }
            });
        }
        function init(){
            $.each(opts.oid,function(j,n){
                var _this=$(n,$(opts.contain));
                var next=$.grep(opts.oid,function(n,i){
                    return i>j;
                });
                _this.data('next',next);
                _this.data('tx',true);
                _this.data('def',opts.def[j]);
            });

            var oid0=$(opts.oid[0],$(opts.contain));
            var tmp=tpl;
            for(var i=0;i<DATA[opts.root].length;i++){
                tmp+='<option id="'+DATA[opts.root][i]['id']+'" value="'+DATA[opts.root][i][opts.val]+'">'+DATA[opts.root][i]['name']+'</option>';
            }
            oid0.html(tmp);
            if(opts.def[0])oid0.val(opts.def[0]);
            if(!oid0.val())oid0.val('');
            oid0.change();
        }
        init();//初始化函数
    }
    return wbmc;
});