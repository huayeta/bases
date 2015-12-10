import React,{ Component } from 'react';
import {ajax,_blank} from 'common/util';
import ContextMenu from 'common/ContextMenu';
import ScrollLoader from 'common/ScrollLoader';
import {dialogTip,dialogDel} from 'common/artDialog';

export class Timeline extends Component {
    constructor() {
        super();
        this.lists=[];
        this.curPage=0;
    }
    resetData(){
        this.curPage=0;
        this.lists=[];
        this.getData();
    }
    //格式个位数
    getZero(num){
        return num>=10?num:('0'+num);
    }
    //获取数据
    getData(){
        let _this=this;
        _this.ScrollLoader=new ScrollLoader({
            target:'.g-yskj',
            curPage:_this.curPage,
            url:'?m=photo&c=photo'
        }).init().on('success',function(ret){
            if(ret.data){
                _this.lists=_this.lists.concat(_this.formateData(ret.data));
                _this.forceUpdate();
            }

        });
    }
    //获得选择的id
    getCheckId(){
        let returnValue={id:[],index:[]};
        const _this=this;
        this.lists.forEach(function(list){
            list.childrens.forEach(function(children,index){
                if(children.check){
                    returnValue.id.push(children.id);
                    returnValue.index.push(index);
                }
            })
        });
        return returnValue;
    }
    //格式化时间
    formateData(data){
        var lists=[];
        data.forEach((list,index)=>{
            var createtime=list.createtime;
            var createtime=new Date(parseInt(list.createtime)*1000);;
            var year=createtime.getFullYear();
            var month=createtime.getMonth()+1;
            var date=createtime.getDate();
            var key=this.getZero(year)+'年'+this.getZero(month)+'月'+this.getZero(date)+'日';
            if(index==0){
                lists.push({createtime:key,childrens:[list]});
            }else{
                var lastList=lists[lists.length-1];
                if(lastList.createtime==key){
                    lastList.childrens.push(list);
                }else{
                    lists.push({createtime:key,childrens:[list]});
                }
            }
        });
        return lists;
    }
    //标题点击切换隐藏
    handleToggle(i){
        this.lists[i].hide=!this.lists[i].hide;
        this.forceUpdate();
    }
    //标题切换全选
    handleCheck(i,event){
        event.stopPropagation();
        let list=this.lists[i];
        list.check=!list.check;
        list.childrens.map(function(children){
            children.check=list.check;
        },this);
        this.forceUpdate();
    }
    //children被点击
    handleChildrenToggle(i,key){
        let list=this.lists[i];
        let children=list.childrens[key];
        children.check=!children.check;
        if(children.check){
            list.check=list.childrens.every((child)=>{
                return child.check;
            });
        }else{
            list.check=false;
        }
        this.forceUpdate();
    }
    //children被右击
    handleChildrenContextMenu(i,key,event){
        event.preventDefault();
        let _this=this;
        let list=this.lists[i];
        let children=list.childrens[key];
        children.check=true;
        list.check=list.childrens.every((child)=>{
            return child.check;
        });
        new ContextMenu({
            event:event,
            buttons:[
                {
                    icon:'fa fa-download fa-lg',
                    text:'打开',
                    callback:function(){
                        _blank(children.filepath);
                    }
                },
                {
                    icon:'fa fa-trash-o fa-lg',
                    text:'删除',
                    callback:function(){
                        dialogDel({
                            ok:function(){
                                ajax({
                                    url:'?m=photo&c=photo&a=del&id='+_this.getCheckId().id.join(',')
                                }).success((ret)=>{
                                    dialogTip({content:ret.info}).showModal();
                                    if(ret.status){
                                        _this.resetData();
                                    }
                                });
                            }
                        }).showModal();
                    }
                }
            ]
        }).show();
        this.forceUpdate();
    }
    componentDidMount(){
        this.getData();
    }
    componentDidUpdate(){
        this.isComplete=this.ScrollLoader.isComplete;
        if(!this.isComplete && this.ScrollLoader){
            if(this.ScrollLoader.isLoadFn()){
                this.ScrollLoader.request();
            }
        }
    }
    render(){
        return (
            <div className="m-photo-timeline">
                {this.lists.map((list,i)=>{
                    return (
                        <div className="list" key={i}>
                            <div className="timeline-title" onClick={this.handleToggle.bind(this,i)}>
                                <span className="f-fr" onClick={this.handleCheck.bind(this,i)}><i className={list.check?"check select f-mr5":"check f-mr5"}></i>选择</span><span className="day">{list.createtime}</span><i className={list.hide?"fa fa-angle-up f-mlr15":"fa fa-angle-down f-mlr15"}></i><span className="num">{list.childrens.length}张</span>
                            </div>
                            <div className={list.hide?'f-dn':'timeline-content'}>
                                {list.childrens.map(function(children,key){
                                    return(
                                            <a href="javascript:void(0)" className={children.check?"select":""} key={key} onClick={this.handleChildrenToggle.bind(this,i,key)} onContextMenu={this.handleChildrenContextMenu.bind(this,i,key)}><img src={children.thumb} /><div className="mask"><i className="icon"></i></div></a>
                                    );
                                },this)}
                            </div>
                        </div>
                    );
                },this)}
            </div>
        );
    }
    componentWillUnmount(){
        this.ScrollLoader.destroy();
    }
}
