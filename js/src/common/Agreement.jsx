import React from 'react';
import Fetch from 'common/Fetch.es6';

export default class Agreement extends React.Component {
    constructor() {
        super();
        this.title='';
    }
    componentDidMount(){
        let {name} = this.props;
        let _this=this;
        Fetch('?m=member&a=agreement&name='+name,{
            isJson:true
        })
            .then((res) => {
                if(res.status){
                    _this.title=res.info.title;
                    _this.forceUpdate();
                }
            })
    }
    render(){
        return(
            <span {...this.props}>{this.title}</span>
        )
    }
}

Agreement.propTypes={
    name:React.PropTypes.string.isRequired
}
