import {createStore,applyMiddleware} from 'redux';
import {productApp} from '../reducers';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

const middleware=process.env.NODE_ENV === 'production'?[thunkMiddleware]:[thunkMiddleware,logger()];

let store=createStore(
    productApp,
    applyMiddleware(...middleware)
);

export {store};
