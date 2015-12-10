import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router,Route,Link,IndexRedirect } from 'react-router';

class App extends Component {
    constructor() {
        super();
    }
    render(){
        return (
            <div>
                <div className="m-photo-group f-cb f-mb10">
                    <span className="btn-group f-fr f-mlr10">
                        <Link activeClassName="select" to='/timeline'>时间</Link>
                        <Link activeClassName="select" to='/group'>分组</Link>
                        <Link activeClassName="select" to='/allphoto'>全部</Link>
                    </span>
                </div>
                {this.props.children}
            </div>
        )
    }
}

// 加载组件到 DOM 元素 photoIndex
render(
    <Router>
        <Route path='/' component={App}>
            <IndexRedirect form="/" to="timeline"></IndexRedirect>
            <Route path='timeline' getComponent={(location, callback)=>{
                    require.ensure([],function(){
                        callback(null,require('./components/Timeline.jsx').Timeline);
                    })
                }}></Route>
            <Route path='group' getComponent={(location, callback)=>{
                    require.ensure([],function(){
                        callback(null,require('./components/Groupphoto.jsx').Groupphoto);
                    })
                }}></Route>
            <Route path='group/:id' getComponent={(location,callback)=>{
                    require.ensure([],function(){
                        callback(null,require('./components/GroupphotoDetail.jsx').GroupphotoDetail);
                    })
                }}></Route>
            <Route path='allphoto' getComponent={(location, callback)=>{
                    require.ensure([],function(){
                        callback(null,require('./components/Allphoto.jsx').Allphoto);
                    })
                }}></Route>
        </Route>
    </Router>
    , document.getElementById('photoIndex'));
