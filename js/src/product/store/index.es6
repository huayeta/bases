import {createStore,applyMiddleware} from 'redux';
import {productApp} from '../reducers';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

let store=createStore(
    productApp,
    applyMiddleware(thunkMiddleware,logger())
);

export {store};
