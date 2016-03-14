import React from 'react';

export default class ProductAttr extends React.Component {
    constructor() {
        super();
    }
    render(){
        let value={};
        if(this.props.value)value=JSON.parse(this.props.value);
        return(
            <div className="m-product-block f-mb10 f-mt10">
                <div className="title">商品属性</div>
                <div className="con">
                    <table>
                        <thead><tr><th width="88"></th><td></td></tr></thead>
                        <tbody>
                            {Object.keys(value).map((item,index)=>{
                                return(
                                    <tr key={index}>
                                        <th>
                                            <input type="hidden" name={'arg[value]['+item+']'} value={value[item]} />
                                            {item}：
                                        </th>
                                        <td>
                                            {value[item]}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
ProductAttr.propTypes={
    value:React.PropTypes.string.isRequired
}
