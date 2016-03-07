import React from 'react';
import $ from 'jquery';
import md5 from 'md5';

var index=$(window.top.document);
var tabs=index.find(".j-iframeControllor"),iframe=index.find("#iframe");
/*BEGIN TABS*/
function newtabs(name,url,tx){
    var hash=md5(name);
    var ifr=iframe.find('#'+hash);
    if(iframe.find('iframe').size()>9){alert('打开选项卡过多，请关闭部分在试.');return;}
    if(ifr.size()>0){
        iframe.find('iframe').hide();
        tabs.find('li').removeClass('select');
        tabs.find('li[iframeid='+hash+']').addClass('select');
        ifr.attr('src',url).show();
    }else{
        tabs.find('li').removeClass('select');
        tabs.append('<li iframeid="'+hash+'" class="select" data-del="'+(tx?true:false)+'"><a href="javascript:void(0);" hidefocus="">'+name+'</a>'+(tx?'':'<input type="button" class="close_bt" value="×"/>')+'</li>');
        iframe.find('iframe').hide();
        iframe.append('<iframe id="'+hash+'" name="main" width="100%" height="100%" frameborder="0" scrolling="no" src="'+url+'" allowTransparency="true"></iframe>');
    }
};
function closetabs(hash){
    var o=tabs.find("li[iframeid='"+hash+"']"),oifr=iframe.find('#'+hash);
    if(o.data('del')==true)return;
    if(iframe.find('iframe').size()==1){alert('最后一个选项卡不能关闭.');return;}
    iframe.find('iframe').hide();
    tabs.find('li').removeClass('select');
    o.prev().addClass('select');
    if(oifr.prev().size()==1)oifr.prev().show();
    else oifr.next().show();
    oifr.empty().remove();
    o.empty().remove();
    return false;
}
function close_tabs(url){
    var hash=iframe.find("iframe[src='"+url+"']").attr('id');
    if(typeof hash=='undefined'){hash=tabs.find(".select").attr('iframeid')}
    closetabs(hash);
}

export default class Newtabs extends React.Component {
    constructor() {
        super();
    }
    handleClick(){
        let {title,url}=this.props;
        newtabs(title,url);
    }
    render(){
        return(
            <a {...this.props} onClick={this.handleClick.bind(this)}>{this.props.children}</a>
        )
    }
}

Newtabs.propTypes={
    url:React.PropTypes.string.isRequired,
    title:React.PropTypes.string.isRequired,
}
