import $ from 'jquery';

//ajax加载
const ajax=(a)=>{
    let opts={
        isJson:false
    }
    Object.assign(opts,a);
    return $.ajax({
        url:opts.url,
        type:opts.type,
        beforeSend:function(XMLHttpRequest){
            if(opts.isJson){
                XMLHttpRequest.setRequestHeader('Date-Type','json');
            }
        },
        dataType:opts.dataType,
        async:opts.async,
        dataFilter:function(data,type){
            return data;
        },
        data:$.isFunction(opts.data)?opts.data():opts.data
    });
}

//分析url地址
const parseUrl=(url)=>{
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
};

//新窗口
const _blank=(url)=>{
    if(!url)return;
    var objUrl=parseUrl(url);
    var iptTpl='';
    if(objUrl.params){
        for(var i in objUrl.params){
            iptTpl+='<input type="hidden" name="'+i+'" value="'+objUrl.params[i]+'"/>';
        }
    }
    var $blank=$('<form target="_blank" action="'+url+'">'+iptTpl+'</form>');
    $blank.trigger('submit');
}

//初始化select
const sltAjax=(obj={})=>{
    let opts={
        target:'.j-sltAjax',
        contain:document,
        val:'id',
        url:'',
        change:$.noop
    };
    Object.assign(opts,obj);
    $(opts.target,$(opts.contain)).each(function(){
        let $target=$(this);
        let config={
            val:$target.data('val'),
            url:$target.data('url'),
            attrs:$target.data('attrs'),
            def:$target.data('def')
        };
        Object.assign(config,opts);
        if(config.attrs)config.attrs=config.attrs.split(',');
        ajax({
            url:config.url,
            isJson:true
        }).success(function(ret){
            if(!ret.status)return;
            let str='';
            ret.info.infos.forEach(function(info){
                let selected='';
                let attrs='';
                if(info[config.val]==config.def)selected="selected";
                if(config.attrs){
                    config.attrs.forEach((attr)=>{
                        attrs+=` data-${attr}="${info[attr]}"`;
                    });
                }
                str+=`<option value="${info[config.val]}" ${attrs} ${selected}>${info.name}</option>`;
            });
            $target.html(str);
            $target.change=config.change;
        })
    });
}

export {ajax,_blank,parseUrl,sltAjax};
