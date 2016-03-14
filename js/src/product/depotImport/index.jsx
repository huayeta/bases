import React from 'react';
import {findDOMNode} from 'react-dom';
import serialize from 'form-serialize';
import {If,Then,Else} from 'react-if';
import Fetch from 'common/Fetch.es6';
import {dialogTip} from 'common/artDialog.es6';
import {DialogChoose,DialogGet} from 'common/Dialog.jsx';
import Agreement from 'common/Agreement.jsx';
import ProductAttr from './ProductAttr.jsx';
import SaleAttr from './SaleAttr.jsx';
import Freight from './Freight.jsx';
import Picture from './Picture.jsx';
import Content from './Content.jsx';

export default class DepotImport extends React.Component {
    constructor() {
        super();
        this.config=window.config || {};
        if(this.config.id)this.editor=true;
    }
    handleSubmit(event){
        let _this=this;
        if(window.CKupdate)window.CKupdate();
        let formValue=serialize(this.form);
        Fetch('?m=product&c=product&a=add&id='+this.config.id,{
            isJson:true,
            method:'POST',
            body:formValue
        }).then((res)=>{
            if(!res.status)return dialogTip({content:res.info}).show();
            dialogTip({content:res.info}).addEventListener('close',function(){
                window.location.href='?m=product&c=product&a=stock';
            }).show();
        })
        event.preventDefault();
    }
    handleChoose(returnValue){
        // console.log(returnValue);
        //选择完商品后的回调
        if(returnValue && returnValue.length>0){
            this.config=returnValue[0];
            this.forceUpdate();
        }
    }
    componentDidMount(){
        this.form=findDOMNode(this.refs.formName);
    }
    render(){
        let {config}=this;
        return(
            <div className="m-tabform f-pdt10 m-tabform-w800">
                <form ref="formName" onSubmit={this.handleSubmit.bind(this)}>
                    <input type="hidden" name="id" value={config.id} />
                    <input type="hidden" name="arg[no]" value={config.sales_array?config.sales_array[0].no:''} />
                    <input type="hidden" name="arg[categoryid]" value={config.categoryid} />
                    {this.editor?'':<table>
                        <thead><tr><th width="88"></th><td></td></tr></thead>
                        <tbody>
                            <tr>
                                <th>
                                    选择商品：
                                </th>
                                <td>
                                    <DialogChoose className="u-btn u-btn-big" url="?m=depot&c=information&a=publish_info" callback={this.handleChoose.bind(this)}>点击选择</DialogChoose>
                                </td>
                            </tr>
                        </tbody>
                    </table>}
                    {(!this.editor && !config.id)?'':<div>
                        <table>
                            <thead><tr><th width="88"></th><td></td></tr></thead>
                            <tbody>
                                <tr>
                                    <th>
                                        商品名称：
                                    </th>
                                    <td>
                                        <input type="text" className="u-txt" size="99" name="arg[title]" defaultValue={config.title} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>商品广告词：</th>
                                    <td>
                                        <input type="text" className="u-txt" size="99" name="arg[advertisement]" defaultValue={config.advertisement} />
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
                        <ProductAttr value={config.value} />
                        {!config.sales_label?<div className="m-product-block f-mb10 f-mt10">
                            <div className="title">价格单位</div>
                            <div className="con">
                                <div className="f-mb5">
                                    <span className="th">市场价格：<input type="text" className="u-txt" size="10" name="arg[market]" defaultValue={config.market} /></span><span className="f-ml5">元</span>
                                    <span className=" f-ml15 th">成交价格：<input type="text" className="u-txt" size="10" name="arg[price]" defaultValue={config.price} /></span><span className="f-ml5">元</span>
                                    <span className="f-ml15 th">供应价格：<input type="text" className="u-txt" size="10" name="arg[cost]" defaultValue={config.cost} /></span><span className="f-ml5">元</span>
                                </div>
                                <div style={{'border':'1px solid #facdcd','backgroundColor':'#fff0f0','padding':'5px 10px','marginBottom':'10px'}}><span className="s-red f-mr5">市场价格</span>实际参考价，只做显示用;<span className="s-red f-mr5 f-ml20">成交价格</span>顾客实际支付的现金数量;<span className="s-red f-mr5 f-ml20">供应价</span>供应商每单业务完成交易后获得金额;</div>
                            </div>
                        </div>:<SaleAttr sales={config.sales_array} salesLable={config.sales_label} />}
                        <Freight config={config} />
                        {config.sales_label?'':<div >
                            <Picture picture={config.pictures?config.pictures:config.picture} video={config.video} />
                            <Content content={config.content} content1={config.content1} content2={config.content2} content3={config.content3} />
                        </div>}
                        <div className="f-mtb20 f-tac">
                            <input type="submit" value="商品入库" className="u-btn-red u-btn-biger" /><label className="f-ml15"><input type="checkbox" className="u-checkbox f-mr5" required /></label><DialogGet url="?m=member&a=agreement&name=supply">承诺遵守<Agreement name="supply" /></DialogGet>
                        </div>
                    </div>}
                </form>
            </div>
        )
    }
}
