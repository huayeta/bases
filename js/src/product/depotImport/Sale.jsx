import React from 'react';
import {DialogGet} from 'common/Dialog.jsx';
import objectAssign from 'object-assign';
import {Textarea,Input} from 'common/forms.jsx';

export default class Sale extends React.Component {
    constructor() {
        super();
    }
    componentWillMount(){
        this.sale=this.props.sale;
        this.salesLable=this.props.salesLable;
        this.sale.picture=this.sale.pictures;
        this.sale.sales=this.sale.sales.split('|');//选择的属性
        this.salesArr=[];
        this.sale.sales.forEach((sale,index)=>{
            this.salesArr.push({id:sale,name:this.salesLable[index].children[sale]})
        })
    }
    handleSpicEditor(returnValue){
        let _this=this;
        if(returnValue){
            // console.log(this.val);
            // console.log(returnValue);
            objectAssign(_this.sale,returnValue);
            // console.log(this.val);
            this.forceUpdate();
        }
    }
    render(){
        let {sale,salesLable,salesArr}=this;
        let sales=this.sale.sales;
        return(
            <tr>
                <td>
                    {sale.no}
                </td>
                <td>
                    {salesLable.map((label,index)=>{
                        return(
                            <span key={index} className="f-mr10">{label.name}：{label.children[sales[index]]}</span>
                        )
                    })}
                </td>
                <td className="tac"><Input type="text" className="u-txt" style={{'width':'80%'}} name={'arg[sales]['+sale.sales+'][price]'} value={sale.price} /></td>
                <td className="tac"><Input type="text" className="u-txt" style={{'width':'80%'}} name={'arg[sales]['+sale.sales+'][stock]'} value={sale.stock} /></td>
                <td className="tac">
                    <input type="hidden" name={'arg[sales]['+sale.sales+'][no]'} value={sale.no}  />
                    <input type="hidden" name={'arg[sales]['+sale.sales+'][title]'} value={sale.title}  />
                    <input type="hidden" name={'arg[sales]['+sale.sales+'][advertisement]'} value={sale.advertisement}  />
                    <input type="hidden" name={'arg[sales]['+sale.sales+'][picture][]'} value={sale.pictures?sale.pictures[0]:''}  />
                    <input type="hidden" name={'arg[sales]['+sale.sales+'][picture][]'} value={sale.pictures?sale.pictures[1]:''}  />
                    <input type="hidden" name={'arg[sales]['+sale.sales+'][picture][]'} value={sale.pictures?sale.pictures[2]:''}  />
                    <input type="hidden" name={'arg[sales]['+sale.sales+'][picture][]'} value={sale.pictures?sale.pictures[3]:''}  />
                    <input type="hidden" name={'arg[sales]['+sale.sales+'][picture][]'} value={sale.pictures?sale.pictures[4]:''}  />
                    <input type="hidden" name={'arg[sales]['+sale.sales+'][video]'} value={sale.video}  />
                    <Textarea className="f-dn" name={'arg[sales]['+sale.sales+'][content]'} value={sale.content}></Textarea>
                    <Textarea className="f-dn" name={'arg[sales]['+sale.sales+'][content1]'} value={sale.content1}></Textarea>
                    <Textarea className="f-dn" name={'arg[sales]['+sale.sales+'][content2]'} value={sale.content2}></Textarea>
                    <Textarea className="f-dn" name={'arg[sales]['+sale.sales+'][content3]'} value={sale.content3}></Textarea>
                    <DialogGet className="u-btn" url="/js/src/product/routes/editor/index.htm" data={{defaultValue:sale,sale:salesArr,config:{title:sale.title,advertisement:sale.advertisement}}} callback={this.handleSpicEditor.bind(this)}>编辑</DialogGet>
                </td>
            </tr>
        )
    }
}
Sale.propTypes={
    sale:React.PropTypes.object.isRequired,
    salesLable:React.PropTypes.array.isRequired
}
