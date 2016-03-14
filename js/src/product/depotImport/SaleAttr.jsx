import React from 'react';
import Sale from './Sale.jsx';

export default class SaleAttr extends React.Component {
    constructor() {
        super();
    }
    render(){
        let {sales,salesLable=[]}=this.props;
        if(salesLable) salesLable=eval(salesLable);
        return(
            <div>
                {salesLable.map((tmpArr,index)=>{
                    return(
                        <div key={index}>
                            <input type="hidden" name={'arg[sales_label]['+index+'][id]'} value={tmpArr.id} />
                            <input type="hidden" name={'arg[sales_label]['+index+'][name]'} value={tmpArr.name} />
                            {Object.keys(tmpArr.children).map((item,key)=>{
                                return(
                                    <input type="hidden" key={key} name={'arg[sales_label]['+index+'][children]['+item+']'} value={tmpArr.children[item]} />
                                )
                            })}
                        </div>
                    )
                })}
                <div className="m-product-block f-mb10 f-mt10">
                    <div className="title">销售属性</div>
                    <div className="con">
                        <div className="list">
                            <table className="f-mt10">
                                <thead>
                                    <tr>
                                        <th width="70">
                                            编号
                                        </th>
                                        <th>
                                            规格
                                        </th>
                                        <th className="tac" width="50">价格</th>
                                        <th className="tac" width="50">成本</th>
                                        <th className="tac" width="50">编辑</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map((sale,index)=>{
                                        return(
                                            <Sale key={index} sale={sale} salesLable={salesLable} />
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
SaleAttr.propTypes={
    sales:React.PropTypes.array.isRequired,
    salesLable:React.PropTypes.string
}
