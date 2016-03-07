import React from 'react';
import Fetch from 'common/Fetch.es6';
import SaleAttrCss from './SaleAttr.css';
import {DialogGet} from 'common/Dialog.jsx';

export default class SaleAttr extends React.Component {
    constructor() {
        super();
        this.datas=[];
        this.sales={};//选择的属性
        this.spicArr=[];//结合的属性
    }
    componentWillMount(){
        let {sales}=this.props;
        if(sales){
            this.sales=JSON.parse(sales);
        }
    }
    componentDidMount(){
        let _this=this;
        const {classifyId} = this.props;
        Fetch('?m=product&c=product&a=sales_attribute&id='+classifyId,{isJson:true})
            .then((res) => {
                if(res.status && Array.isArray(res.info) && res.info.length>0){
                    _this.datas=res.info;
                    if(_this.datas.length>0){
                        _this.DatasSel();
                        _this.forceUpdate();
                    }
                }
            })
    }
    DatasSel(){
        let salesString=JSON.stringify(this.sales?this.sales:{});
        this.datas.map((data)=>{
            return data.children.map((children)=>{
                let id=children.id;
                let reg=new RegExp('(\{|,)"'+id+'"\:');
                let tx=reg.test(salesString);
                if(tx)children.isSel=true;
                children.pid={id:data.id,name:data.name};
                return children;
            })
        });
        this.groupSel();
    }
    groupSel(){
        const _this=this;
        let arrs=[];
        this.datas.forEach((data)=>{
            if(arrs.length==0){
                data.children.forEach((children)=>{
                    if(children.isSel){
                        let tmpArrs=[];
                        tmpArrs.push(children);
                        arrs.push(tmpArrs);
                    }
                })
            }else{
                let tmpArrs=[];
                arrs.forEach((arr)=>{
                    data.children.forEach((children)=>{
                        if(children.isSel){
                            tmpArrs.push([...arr,children]);
                        }
                    })
                })
                arrs=tmpArrs;
            }
        })
        console.log(arrs);
        this.spicArr=arrs;

    }
    handleChange(index,pindex){
        let children=this.datas[pindex].children[index];
        //切换选择
        children.isSel=!children.isSel;
        //更新分组
        this.groupSel();
        this.forceUpdate();
    }
    handleSpicEditor(returnValue){
        console.log(returnValue);
    }
    render(){
        let spicArr=this.spicArr;
        if(spicArr.length>0){

        }
        return(
            <div>
                <div className="m-product-spic">
                    {this.datas.map((data,index)=>{
                        return(
                            <div key={index}>
                                <div className="tt">
                                    {data.name}：
                                </div>
                                <div className="bd">
                                    {data.children.map((children,key)=>{
                                        return(
                                            <label key={key}><input type="checkbox" className="u-checkbox f-mr5" checked={!!children.isSel} onChange={this.handleChange.bind(this,key,index)} />{children.name}</label>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {spicArr.length==0?'':<div className="list">
                    <table className="f-mt10">
                        <thead>
                            <tr>
                                {spicArr[0].map((arr,index)=>{
                                    return(
                                        <th className="tac" key={index}>{arr.pid.name}</th>
                                    )
                                })}
                                <th className="tac" width="50">价格</th>
                                <th className="tac" width="50">成本</th>
                                <th className="tac" width="50">库存<span className="s-red f-ml5">*</span></th>
                                <th className="tac" width="50">编辑</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spicArr.map((arr,index)=>{
                                let tmp;
                                let name=[];
                                arr.forEach((tmpArr,index)=>{
                                    name.push('['+tmpArr.id+']');
                                    if(index===0){
                                        tmp=this.sales[tmpArr.id];
                                    }else if(tmp){
                                        tmp=tmp[tmpArr.id];
                                    }
                                });
                                if(!tmp)tmp={};
                                return(
                                    <tr key={index}>
                                        {arr.map((tmparr,key)=>{
                                            return(
                                                <td className="tac" key={key}>{tmparr.name}</td>
                                            )
                                        })}
                                        <td className="tac"><input type="text" className="u-txt j-ipt" style={{'width':'80%'}} name={'arg[sales]'+name.join('')+'[price]'} defaultValue={tmp.price} /></td>
                                        <td className="tac"><input type="text" className="u-txt j-ipt" style={{'width':'80%'}} name={'arg[sales]'+name.join('')+'[cost]'} defaultValue={tmp.cost}  /></td>
                                        <td className="tac"><input type="text" className="u-txt j-ipt" style={{'width':'80%'}} name={'arg[sales]'+name.join('')+'[stock]'} defaultValue={tmp.stock}  /></td>
                                        <td className="tac">
                                            <DialogGet className="u-btn" url="/js/src/product/routes/editor/index.htm" data={arr} callback={this.handleSpicEditor.bind(this)}>编辑</DialogGet>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>}
            </div>
        )
    }
}

SaleAttr.propTypes={
    classifyId:React.PropTypes.string.isRequired,
    sales:React.PropTypes.string.isRequired,
}
