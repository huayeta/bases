import objectAssign from 'object-assign';
import events from 'common/events.es6';
import Fetch from 'common/Fetch.es6';

class Wbmc extends events {
    constructor(cfg={}) {
        super();
        this.config=objectAssign({},{root:0},cfg);
    }
    getData(){
        let _this=this;
        if(!this.config.name)return [];
        Fetch('/js/dict/'+_this.config.name+'.js',{isJson:true})
            .then((datas) => {
                _this.datas=datas;
                _this.fire('datas');
                _this.formatData(datas);
                _this.fire('formatDatas');
                //初始化选项
               if(_this.config.pid!=undefined){
                   _this.config.root=_this.findPidObjs[opts.pid][0].id;
               }
               if(_this.config.defId){
                   _this.def=_this.getId(_this.config.defId);
               }
               _this.fire('complete');
            })
        return this;
    }
    formatData(datas){
        let _this=this;
        let findPidObjs={};
        let findIdObj={};
        datas.forEach((data)=>{
            findIdObj[data.id]=data;
            if(!findPidObjs[data.pid])findPidObjs[data.pid]=[];
            findPidObjs[data.pid].push(data);
        });
        _this.findPidObjs=findPidObjs;
        _this.findIdObj=findIdObj;
    }
    getId(id){
        let _this=this;
        let arr=[];
        let pid=_this.findIdObj[id].pid;
        let tmp=pid;
        if(!id)return '';
        arr.push(id);
        if(!pid)return arr;
        while(tmp!=_this.config.root){
            arr.push(tmp);
            tmp=_this.findIdObj[tmp].pid;
        }
        return arr.reverse();
    }
    init(){
        this.getData();
    }
}

module.exports=Wbmc;
