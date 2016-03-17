import React from 'react';
import {findDOMNode} from 'react-dom';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updataConfig,UPDATA_CONFIG} from '../../../actions/index.jsx';
import ProductAttr from './ProductAttr.jsx';
import SaleAttr from './SaleAttr.jsx';
import Picture from './Picture.jsx';
import Content from './Content.jsx';
import Freight from './Freight.jsx';
import serialize from 'form-serialize';
import {If,Then,Else} from 'react-if';
import {dialogGet,dialogTip} from 'common/artDialog.es6';
import {DialogGet} from 'common/Dialog.jsx';
import Agreement from 'common/Agreement.jsx';
import Fetch from 'common/Fetch.es6';
import {InputLimitword} from 'common/forms.jsx';

class AddProduct extends React.Component {
    constructor() {
        super();
    }
    componentDidMount(){
        this.form=findDOMNode(this.refs.formName);
    }
    handleSubmit(event){
        let _this=this;
        if(window.CKupdate)window.CKupdate();
        let formValue=serialize(this.form);
        Fetch('?m=product&c=product&a=add&id='+_this.props.config.id,{
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
    handleChange(name,event){
        if(!name)return;
        let value=event.target.value;
        this.props.actions.updataConfig(name,value);
    }
    render(){
        const {classify,config} = this.props;
        let classifyId;
        if(classify['0'])classifyId=classify['0'].id;
        if(classify['1'])classifyId=classify['1'].id;
        if(classify['2'])classifyId=classify['2'].id;
        if(classifyId)classifyId=parseInt(classifyId,10);

        //销售属性
        let sales_label=[];
        let sales=config.sales_array;
        if(config.sales_label){
            // sales_label=JSON.parse(config.sales_label);
            sales_label=eval(config.sales_label);
        }
        return(
            <div>
                <div className="m-tabform f-pdt10 m-tabform-w800">
                    <form ref="formName" onSubmit={this.handleSubmit.bind(this)}>
                        <input type="hidden" name="id" defaultValue={config.id} />
                        <input type="hidden" name="arg[no]" value={config.sales_array.length>0?config.sales_array[0].no:''} />
                        <input type="hidden" name="arg[categoryid]" value={classifyId} />
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
                                        <InputLimitword size="93" limit={60} name="arg[title]" defaultValue={config.title} onBlur={this.handleChange.bind(this,'title')} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>商品广告词：</th>
                                    <td>
                                        <input type="text" className="u-txt" size="99" id="title" name="arg[advertisement]" value={config.advertisement} onChange={this.handleChange.bind(this,'advertisement')} />
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
                        {classifyId?<div className="m-product-block f-mb10 f-mt10">
                            <div className="title">商品属性</div>
                            <div className="con">
                                <ProductAttr classifyId={classifyId} />
                            </div>
                        </div>:''}
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
                        {classifyId?<div className="m-product-block f-mb10 f-mt10">
                            <div className="title">销售属性</div>
                            <div className="con">
                                <SaleAttr classifyId={classifyId} sales={sales} sales_label={sales_label} title={config.title} advertisement={config.advertisement} />
                            </div>
                        </div>:''}
                        <Freight config={config} />
                        <Picture picture={config.picture} video={config.video} />
                        <Content content={config.content} content1={config.content1} content2={config.content2} content3={config.content3} />
                        <div className="f-mtb20 f-tac">
                            <input type="submit" value="商品入库" className="u-btn-red u-btn-biger" /><label className="f-ml15"><input type="checkbox" className="u-checkbox f-mr5" required /></label><DialogGet url="?m=member&a=agreement&name=supply">承诺遵守<Agreement name="supply" /></DialogGet>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

AddProduct.contextTypes={
    router: React.PropTypes.object
}

module.exports=connect((state)=>{
    return {
        classify:state.classify,
        config:state.config
    };
},(dispatch)=>{
    return {
        actions:bindActionCreators({updataConfig},dispatch)
    }
})(AddProduct);
