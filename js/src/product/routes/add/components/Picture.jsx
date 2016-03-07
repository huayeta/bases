import React from 'react';
import Upload from 'common/Upload.jsx';
import {dialog,dialogTip} from 'common/artDialog.es6';
import {Textarea} from 'common/forms.jsx';
import {If,Then,Else} from 'react-if';

export default class Picture extends React.Component {
    constructor() {
        super();
        this.picture=[];
        this.video='';
    }
    componentWillMount(){
        this.picture=[...this.props.picture];
        this.picture.length=5;
        this.video=this.props.video;
    }
    handleUpload(index,datas){
        //上传的时候的回调
        if(datas && Array.isArray(datas) && datas.length>0){
            this.picture[index]=datas[0].filepath;
            this.forceUpdate();
        }
    }
    handleUploadDel(index){
        //删除上传的图片
        this.picture[index]='';
        this.forceUpdate();
    }
    handleVideo(){
        let _this=this;
        //上传视频
        dialog({
            title:'视频地址',
            content:`<textarea placeholder="复制你视频的html地址" class="u-txtarea" style="width:500px; height:215px;">${this.video}</textarea>`,
            okValue:'确定',
            ok:function(){
                let textareaDom=this.node.querySelectorAll('textarea')[0];
                let value=textareaDom.value;
                if(!value){
                    dialogTip({content:'请先填写视频地址'}).show();
                    return false;
                }
                _this.video=value;
                _this.forceUpdate();
            }
        }).showModal();
    }
    render(){
        return(
            <div className="m-product-block f-mb10">
                <div className="title">商品图片</div>
                <div className="con">
                    <ul className="f-cb product-imgs">
                        {this.picture.map((picture,index)=>{
                            return(
                                <li key={index}>
                                    <input type="hidden" name="arg[picture][0]" value={picture} />
                                    <div className="pic"><a className="clear" onClick={this.handleUploadDel.bind(this,index)}>×</a><a href={picture?picture:"/member/images/common/m-shop-add-pic.gif"} target="_blank"><img src={picture?picture:"/member/images/common/m-shop-add-pic.gif"}/></a></div>
                                    <h2>
                                        <Upload type="image" className="u-btn-gray1" success={this.handleUpload.bind(this,index)}>上传图片</Upload>
                                    </h2>
                                </li>
                            )
                        })}
                        <li>
                            <Textarea className="f-dn" name="arg[video]" value={this.video}></Textarea>
                            <div className="pic"><a className="clear">×</a>
                                <If condition={!!this.video}>
                                    <Then>
                                        <div>
                                            {this.video}
                                        </div>
                                    </Then>
                                    <Else>
                                        <a><img src="/member/images/common/video.jpg" /></a>
                                    </Else>
                                </If>
                            </div>
                            <h2><a className="u-btn-yellow" onClick={this.handleVideo.bind(this)}>上传视频</a><a href="http://www.yingshangkeji.com/?m=article&a=item&id=845636&cid=22093" className="u-icon-help" target="_blank"></a></h2>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

Picture.propTypes={
    picture:React.PropTypes.array.isRequired,
    video:React.PropTypes.string.isRequired,
}
