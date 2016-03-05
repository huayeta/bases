import React from 'react';
import deepAssign from 'deep-assign';
import {If,Then,Else} from 'react-if';
import Fetch from 'common/Fetch.es6';

class ProductAttr extends React.Component {
    constructor() {
        super();
        this.datas=[];
        let config=deepAssign({},window.config);
        if(!config.value){
            config.value={}
        }else{
            config.value=JSON.parse(config.value);
        }
        this.config=config;
    }
    componentDidMount(){
        let _this=this;
        let {classifyId}=this.props;
        Fetch('?m=product&c=product&a=attribute&id='+classifyId,{isJson:true})
            .then((res) => {
                if(res.status && res.info){
                    var info=[];
                    if(Array.isArray(res.info)){
                        info=res.info;
                    }else{
                        for(let i in res.info){
                            info.push(res.info[i]);
                        }
                    }
                    if(info.length>0){
                        _this.datas=info;
                        _this.forceUpdate();
                    }
                }
            })
    }
    render(){
        return(
            <div>
                <table>
                    <thead><tr><th width="88"></th><td></td></tr></thead>
                    <tbody>
                        {this.datas.map((data,index)=>{
                            let tmp='';
                            switch (data.type) {
                                case 'input':
                                    tmp=<input type="text" className="u-txt" name={'arg[value]['+data.name+']'} defaultValue={this.config.value[data.name]} />;
                                    break;
                                case 'textarea':
                                    let style={'width':'325px','height':'80px'};
                                    tmp=<textarea className="u-txtarea" style={style} name={'arg[value]['+data.name+']'} defaultValue={this.config.value[data.name]}></textarea>;
                                    break;
                                case 'checkbox':
                                    var valArr=[];
                                    if(data.value)valArr=data.value.split(',');
                                    tmp=<div>{valArr.map((val,index)=>{
                                            let tx=false,VAL=this.config.value[data.name];
                                            if(VAL && Array.isArray(VAL) && VAL.length>0 && VAL.includes(val)){
                                                tx=true;
                                            }
                                        return(
                                            <label className="f-mr10" key={index}>
                                                <If condition={tx}>
                                                    <Then>
                                                        <input type="checkbox" className="u-checkbox f-mr5" value={val} key={val} name={'arg[value]['+val+']'} defaultChecked />
                                                    </Then>
                                                    <Else>
                                                        <input type="checkbox" className="u-checkbox f-mr5" value={val} key={val} name={'arg[value]['+val+']'} />
                                                    </Else>
                                                </If>
                                            {val}</label>
                                        )
                                    })}</div>
                                    break;
                                case 'radio':
                                    var valArr=[];
                                    if(data.value)valArr=data.value.split(',');
                                    tmp=<div>{valArr.map((val,index)=>{
                                        return(
                                            <label className="f-mr10" key={index}>
                                                <If condition={this.config.value[data.name]==val}>
                                                    <Then>
                                                        <input type="radio" className="u-checkbox f-mr5" value={val} key={val} name={'arg[value]['+val+']'} defaultChecked />
                                                    </Then>
                                                    <Else>
                                                        <input type="radio" className="u-checkbox f-mr5" value={val} key={val} name={'arg[value]['+val+']'} />
                                                    </Else>
                                                </If>
                                            {val}</label>
                                        )
                                    })};</div>
                                    break;
                                case 'select':
                                    let valArr=[];
                                    if(data.value)valArr=data.value.split(',');
                                    tmp=<select className="u-slt" name={'arg[value]['+data.name+']'} defaultValue={this.config.value[data.name]}>{valArr.map((val,index)=>{
                                        return(<option key={index} value={val}>
                                            {val}
                                        </option>)
                                    })}</select>;
                                    break;
                                default:

                            }
                            return(
                                <tr key={index}>
                                    <th>
                                        {data.name}：
                                    </th>
                                    <td>
                                        {tmp}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

ProductAttr.propTypes={
    classifyId:React.PropTypes.string.isRequired,
}

module.exports=ProductAttr;
