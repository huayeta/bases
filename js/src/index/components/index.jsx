import React from 'react';
import {If,Then,Else} from 'react-if';
import Simpop from 'common/simpop';
import guideUser from 'common/guideUser.es6';
import Slider from 'react-slick';

export class Index extends React.Component {
    constructor() {
        super();
        this.configs=Object.assign({},window.CONFIGS);
        this.msg={
            gift: "0",
            msg: "0",
            product_card: "0",
            product_cart: "0",
            product_order: "0",
            service_cart: "0",
            service_order: "0",
            transaction_reply: "0",
        };

        //微信公众号
        if(this.configs.wx_code){
            this.wx_codeFn=()=>{
                Simpop({
                    title:'关注微信公众号',
                    content:`<div class="f-tac" style="width:100%;"><img src="${this.configs.wx_code}" width="80%" /><h2 class="f-mt10">长按图片关注我们！您将获得更多权益！</h2></div>`,
                    okVal: false,
                    maskclose:false,
                    cancelVal: false
                }).show();
            }
        }
        // console.log(1);
        //引导认证
        guideUser();
    }
    componentDidMount(){
        fetch('?m=common&c=index&a=notice',{
            credentials:'include',
            headers: {
               "Date-Type": "json"
             }
        }).then((res)=>{
            return res.json();
        }).then((res) => {
            if(res.status){
                this.msg=res.info;
                this.forceUpdate();
            }
        })
    }
    render(){
        return(
            <div className="g-content s-bgf5">
            	<div className="m-index-header">
                    <If condition={!!this.configs.wx_code}>
                        <Then>
                    	    <div className="btn">
                    	        <a className="icon code" onClick={this.wx_codeFn}></a>
                    	    </div>
                        </Then>
                    </If>
            	    <div className="user f-cb">
                        <div className="pic"><a href="?m=member&c=account" style={{'backgroundImage':`url(${this.configs.avatar})`}}></a></div>
                        <div className="f-oh">
            				<div className="tt">
                                <span className="name">{this.configs.nickname?this.configs.nickname:(this.configs.realname?this.configs.realname:'<a href="?m=member&c=account">点击完善</a>')}</span>
            				</div>
            				<div className="des">{this.configs.signature?this.configs.signature:'让创业者都会做生意'}</div>
            			</div>
            	    </div>
            	</div>
                <div className="m-msg f-mb10">
            		<ul>
            			<li>
            				<div className="pic" onClick={()=>{window.location.href='?m=product&c=cart&a=index';}}>
                                <img src="/wap/images/index/icon-cart.png" />
                                <If condition={this.msg.product_cart!=='0'}>
                                    <Then><i>{this.msg.product_cart}</i></Then>
                                </If>
                            </div>
            				<div className="name">购物</div>
            			</li>
            			<li>
            				<div className="pic" onClick={()=>{window.location.href='?m=message&c=index';}}><img src="/wap/images/index/icon-message.png" />
                                <If condition={this.msg.msg!=='0'}>
                                    <Then><i>{this.msg.msg}</i></Then>
                                </If>
            				</div>
            				<div className="name">消息</div>
            			</li>
            			<li>
            				<div className="pic" onClick={()=>{window.location.href='?m=financial&c=index&a=index';}}><img src="/wap/images/index/icon-coupons.png" /></div>
            				<div className="name">资产</div>
            			</li>
            			<li>
            				<div className="pic" onClick={()=>{window.location.href='?m=generalize&c=generalize&a=member_card';}}><img src="/wap/images/index/icon-transaction.png" /></div>
            				<div className="name">卡券</div>
            			</li>
            		</ul>
            	</div>
                <If condition={this.configs.is_default_password==='1'}>
                    <Then>
                        <div className="u-list-box f-mb10" onClick={()=>{window.location.href='?m=member&c=account&a=password';}}>
                    		<div className="item-txt">您的默认密码是：<span className="s-blue">123456</span>，点击修改密码</div>
                    	</div>
                    </Then>
                </If>
                <div className="m-index-line f-mb10">
                    <a className="item-icon" href="?m=financial&c=gift&a=index">
                        <div className="pic"><img src="/member/images/panel/sphd.png" /></div>
                        <h2 className="title"><i className="f-fr ion-ios-arrow-right icon f-ml5"></i>
                            <If condition={this.msg.gift!=='0'}>
                                <Then>
                                    <span className="f-fr s-blue f-fs12">我有<i>{this.msg.gift}</i>个礼品未领取</span>
                                </Then>
                            </If>
                            我的礼品
                        </h2>
                    </a>
                    <If condition={this.msg.transaction_reply!=='0'}>
                        <Then>
                            <a className="item-icon" href="?m=transaction&c=transaction&a=index">
                    	        <div className="pic"><img src="/member/images/panel/kfzx.png" /></div>
                                <h2 className="title"><i className="f-fr ion-ios-arrow-right icon f-ml5"></i><span className="f-fr s-blue f-fs12">我有<i>{this.msg.transaction_reply}</i>条事务未处理</span>我的事务</h2>
                    	    </a>
                        </Then>
                    </If>
                    <a className="item-icon" href="?m=product&c=order&a=buy">
                        <div className="pic"><img src="/member/images/panel/wddd.png" /></div>
                        <h2 className="title"><i className="f-fr ion-ios-arrow-right icon f-ml5"></i>
                            <If condition={this.msg.product_order!=='0'}>
                                <Then>
                                    <span className="f-fr s-blue f-fs12">我有<i>{this.msg.product_order}</i>条订单</span>
                                </Then>
                            </If>
                            我的订单
                        </h2>
                    </a>
            	</div>
                <div className="m-index-line f-mb10">
                    <If condition={!!this.configs.site_10_url}>
                        <Then>
                            <a className="item-icon" href={this.configs.site_10_url}>
                    			<div className="pic"><img src="/member/images/panel/wdww.png" /></div>
                    			<h2 className="title"><i className="f-fr ion-ios-arrow-right icon"></i>{this.configs.yellow_pages?this.configs.yellow_pages:'我的微网'}</h2>
                    		</a>
                        </Then>
                    </If>

            		<a className="item-icon" href="?m=member&c=account&a=spread">
            			<div className="pic"><img src="/member/images/panel/fxtg.png" /></div>
            			<h2 className="title"><i className="f-fr ion-ios-arrow-right icon"></i>分享推广</h2>
            		</a>
            	</div>
            	<div className="m-index-line">
            		<div className="item-icon">
            			<div className="pic"><img src="/member/images/panel/ymgl.png" /></div>
            			<h2 className="title"><i className="f-fr ion-arrow-down-b f-ml10 icon"></i><span className="f-fr f-fs12 s-orange">购物获得更高权益</span><a href="/">官方网站</a></h2>
            		</div>
            	</div>
                <div className="m-product-items">
                    <Slider
                        dots={false}
                        infinite={false}
                        slidesToShow="3"
                        slidesToScroll="3"
                        >
                        {this.configs.productItems.map((item,index)=>{
                            return(
                                <div>
                					<a href={'?m=product&a=item&id='+item.id} title={item.title} key={index}>
                						<i style={{'backgroundImage':'url('+(item.thumb?item.thumb:'/member/images/common/m-shop-add-pic.gif')+')'}}></i>
                						<h2 className="f-toe">{item.title}</h2>
                						<p>￥{item.price}</p>
                					</a>
                				</div>
                            )
                        })}
                    </Slider>
                </div>
                <div className="f-pdlr10 m-index-line f-pdb10">
                    <a className="u-btn-gray u-btn-full u-btn-biger" href="?m=member&a=senior">管理中心</a>
            	</div>
            </div>
        )
    }
}
