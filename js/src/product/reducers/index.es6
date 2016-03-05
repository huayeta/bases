import {combineReducers} from 'redux';
import {UPDATA_CLASSIFY} from '../actions/';

export const classifyReducer=(state={},action)=>{
    switch (action.type) {
        case 'UPDATA_CLASSIFY':
            return action.classify;
            break;
        default:
            return state;
    }
}

const objectReducers={
    classify:classifyReducer,
}

export const productApp=combineReducers(objectReducers);
