import { combineReducers,createStore } from 'redux';
import * as reducers from './reducers';

//管理多个state
let reducer=combineReducers(reducers);

let store=createStore(reducer);

store.subscribe(()=>{
    console.log(store.getState());//Object {reducers1: 1, reducers2: 0}
});

store.dispatch({type:'increment'});
store.dispatch({type:'desrement'});

class hua {
    constructor(x=1) {
        this.add=x;
    }
    set add(value){
        this._add='add:'+value;
    }
    get add(){
        // console.log(this.add);
        return this._add;
    }
}

var hh=new hua(2);
console.log(hh);
console.log(hh.add);
