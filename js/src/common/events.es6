export default class Events {
    constructor() {
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
}
