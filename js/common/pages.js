define('pages',function(require, exports, module){
	require('jquery');
    var validForm=require('validForm');

    function getPages(opts){
        //计算pages
        opts.pages='<div class="pages"><ul><li><a>'+opts.pageSize+'条</a></li>';
        //上一页
        if(opts.pageCur!=1)opts.pages+='<li><a class="j-page" data-page="'+(opts.pageCur-1)+'">上一页</a></li>';
        if(opts.pageCur<=5){
            //当小于5页的时候
            var max=(opts.pageCount>=5?5:opts.pageCount);
            for(var i=1;i<=max;i++){
                if(opts.pageCur==i){
                    opts.pages+='<li class="active"><span>'+i+'</span></li>';
                }else{
                    opts.pages+='<li><a class="j-page" data-page="'+i+'">'+i+'</a></li>';
                }
            }
        }else{
            //大于5页的时候
            opts.pages+='<li><a class="j-page" data-page="1">1</a></li><li><a class="j-page" data-page="2">2</a></li><li><span>...</span></li>';
            opts.pages+='<li><a class="j-page" data-page="'+(opts.pageCur-1)+'">'+(opts.pageCur-1)+'</a></li>';
            opts.pages+='<li class="active"><span>'+opts.pageCur+'</span></li>';
            if((opts.pageCur+1)<opts.pageCount){
               opts.pages+='<li><a class="j-page" data-page="'+(opts.pageCur+1)+'">'+(opts.pageCur+1)+'</a></li>';
               opts.pages+='<li><span>...</span></li>';
            }else if((opts.pageCur+1)==opts.pageCount){
                opts.pages+='<li><a class="j-page" data-page="'+(opts.pageCur+1)+'">'+(opts.pageCur+1)+'</a></li>';
            }
        }
        //下一页
        if(opts.pageCur<opts.pageCount)opts.pages+='<li><a class="j-page" data-page="'+(opts.pageCur+1)+'">下一页</a></li>';
        opts.pages+='</ul></div>';
        if(opts.pageSize==0)opts.pages='';
        $(opts.pageBox).html(opts.pages);
    }

    var init=function(a){
        var a = a || {};
        var defaults = {
            pageBox:'',//填充分页的box
            url:'',//url
            pageCur: 1, //当前页
            pageLimit: 10, //每页多少个
            pageCount:0,//一共多少页
            pageSize:0,//一共多少个
			callback:''//回调函数
        };
        var opts = $.extend(defaults, a);
        if(!opts.url)return;
        var $pageBox=$(opts.pageBox);

        function callback(opts){
            validForm.request({
                url:opts.url+'&page='+opts.pageCur,
                isJson:true,
                success:function(ret){
                    if(!ret.status)return alert(ret.info);
                    opts.pageCur=parseInt(ret.info.pages.page);
                    opts.pageLimit = parseInt(ret.info.pages.pagesize);
                    opts.pageSize=parseInt(ret.info.pages.totalnumber);
                    opts.pageCount = Math.ceil(opts.pageSize / opts.pageLimit);

                    getPages(opts);
					var data;
					if(ret.info.infos)data=ret.info.infos;
					if(!data && ret.info.list)data=ret.info.list;
                    opts.callback && $.isFunction(opts.callback) && opts.callback(opts,data);
                }
            });
        }

        $pageBox.delegate('.j-page', 'click', function(event) {
            var $this=$(this);
            var page=$this.data('page');
            if(!page)return;
            opts.pageCur=page;
            callback(opts);
        });
        callback(opts);
    };

	module.exports={
		init:init
	}
})
