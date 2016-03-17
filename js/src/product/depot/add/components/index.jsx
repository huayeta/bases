import React from 'react';
import {findDOMNode} from 'react-dom';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updataConfig,UPDATA_CONFIG} from '../../../actions/index.jsx';
import ProductAttr from './Productattr.jsx';
import SaleAttr from './SaleAttr.jsx';
import Picture from './Picture.jsx';
import serialize from 'form-serialize';
import {dialogGet,dialogTip} from 'common/artDialog.es6';
import {DialogGet} from 'common/Dialog.jsx';
import Agreement from 'common/Agreement.jsx';
import Fetch from 'common/Fetch.es6';

class addDepot extends React.Component {
    constructor() {
        super();
    }
    componentDidMount(){
        this.form=findDOMNode(this.refs.formName);
    }
    handleSubmit(event){
        let _this=this;
        let formValue=serialize(this.form);
        Fetch('?m=depot&c=information&a=add&id='+_this.props.config.id,{
            isJson:true,
            method:'POST',
            body:formValue
        }).then((res)=>{
            if(!res.status)return dialogTip({content:res.info}).show();
            dialogTip({content:res.info}).addEventListener('close',function(){
                window.location.reload();
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
        let sales=config.sales;
        if(config.sales_label){
            // sales_label=JSON.parse(config.sales_label);
            sales_label=eval(config.sales_label);
        }
        return(
            <div>
                <div className="m-tabform f-pdt10 m-tabform-w800">
                    <form ref="formName" onSubmit={this.handleSubmit.bind(this)}>
                        <input type="hidden" name="id" defaultValue={config.id} />
                        <table>
                            <thead><tr><th width="88"></th><td></td></tr></thead>
                            <tbody>
                                <tr>
                                    <th>
                                        商品分类：
                                    </th>
                                    <td>
                                        <input type="hidden" name="arg[categoryid]" value={classifyId} />
                                        {classify['0']?(classify['0'].name+'>'):''} {classify['1']?(classify['1'].name+'>'):''} {classify['2']?(classify['2'].name+'>'):''} <Link to="/classify" className="u-btn f-ml10">重新选择分类</Link><span className="s-red f-ml10">重新选择分类当前所填写的内容将清空，请谨慎选择</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>商品名称：</th>
                                    <td>
                                        <span className="u-txt-word f-mr10">
                                            <input type="text" className="u-txt" size="93" id="title" name="arg[title]" value={config.title} onChange={this.handleChange.bind(this,'title')} />
                                            <em><b className="s-yellow">60</b>/60</em>
                                        </span>
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
                            <div className="title">价格单位</div>
                            <div className="con">
                                <div className="f-mb5">
                                    <span className="th">市场价格：<input type="text" className="u-txt" size="10" name="arg[market]" defaultValue={config.market} /></span><span className="f-ml5">元</span>
                                    <span className=" f-ml15 th">条码：<input type="text" className="u-txt" size="10" name="arg[bar_code]" defaultValue={config.bar_code} /></span>
                                    <span className=" f-ml15 th">单位：
                                        <select className="u-slt" name="arg[unit]" defaultValue={config.unit}>
                                            {config.unit_array.map((unit,index)=>{
                                                return(
                                                    <option id={unit.id} key={index}>{unit.name}</option>
                                                )
                                            })}
                                        </select>
                                    </span>
                                    <span className=" f-ml15 th">规格：<input type="text" className="u-txt" size="10" name="arg[format]" defaultValue={config.format} /></span>
                                </div>
                            </div>
                        </div>
                        {classifyId?<div className="m-product-block f-mb10 f-mt10">
                            <div className="title">销售属性</div>
                            <div className="con">
                                <SaleAttr classifyId={classifyId} sales={sales} sales_label={sales_label} title={config.title} advertisement={config.advertisement} />
                            </div>
                        </div>:''}
                        <Picture picture={config.picture} video={config.video} />
                        <div className="f-mtb20 f-tac">
                            <input type="submit" value="商品入库" className="u-btn-red u-btn-biger" /><label className="f-ml15"><input type="checkbox" className="u-checkbox f-mr5" required /></label><DialogGet url="?m=member&a=agreement&name=supply">承诺遵守<Agreement name="supply" /></DialogGet>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

addDepot.contextTypes={
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
})(addDepot);
