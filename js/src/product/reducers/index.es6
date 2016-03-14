import {combineReducers} from 'redux';
import {UPDATA_CLASSIFY,UPDATA_CONFIG} from '../actions/';
import objectAssign from 'object-assign';

export const classifyReducer=(state={},action)=>{
    switch (action.type) {
        case UPDATA_CLASSIFY:
            return action.classify;
            break;
        default:
            return state;
    }
}
window.config=window.config || {};
export const configReducer=(state=window.config,action)=>{
    switch (action.type) {
        case UPDATA_CONFIG:
            let {name,value}=action;
            return objectAssign({},state,{[name]:value});
            break;
        default:
            return state;
    }
}

const objectReducers={
    classify:classifyReducer,
    config:configReducer
}

export const productApp=combineReducers(objectReducers);
