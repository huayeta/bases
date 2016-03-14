import React from 'react';
import {If,Then,Else} from 'react-if';
import {Select} from 'common/forms.jsx';
import Fetch from 'common/Fetch.es6';
import Newtabs from 'common/Newtabs.jsx';

export default class Freight extends React.Component {
    constructor() {
        super();
        this.freight=false;
    }
    componentWillMount(){
        this.config=this.props.config;
    }
    handleFreightChange(event){
        //运费改变的时候
        this.handleFreightAsync(event.target);
    }
    handleFreightAsync(target){
        let _this=this;
        let value=target.value;
        if(!value){
            _this.freight=false;
            _this.forceUpdate();
            return;
        }
        Fetch('?m=freight&c=index&a=get_detail&id='+value,{isJson:true})
            .then((res) => {
                //防止太快更新错误
                if(res.status && res.info && res.info.id==value){
                    _this.freight=res.info;
                    _this.forceUpdate();
                }
            })
    }
    render(){
        //邮费模板
        let freightBox='';
        let freight=this.freight;
        if(freight.type && freight.type==0){
            freightBox=(<div className="m-freight-index f-mt10">
                <div className="hd"><h2>快递</h2></div>
                <p>默认运费：{freight.details[0].start}件内{freight.details[0].postage}元，每增加{freight.details[0].plus}件，加{freight.details[0].postageplus}元</p>
                <div className="dashed f-mtb5"></div>
                {freight.details.map((item,index)=>{
                    if(index==0)return(<p key={index}>指定区域运费</p>);
                    if(index>0){
                        return(
                            <p key={index}>{item.areas} {item.start}件内{item.postage}元，每增加{item.plus}件，加{item.postageplus}元</p>
                        )
                    }
                })}
            </div>);
        }
        if(freight.type && freight.type==1){
            freightBox=(
                <div className="m-freight-index f-mt10">
                    <div className="hd"><h2>卖家承担运费</h2></div>
                    <p>免运费</p>
                    <div className="dashed f-mtb5"></div>
                </div>
            )
        }
        if(freight.type && freight.type==2){
            freightBox=(
                <div className="m-freight-index f-mt10">
                    <div className="hd"><h2>客户自提</h2></div>
                    <p>免运费</p>
                    <div className="dashed f-mtb5"></div>
                </div>
            )
        }
        return(
            <div className="m-product-block f-mb10">
                <div className="title">物流设置</div>
                <div className="con">
                    <table>
                        <thead><tr><th width="88"></th><th></th></tr></thead>
                        <tbody>
                            <tr>
                                <th valign="top" width="80">设置邮费：</th>
                                <td>
                                    <Select className="u-slt f-mr10" name="arg[freightid]" url="?m=freight&c=index&a=index" value={config.freightid} onChange={this.handleFreightChange.bind(this)} asyncFn={this.handleFreightAsync.bind(this)} ref="freightSlt"></Select>
                                    <Newtabs className="s-blue" title="运费模板" url="?m=freight&c=index&a=add">新增运费模板</Newtabs>
                                    <a className="s-green f-ml10" onClick={()=>{this.refs.freightSlt.getData()}}>刷新运费模板</a>
                                    <span className="f-ml10 s-gray">当免运费的时候可以去添加一个免运费模板</span>
                                    {freightBox}
                                </td>
                            </tr>
                            <tr className="f-validForm-show">
                                <th valign="top" width="80">定期发货：</th>
                                <td>
                                    <select className="u-slt f-mr10" name="arg[delivery_time_id]" defaultValue={config.delivery_time_id}>
                                        <option value="">请选择定期模板</option>
                                        {config.delivery_time.map((item,index)=>{
                                            return (
                                                <option value={item.id} key={index}>
                                                    {item.name}
                                                </option>
                                            )
                                        })}
                                    </select>
                                    <Newtabs className="s-blue" title="配送时间" url="?m=member&c=delivery_time&a=add">新增定期模板</Newtabs>
                                </td>
                            </tr>
                            <tr>
                                <th>自动发货：</th>
                                <td><label>
                                    <If condition={config.nodelivery==1}>
                                        <Then>
                                            <input type="checkbox" className="u-checkbox f-mr5" name="arg[nodelivery]" value="1" defaultChecked />
                                        </Then>
                                        <Else>
                                            <input type="checkbox" className="u-checkbox f-mr5" name="arg[nodelivery]" value="1" />
                                        </Else>
                                    </If>
                                </label><span className="s-gray f-ml10"><i className="s-red f-mlr5">*</i>购买后立即发货，不支持退货</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
