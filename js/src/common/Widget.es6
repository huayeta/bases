import $ from 'jquery';

export default class Widget{
    constructor() {
        this.boundingBox=null;
        this._events={};
    }
    on(event, fn){
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fn);
        return this;
	}
	off(event, fn){
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fn), 1);
        return this;
	}
	fire(event /* , args... */){
		if( event in this._events === false  )	return;
		for(var i = 0; i < this._events[event].length; i++){
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
		}
        return this;
	}
    render(container){
        this.renderUI();
        this.bindUI();
        $(container || document.body).append(this.boundingBox);
        this.syncUI();
    }
    destroy(){
        this.boundingBox.off();
        this.boundingBox.remove();
        this.destructor();
    }
    //渲染html，初始化this.boundingBox
    renderUI(){}
    //绑定事件
    bindUI(){}
    //渲染跟绑定完之后的回调
    syncUI(){}
    //销毁后的回调
    destructor(){}
}
