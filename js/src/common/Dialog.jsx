import React from 'react';
import {dialogGet} from 'common/artDialog.es6';

export class DialogGet extends React.Component {
    constructor() {
        super();
    }
    handleClick(){
        let _this=this;
        let {url,callback,data}=this.props;
        dialogGet({
            url:url,
            data:data,
            onclose:function(){
                //如果有回调函数的时候
                if(callback){
                    callback(this.returnValue);
                }
            }
        }).showModal();
    }
    render(){
        return(
            <a {...this.props} onClick={this.handleClick.bind(this)}>
                {this.props.children}
            </a>
        )
    }
}
DialogGet.propTypes={
    url:React.PropTypes.string.isRequired
}

export class DialogChoose extends React.Component {
    constructor() {
        super();
    }
    handleClick(){
        let _this=this;
        let {url,callback,defaultSel,size}=this.props;
        dialogGet({
            url:'?m=common&c=dialog&a=index',
            data:{
                size:size || 1,
                url:url,
                defaultSel:defaultSel
            },
            onclose:function(){
                //如果有回调函数的时候
                if(callback){
                    callback(this.returnValue);
                }
            }
        }).showModal();
    }
    render(){
        return(
            <a {...this.props} onClick={this.handleClick.bind(this)}>{this.props.children}</a>
        )
    }
}
DialogChoose.propTypes={
    url:React.PropTypes.string.isRequired,
    callback:React.PropTypes.func,
    defaultSel:React.PropTypes.array
}
