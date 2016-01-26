import React from 'react';
import { render } from 'react-dom';
import { Router,Route,Link,IndexRedirect } from 'react-router';

class App extends React.Component {
    constructor() {
        super();
    }
    render(){
        return (
            <div>
                {this.props.children || '正在加载中...'}
            </div>
        )
    }
}

render(
    <Router>
        <Route path='/' component={App}>
            <IndexRedirect form="/" to="index"></IndexRedirect>
            <Route path='index' getComponent={(location, callback)=>{
                    require.ensure([],function(){
                        callback(null,require('./components/index.jsx').Index);
                    })
                }}></Route>
        </Route>
    </Router>
    ,document.getElementById('render')
)
