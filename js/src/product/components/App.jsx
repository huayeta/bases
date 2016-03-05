import React from 'react';
import ClassifyApp from '../routes/classify/components/';

class App extends React.Component {
    constructor() {
        super();
    }
    render(){
        return (
            <div>
                {this.props.children || <ClassifyApp />}
            </div>
        )
    }
}

module.exports=App;
