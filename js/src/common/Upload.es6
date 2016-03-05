import {dialogGet} from './artDialog.es6';
import events from './events.es6';
import objectAssign from 'object-assign';

export default class Upload extends events {
    constructor(obj={}) {
        super();
        this.config=objectAssign({
            size:1,
        },obj);
    }
    getImage(obj={}){
        let _this=this;
        objectAssign(_this.config,obj);
        let _url='?m=attachment&c=images&a=dialog';
        if(_this.config.isadmin==1){
            _url+='&isadmin=1';
        }
        dialogGet({
            url:_url,
            data:{
                'size':_this.config.size,
                'url': _this.config.url,
                'before': _this.config.before,
                'isadmin': _this.config.isadmin,
                'isProduct': _this.config.isProduct,
            },
            onclose:function(){
                _this.fire('close');
                if(this.returnValue){
                    _this.fire('success',this.returnValue);
                }
            }
        }).showModal();
        return _this;
    }
}
