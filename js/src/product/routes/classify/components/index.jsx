import React from 'react';
import 'babel-polyfill';
import classifycss from './classify.css';
import Wbmc from 'common/Wbmc.es6';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updataClassify} from '../../../actions/';

class ClassifyApp extends React.Component {
    constructor() {
        super();
        this.datas1=[];
        this.datas2=[];
        this.datas3=[];
        this.classifyId='';
        this.config=window.config;
    }
    componentDidMount(){
        let _this=this;
        new Wbmc({name:'product_category',defId:_this.config.categoryid}).on('complete',function(){
            _this.wbmc=this;
            _this.datas1=_this.wbmc.findPidObjs[0];

            if(this.config.defId){
                if(this.def[0]){
                    _this.datas1Sel=0;
                    let index1=_this.datas1.findIndex((data)=>data.id==this.def[0]);
                    if(index1!=-1)_this.datas1Sel=index1;
                    _this.handleClick(_this.datas1Sel,1);
                }
                if(this.def[1]){
                    let index=_this.datas2.findIndex((data)=>data.id==this.def[1]);
                    if(index!=-1)_this.handleClick(index,2);
                }
                if(this.def[2]){
                    let index=_this.datas3.findIndex((data)=>data.id==this.def[2]);
                    if(index!=-1)_this.handleClick(index,3);
                }
            }else{
                _this.datas1Sel=0;
                _this.handleClick(_this.datas1Sel,1);
            }
            _this.forceUpdate();
        }).init();
    }
    updataDatas(type){
        var _this=this;
        switch (type) {
            case 2:
                _this.datas2Sel=0;
                if(_this.datas1.length>0){
                    var id1=_this.datas1[_this.datas1Sel].id;
                    var datas2=_this.wbmc.findPidObjs[id1];
                    if(!datas2)datas2=[];
                    _this.datas2=datas2;
                }else{
                    _this.datas2=[];
                }
                break;
            case 3:
                _this.datas3Sel=0;
                if(_this.datas2.length>0){
                    var id2=_this.datas2[_this.datas2Sel].id;
                    var datas3=_this.wbmc.findPidObjs[id2];
                    if(!datas3)datas3=[];
                    _this.datas3=datas3;
                }else{
                    _this.datas3=[];
                }
                break;
            default:

        }
    }
    handleClick(index,type){
        let _this=this;
        switch (type) {
            case 1:
                _this.datas1Sel=index;
                _this.updataDatas(2);
                _this.updataDatas(3);
                break;
            case 2:
                _this.datas2Sel=index;
                _this.updataDatas(3);
                break;
            case 3:
                _this.datas3Sel=index;
                break;
            default:
        }
        _this.forceUpdate();
    }
    handleLeave(){
        var _this=this;
        const {updataClassify} =this.props.actions;
        updataClassify({
            0:_this.datas1[_this.datas1Sel],
            1:_this.datas2[_this.datas2Sel],
            2:_this.datas3[_this.datas3Sel]
        })
    }
    render(){
        let route=`/add`;
        if(this.config.route){
            route=`/${this.config.route}`;
        }
        return (
            <div>
                <div className="m-product-classify">
                    <div className="item">
                        <ul>
                            {this.datas1.map((data,index)=>{
                                return (
                                    <li key={index} onClick={this.handleClick.bind(this,index,1)} className={this.datas1Sel==index?'sel':''} id={data.id}>
                                        <i>></i>
                                        {data.name}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="item">
                        <ul>
                            {this.datas2.map((data,index)=>{
                                return (
                                    <li key={index} onClick={this.handleClick.bind(this,index,2)} className={this.datas2Sel==index?'sel':''} id={data.id}>
                                        <i>></i>
                                        {data.name}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="item">
                        <ul>
                            {this.datas3.map((data,index)=>{
                                return (
                                    <li key={index} onClick={this.handleClick.bind(this,index,3)} className={this.datas3Sel==index?'sel':''} id={data.id}>
                                        <i>></i>
                                        {data.name}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <div className="f-tac f-mt20">
                    <Link to={route} className="u-btn u-btn-biger" onClick={this.handleLeave.bind(this)}>下一步，填写详细信息</Link>
                </div>
            </div>
        )
    }
}

ClassifyApp.contextTypes={
    router: React.PropTypes.object
}

module.exports=connect((state)=>{
    return {
        classify:state.classify,
        config:state.config
    };
},(dispatch)=>{
    return {
        actions:bindActionCreators({updataClassify},dispatch),
    }
})(ClassifyApp);
