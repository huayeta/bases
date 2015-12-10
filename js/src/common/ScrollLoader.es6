import $ from 'jquery';
import Widget from 'common/Widget';
import events from 'common/events';

//滚动加载
export default class ScrollLoader extends events {
    constructor(obj={}) {
        super();
        this.config={
            target:window,
            curPage:0,
            url:window.location.href.replace(new RegExp(window.location.hash,'g'),''),//兼容有哈希值的把哈希值去掉
            delay:100,//延迟时间
            marginBottom:100//滚动条距离底部的距离
        };
        Object.assign(this.config,obj);
    }
    //格式化数据
    formateData(ret){
        let data=Object.assign({},ret);
        if(ret.status && ret.info && ret.info.infos && Array.isArray(ret.info.infos) && ret.info.infos.length>0){
            data.data=ret.info.infos;
            if(ret.info.infos.length<ret.info.pages.pagesize){
                data.isComplete=true;
            }else{
                data.isComplete=false;
            }
        }else {
            data.isComplete=true;
        }
        return data;
    }
    //请求数据
    request(){
        let _this=this;
        _this.isLoading=true;
        _this.curPage++;
        _this.url=_this.config.url+'&page='+_this.curPage;
        _this.fire('successBefore');//请求之前函数
        require.ensure([],function(require){
            let {ajax}=require('common/util');
            ajax({
                url:_this.url,
                isJson:true
            }).success((ret)=>{
                _this.isLoading=false;
                let returnValue=_this.formateData(ret);
                _this.isComplete=returnValue.isComplete;
                if(_this.isComplete){
                    _this.target.off('.scrollEvent');
                }
                _this.fire('success',returnValue);
            });
        });
        return _this;
    }
    //判断高度
    isLoadFn(){
        let _this=this;
        let offsetHeight,scrollHeight,scrollTop;
        if(_this.isComplete){
            _this.destroy();
            return false;
        }
        if(_this.config.target!=window){
            let target=_this.target[0];
            offsetHeight=target.offsetHeight;
            scrollHeight=target.scrollHeight;
            scrollTop=target.scrollTop;
        }else{
            offsetHeight=_this.target.height();
            scrollHeight=$(document).height();
            scrollTop=_this.target.scrollTop();
        }
        if(offsetHeight+scrollTop>=scrollHeight-parseInt(_this.config.marginBottom)){
            return true;
        }
        return false;
    }
    //滚动判断
    scrollFn(){
        let _this=this;
        if(_this.isLoadFn()){
            if(_this.isLoading)return;
            setTimeout(function(){_this.isLoading=false;},_this.config.delay);//重复触发间隔毫秒
            _this.request();
        }
        // _this.fire('scroll')//触发滚动函数
        return _this;
    }
    //初始化
    init(obj={}){
        let _this=this;
        Object.assign(this.config,obj);

        this.target=$(this.config.target);
        this.isLoading=false;//是否在滚动
        this.isComplete=false;//是否已经全部加载完
        this.curPage=this.config.curPage;//当前页码

        this.target.off('.scrollEvent');//防止重复定义滚动
        this.target.on('scroll.scrollEvent',_this.scrollFn.bind(_this));
        if(this.curPage==0)_this.request();
        return this;
    }
    //销毁
    destroy(){
        this.target.off('.scrollEvent');
    }
}
