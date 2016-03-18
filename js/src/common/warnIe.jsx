import React from 'react';
import {If,Then,Else} from 'react-if';

export default class WarnIe extends React.Component {
    constructor() {
        super();
    }
    componentWillMount(){
        this.isUpdata=this.getVersion()<10?true:false;
    }
    getVersion(){
        var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
		while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]
		);
		return v > 4 ? v : false ;
    }
    render(){
        return(
            <If condition={this.isUpdata}>
                <Then>
                    您的浏览器版本过低，请升级您的浏览器
                </Then>
            </If>
        )
    }
}
