import React from 'react';
import Fetch from 'common/Fetch.es6';
import Sale from './Sale.jsx';

export default class SaleAttr extends React.Component {
    constructor() {
        super();
        this.datas=[];
        this.sales=[];//选择的属性
        this.sales_label=[];//选择的属性数组
        this.spicArr=[];//结合的属性
        this.labelArrs=[];//点选属性
    }
    componentWillMount(){
        this.sales=[...this.props.sales];
        this.sales_label=[...this.props.sales_label];
        // console.log(this.sales);
        // console.log(this.sales_label);
    }
    componentDidMount(){
        let _this=this;
        let {classifyId} = this.props;
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
        let _this=this;
        this.datas.forEach((data)=>{
            data.children.forEach((children)=>{
                //pid的转换
                children.pid={name:data.name,id:data.id};
                _this.sales_label.forEach((sale)=>{
                    if(sale.children[children.id])children.isSel=true;
                })
            })
        })
        this.groupSel();
    }
    groupSel(){
        const _this=this;
        let arrs=[];
        let labelArrs=[];
        this.datas.forEach((data,index)=>{
            //点选属性的解析
            let tmp={id:data.id,name:data.name,children:[]};
            data.children.forEach((children)=>{
                if(children.isSel){
                    tmp.children.push(children);
                }
            })
            if(tmp.children.length!=0)labelArrs.push(tmp);
            //属性组合的解析
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
                arrs.forEach((arr,index)=>{
                    data.children.forEach((children)=>{
                        if(children.isSel){
                            tmpArrs.push([...arr,children]);
                        }
                    })
                })
                if(tmpArrs.length!=0)arrs=tmpArrs;
            }
        })
        this.spicArr=arrs;
        this.labelArrs=labelArrs;
        // console.log(this.spicArr);
        // console.log(labelArrs);
    }
    handleChange(index,pindex){
        let children=this.datas[pindex].children[index];
        //切换选择
        children.isSel=!children.isSel;
        //更新分组
        this.groupSel();
        this.forceUpdate();
    }
    render(){
        let spicArr=this.spicArr;
        let labelArrs=this.labelArrs;
        return(
            <div>
                {labelArrs.map((tmpArr,index)=>{
                    return(
                        <div key={index}>
                            <input type="hidden" name={'arg[sales_label]['+index+'][id]'} value={tmpArr.id} />
                            <input type="hidden" name={'arg[sales_label]['+index+'][name]'} value={tmpArr.name} />
                            {tmpArr.children.map((label,key)=>{
                                return(
                                    <input type="hidden" key={key} name={'arg[sales_label]['+index+'][children]['+label.id+']'} value={label.name} />
                                )
                            })}
                        </div>
                    )
                })}
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
                                <th className="tac" width="50">条形码</th>
                                <th className="tac" width="80">单位<span className="s-red f-ml5">*</span></th>
                                <th className="tac" width="50">规格<span className="s-red f-ml5">*</span></th>
                                <th className="tac" width="50">编辑</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spicArr.map((arr,index)=>{
                                let idArr=[];
                                let defaultValue={};
                                arr.forEach((tmp)=>{
                                    idArr.push(tmp.id);
                                })
                                this.sales.forEach((sale)=>{
                                    if(sale.sales==idArr.join('|'))defaultValue=sale;
                                })
                                // console.log(arr);
                                return(
                                    <Sale sale={arr} key={index} val={defaultValue} />
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
    classifyId:React.PropTypes.number.isRequired,
    sales:React.PropTypes.array.isRequired,
    sales_label:React.PropTypes.array.isRequired,
}
