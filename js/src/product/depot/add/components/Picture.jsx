import React from 'react';
import Upload from 'common/Upload.jsx';
import {dialog,dialogTip} from 'common/artDialog.es6';
import {Textarea} from 'common/forms.jsx';
import {If,Then,Else} from 'react-if';

export default class Picture extends React.Component {
    constructor() {
        super();
        this.picture=[];
    }
    componentWillMount(){
        this.picture=[...this.props.picture];
        let length=this.picture.length;
        if(length!=5){
            this.picture.length=5;
            this.picture.fill('',length,5);
        }
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
    render(){
        return(
            <div className="m-product-block f-mb10">
                <div className="title">商品图片</div>
                <div className="con">
                    <ul className="f-cb product-imgs" style={{'text-align':'center'}}>
                        {this.picture.map((picture,index)=>{
                            return(
                                <li key={index} style={{'float':'none','display':'inline-block','margin':'9px 17px 0',}}>
                                    <input type="hidden" name={'arg[picture]['+index+']'} value={picture} />
                                    <div className="pic"><a className="clear" onClick={this.handleUploadDel.bind(this,index)}>×</a><a href={picture?'/'+picture:"/member/images/common/m-shop-add-pic.gif"} target="_blank"><img src={picture?'/'+picture:"/member/images/common/m-shop-add-pic.gif"}/></a></div>
                                    <h2>
                                        <Upload type="image" className="u-btn-gray1" success={this.handleUpload.bind(this,index)}>上传图片</Upload>
                                    </h2>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

Picture.propTypes={
    picture:React.PropTypes.array,
    video:React.PropTypes.string,
}
