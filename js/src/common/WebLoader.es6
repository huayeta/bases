import {dialogGet} from 'common/artDialog';
import events from 'common/events';

export default class WebLoader extends events {
    constructor(obj={}) {
        super();
        this.config={
            type:'image',
            size:1
        };
        Object.assign(this.config,obj);
        let _this=this;
        switch (this.config.type) {
            case "image":
                this.config.url='?m=attachment&c=images&a=dialog';
                break;
            case "file":
                this.config.url='?m=attachment&c=attachment&a=dialog';
                break;
            default :
                this.config.url='?m=attachment&c=images&a=dialog';
                break;
        }
        if(this.config.isadmin==1)this.config.url+='&isadmin=1';
        this.dialog=dialogGet({
            url:_this.config.url,
            data:{
                'size': _this.config.size,
                'isadmin': _this.config.isadmin,
                'isProduct': _this.config.isProduct,
                'isPhoto': _this.config.isPhoto
            }
        }).addEventListener('close',function(){
            _this.fire('success',this.returnValue);
        });
    }
    upload(obj={}){
        Object.assign(this.config,obj);
        this.dialog.showModal();
        return this;
    }
}
