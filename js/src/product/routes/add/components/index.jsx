import React from 'react';
import {findDOMNode} from 'react-dom';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import ProductAttr from './ProductAttr.jsx';
import SaleAttr from './SaleAttr.jsx';
import Picture from './Picture.jsx';
import Content from './Content.jsx';
import serialize from 'form-serialize';
import {If,Then,Else} from 'react-if';
import {Select} from 'common/forms.jsx';
import {dialogGet,dialogTip} from 'common/artDialog.es6';
import {DialogGet} from 'common/Dialog.jsx';
import Agreement from 'common/Agreement.jsx';
import Fetch from 'common/Fetch.es6';
import Newtabs from 'common/Newtabs.jsx';

class AddProduct extends React.Component {
    constructor() {
        super();
        this.config=window.config;
        this.freight=false;
    }
    componentDidMount(){
        let _this=this;
        // setTimeout(function(){
        //     console.log(serialize(findDOMNode(_this.refs.formName)));
        // },2000)
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
        const {classify} = this.props;
        let config=this.config;
        let classifyId='';
        if(classify['0'])classifyId=classify['0'].id;
        if(classify['1'])classifyId=classify['1'].id;
        if(classify['2'])classifyId=classify['2'].id;
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
            <div>
                <div className="m-tabform f-pdt10 m-tabform-w800">
                    <form action="" ref="formName">
                        <input type="hidden" id="id" name="id" defaultValue={config.id} />
                        <table>
                            <thead><tr><th width="88"></th><td></td></tr></thead>
                            <tbody>
                                <tr>
                                    <th>
                                        商品分类：
                                    </th>
                                    <td>
                                        {classify['0']?(classify['0'].name+'>'):''} {classify['1']?(classify['1'].name+'>'):''} {classify['2']?(classify['2'].name+'>'):''} <Link to="/classify" className="u-btn f-ml10">重新选择分类</Link><span className="s-red f-ml10">重新选择分类当前所填写的内容将清空，请谨慎选择</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>商品名称：</th>
                                    <td>
                                        <span className="u-txt-word f-mr10">
                                            <input type="text" className="u-txt" size="93" id="title" name="arg[title]" defaultValue={config.title}/>
                                            <em><b className="s-yellow">60</b>/60</em>
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>商品广告词：</th>
                                    <td>
                                        <input type="text" className="u-txt" size="99" id="title" name="arg[advertisement]" defaultValue={config.advertisement}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>权限设置：</th>
                                    <td>
                                        <label className="f-mr10">
                                            <If condition={config.type==1}>
                                                <Then>
                                                    <input type="radio" className="u-radio f-mr5" name="arg[type]" value="1" defaultChecked />
                                                </Then>
                                                <Else>
                                                    <input type="radio" className="u-radio f-mr5" name="arg[type]" value="1" />
                                                </Else>
                                            </If>
                                        公开</label>
                                        <label className="f-mr10">
                                            <If condition={config.type==3}>
                                                <Then>
                                                    <input type="radio" className="u-radio f-mr5" name="arg[type]" value="3" defaultChecked />
                                                </Then>
                                                <Else>
                                                    <input type="radio" className="u-radio f-mr5" name="arg[type]" value="3" />
                                                </Else>
                                            </If>
                                        私有</label>
                                        <span className="s-gray f-ml15"><span className="s-red f-mr5">公开</span>全部会员可代理;<span className="s-red f-mr5 f-ml20">私有</span>不可代理;</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="m-product-block f-mb10 f-mt10">
                            <div className="title">商品属性</div>
                            <div className="con">
                                {classifyId?<ProductAttr classifyId={classifyId} />:''}
                            </div>
                        </div>
                        <div className="m-product-block f-mb10 f-mt10">
                            <div className="title">价格库存</div>
                            <div className="con">
                                <div className="f-mb5">
                                    <span className="th">市场价格：<input type="text" className="u-txt" size="10" name="arg[market]" defaultValue={config.market} /></span><span className="f-ml5">元</span>
                                    <span className=" f-ml15 th">成交价格：<input type="text" className="u-txt" size="10" name="arg[price]" defaultValue={config.price} /></span><span className="f-ml5">元</span>
                                    <span className="f-ml15 th">供应价格：<input type="text" className="u-txt" size="10" name="arg[cost]" defaultValue={config.cost} /></span><span className="f-ml5">元</span>
                                </div>
                                <div style={{'border':'1px solid #facdcd','backgroundColor':'#fff0f0','padding':'5px 10px','marginBottom':'10px'}}><span className="s-red f-mr5">市场价格</span>实际参考价，只做显示用;<span className="s-red f-mr5 f-ml20">成交价格</span>顾客实际支付的现金数量;<span className="s-red f-mr5 f-ml20">供应价</span>供应商每单业务完成交易后获得金额;</div>
                                <div className="">
                                    <span className="th">库存数量：</span><input type="text" className="u-txt" size="10" name="arg[stock]" defaultValue={config.stock} /><span className="f-ml10 s-gray">库存随系统所有代理店面销售减少</span>
                                </div>
                            </div>
                        </div>
                        <div className="m-product-block f-mb10 f-mt10">
                            <div className="title">销售属性</div>
                            <div className="con">
                                <SaleAttr classifyId="535" sales={config.sales} />
                            </div>
                        </div>
                        <div className="m-product-block f-mb10">
                            <div className="title">物流设置</div>
                            <div className="con">
                                <table>
                                    <thead><tr><th width="88"></th><th></th></tr></thead>
                                    <tbody>
                                        <tr>
                                            <th valign="top" width="80">设置邮费：</th>
                                            <td>
                                                <Select className="u-slt f-mr10" name="arg[freightid]" url="?m=freight&c=index&a=index" defaultValue={config.freightid} onChange={this.handleFreightChange.bind(this)} asyncFn={this.handleFreightAsync.bind(this)} ref="freightSlt"></Select>
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
                        <Picture picture={config.picture} video={config.video} />
                        <Content content={config.content} content1={config.content1} content2={config.content2} content3={config.content3} />
                        <div className="f-mtb20 f-tac">
                            <input type="submit" value="商品入库" className="u-btn-red u-btn-biger" /><label className="f-ml15"><input type="checkbox" className="u-checkbox f-mr5" /></label><DialogGet url="?m=member&a=agreement&name=supply">承诺遵守<Agreement name="supply" /></DialogGet>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

AddProduct.contextTypes={
    router: React.PropTypes.object,
}

module.exports=connect((state)=>{
    return {classify:state.classify};
})(AddProduct);
