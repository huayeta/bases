import React from 'react';
import 'babel-polyfill';
import {render} from 'react-dom';
import {Router,hashHistory,RouterContext} from 'react-router';
import {Provider} from 'react-redux';
import {store} from './store';

const rootRoute={
    component:'div',
    childRoutes:[{
        path:'/',
        component:require('./components/App'),
        childRoutes:[
            require('./depot/add/'),
            require('./routes/classify/')
        ]
    }],
}

render(
    <Provider store={store}>
        <Router children={rootRoute} history={hashHistory} />
    </Provider>,
    document.getElementById('app')
)
