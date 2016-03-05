import React from 'react';
import Fetch from 'common/Fetch.es6';

export default class SaleAttr extends React.Component {
    constructor() {
        super();
    }
    componentDidMount(){
        let _this=this;
        const {classifyId} = this.props;
        Fetch('?m=product&c=product&a=sales_attribute&id='+classifyId,{isJson:true})
            .then((res) => {
                console.log(res);
            })
    }
    render(){
        return(
            <div>

            </div>
        )
    }
}

SaleAttr.propTypes={
    classifyId:React.PropTypes.string.isRequired,
}
