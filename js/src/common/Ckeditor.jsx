import React from 'react';

export default class Ckeditor extends React.Component {
    constructor() {
        super();
    }
    componentDidMount(){
        if(window.CKEDITOR){
            window.CKEDITOR=null;
            window.CKupdate=null;
            let ckeditor=document.getElementById('ckeditor');
            ckeditor.parentNode.removeChild(ckeditor);
        }
        let ckeditorDom=document.createElement('script');
        ckeditorDom.setAttribute('type','text/javascript');
        ckeditorDom.setAttribute('id','ckeditor');
        ckeditorDom.setAttribute('src','js/plugins/ckeditor/ckeditor.js');
        this.ckeditor=ckeditorDom;
        document.body.appendChild(ckeditorDom);
    }
    componentWillUnmount(){
        if(this.ckeditor){
            this.ckeditor.parentNode.removeChild(this.ckeditor);
            window.CKEDITOR=null;
            window.CKupdate=null;
        }
    }
    render(){
        return(
            <textarea {...this.props} value={this.props.value} className={this.props.className+' ckeditor'}></textarea>
        )
    }
}
