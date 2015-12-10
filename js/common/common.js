define('common', function (require, exports, module) {
    require('jquery');
    var MicroEvent=require('MicroEvent');
    var Widget=require('Widget');

    var ContextMenu=function(obj){
        var obj=obj || {};
        this.config={
            event:'',
            buttons:[]
        }
        $.extend(this.config,obj);
    }
    ContextMenu.prototype=$.extend({},new Widget(),{
        renderUI:function(){
            this.boundingBox=$('<div><style type="text/css" id="contextMenu">.u-contextmenu{ border: 1px solid #c8ccd5; box-shadow: 0px 1px 3px rgba(0,0,0,0.2); position: absolute; background: #fff;overflow:hidden;width:160px;}.u-contextmenu li{ line-height: 32px;}.u-contextmenu li a{cursor: pointer; position:relative; display:block; height:20px; overflow:hidden; padding:5px 0; color:#3a404a; border-top:1px solid #fff; border-bottom:1px solid #fff;}.u-contextmenu li a i{ position:absolute; top:10px; left:5px; opacity:.7;}.u-contextmenu li a span{ display:block; padding:0 12px 0 32px; line-height:20px; overflow:hidden;white-space:nowrap;word-wrap:normal;text-overflow:ellipsis;}.u-contextmenu li.split{ height:1px; line-height:1px;font-size:1px; margin:1px 0; overflow:hidden;}.u-contextmenu li.split .line{ padding-left:27px; height:1px; line-height:1px; font-size:1px; overflow:hidden;}.u-contextmenu li.split .line div{height:1px; line-height:1px;font-size:1px;overflow:hidden; background-color:#eeeff4;}.u-contextmenu li a:hover{text-decoration:none;background: #f3f8ff;border-top: 1px #d5e5f5 solid;border-bottom: 1px #d5e5f5 solid;}.u-contextmenu li a:hover i{opacity:1;}</style><div class="u-contextmenu j-contextmenu"><ul></ul></div></div>');
            var li='';
            for (var i = 0, n = this.config.buttons.length; i < n; i++) {
                var button=this.config.buttons[i];
                li += '<li data-index="'+i+'"><a href="javascript:void(0);"><i class="'+(button.icon?button.icon:"")+'"></i><span>' + button.text + '</span></a></li>';
                if(button.split){
                    li+='<li class="split"><div class="line"><div></div></div></li>';
                }
            }
            this.boundingBox.find('ul').append(li);
        },
        bindUI:function(){
            var _this=this;
            this.boundingBox.on('mousedown','li',function(event){
                var $this=$(this);
                var index=$this.data('index');
                _this.config.buttons[index].callback.call(_this);
                _this.trigger('close');
                _this.destroy();
                event.stopPropagation();
            });
            this.close=function(){
                _this.destroy();
            }
            $(document).on('mousedown',this.close);
        },
        syncUI:function(){
            var event=this.config.event;
            var $contextmenu=this.boundingBox.find('.j-contextmenu');
            var clientX = event.clientX;
            var clientY = event.clientY;
            var $window=$(window);
            var clientHeight=$window.height();
            var clientWidth=$window.width();
            var scrollHeight=$(document).height();
            var scrollTop=$window.scrollTop();
            var scrollLeft=$window.scrollLeft();
            var offsetHeight=$contextmenu.outerHeight();
            var offsetWidth=$contextmenu.outerWidth();
            var styles={};
            if(clientY+offsetHeight>clientHeight){
                styles.bottom='1px';
            }else{
                styles.top=scrollTop+clientY+'px';
            }
            if(clientX+offsetWidth>clientWidth){
                styles.right='1px';
            }else{
                styles.left=scrollLeft+clientX+'px';
            }
            $contextmenu.css(styles);
            this.trigger('show');
        },
        destructor:function(){
            this.boundingBox.off();
            $(document).off('mousedown',this.close);
            this.boundingBox.remove();
        },
        show:function(obj){
            var obj=obj || {};
            $.extend(this.config,obj);
            if(!event)return this;
            this.render();
            return this;
        }
    })

    var WebLoader=function(obj){
        var obj=obj || {};
        this.config={
            type:'image',
            size:1
        };
        $.extend(this.config,obj);
    }
    WebLoader.prototype={
        upload:function(obj){
            var obj=obj || {};
            var _this=this;
            $.extend(this.config,obj);
            switch (this.config.type) {
                case "image":
                    this.config.url='?m=attachment&c=images&a=dialog';
                    break;
                case "file":
                    this.config.url='?m=attachment&c=attachment&a=dialog';
                    break;
            }
            if(this.config.isadmin==1)this.config.url+='&isadmin=1';
            require.async(['fnDialog'],function(dialog){
                dialog.get({
                    url:_this.config.url,
                    data:{
                        'size': _this.config.size,
                        'isadmin': _this.config.isadmin,
                        'isProduct': _this.config.isProduct,
                        'isPhoto': _this.config.isPhoto
                    },
                    callback:function(ret){
                        _this.trigger('success',ret);
                    }
                })
            })
            return _this;
        }
    };
    MicroEvent.mixin(WebLoader);

    var ScrollLoader=function(obj){
        var obj=obj || {};
        this.config={
            target:window,
            curPage:0,
            url:window.location.href.replace(new RegExp(window.location.hash,'g'),''),//兼容有哈希值的把哈希值去掉
            delay:1000,//延迟时间
            marginBottom:100//滚动条距离底部的距离
        };
        $.extend(this.config,obj);
    }
    ScrollLoader.prototype={
        request:function(){
            var _this=this;
            _this.curPage++;
            _this.url=_this.config.url+'&page='+_this.curPage;
            _this.trigger('successBefore');//请求之前函数
            require.async(['validForm'],function(validForm){
                validForm.request({
                    url:_this.url,
                    isJson:true,
                    success:function(ret){
                        _this.trigger('success',ret);
                        if(_this.isComplete){
                            _this.target.off('.scrollEvent');
                        }
                    }
                });
            });
            return _this;
        },
        bindScroll:function(event){
            var _this=this;
            var offsetHeight,scrollHeight,target=event.target;
            if(_this.config.target!=window){
                offsetHeight=target.offsetHeight;
                scrollHeight=target.scrollHeight;
                scrollTop=target.scrollTop;
            }else{
                offsetHeight=_this.target.height();
                scrollHeight=$(document).height();
                scrollTop=_this.target.scrollTop();
            }
            if(offsetHeight+scrollTop>=scrollHeight-parseInt(_this.config.marginBottom)){
                if(_this.isComplete){
                    _this.target.off('.scrollEvent');
                    return;
                }
                if(_this.isLoading)return;
                _this.isLoading=true;
                setTimeout(function(){_this.isLoading=false;},_this.config.delay);//重复触发间隔毫秒
                _this.request();
            }
            _this.trigger('scroll')//触发滚动函数
            return _this;
        },
        init:function(obj){
            var obj=obj || {};
            var _this=this;
            $.extend(this.config,obj);

            this.target=$(this.config.target);
            this.isLoading=false;//是否在滚动
            this.isComplete=false;//是否已经全部加载完
            this.curPage=this.config.curPage;//当前页码

            this.target.off('.scrollEvent');//防止重复定义滚动
            this.target.on('scroll.scrollEvent',_this.bindScroll.bind(_this));
            if(this.curPage==0)_this.request();
            return this;
        }
    }
    MicroEvent.mixin(ScrollLoader);

    var ClickLoader=function(obj){
        var obj=obj || {};
        this.config={
            curPage:0,
            url:window.location.href.replace(new RegExp('#'+$location.path(),'g'),'')//兼容有哈希值的把哈希值去掉
        }
        $.extend(this.config,obj);
    }
    ClickLoader.prototype={
        request:function(){
            var _this=this;
            _this.curPage++;
            _this.url=_this.config.url+'&page='+_this.curPage;
            _this.isLoading=true;
            _this.trigger('successBefore');//请求之前函数
            require.async(['validForm'],function(validForm){
                validForm.request({
                    url:_this.url,
                    isJson:true,
                    success:function(ret){
                        _this.isLoading=false;
                        _this.trigger('success',ret);
                    }
                });
            });
            return this;
        },
        init:function(obj){
            var obj=obj || {};
            var _this=this;
            $.extend(this.config,obj);

            this.isLoading=false;//是否正在加载
            this.isComplete=false;//是否已经全部加载完
            this.curPage=this.config.curPage;//当前页码

            if(this.curPage==0)this.request();
            return this;
        }
    }
    MicroEvent.mixin(ClickLoader);

    return {
        ContextMenu:ContextMenu,//右击类
        WebLoader:WebLoader,//上传类
        ScrollLoader:ScrollLoader,//滚动加载类
        ClickLoader:ClickLoader//点击加载类
    };

});
