import React from 'react';
import upload from 'common/Upload.es6';

export  default class Upload extends React.Component {
    constructor() {
        super();
    }
    handleUpload(){
        let _this=this;
        let {success}=this.props;
        let uploadTen=new upload().on('success',function(datas){
            console.log(datas);
            if(success)success(datas);
        }).upload({type:_this.props.type});
    }
    render(){
        return(
            <a {...this.props} onClick={this.handleUpload.bind(this)}>{this.props.children}</a>
        )
    }
}

Upload.propTypes={
    type:React.PropTypes.oneOf(['image','file']).isRequired,
    success:React.PropTypes.func,
}
