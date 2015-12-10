import $ from 'jquery';
import React,{ Component } from 'react';
import {ajax,_blank,sltAjax} from 'common/util';
import ContextMenu from 'common/ContextMenu';
import ScrollLoader from 'common/ScrollLoader';
import WebLoader from 'common/WebLoader';
import {dialog,dialogTip,dialogDel} from 'common/artDialog';
import {PropTypes} from 'react-router';

export class GroupphotoDetail extends Component {
    constructor() {
        super();
        this.curPage=0;
        this.lists=[];
        this.category={};
    }
    resetData(){
        this.curPage=0;
        this.lists=[];
        this.getData();
    }
    //获取数据
    getData(){
        let _this=this;
        _this.ScrollLoader=new ScrollLoader({
            target:'.g-yskj',
            curPage:_this.curPage,
            url:'?m=photo&c=photo&categoryid='+_this.categoryid
        }).init().on('success',function(ret){
            if(ret.data){
                _this.lists=_this.lists.concat(ret.data);
                _this.category=ret.info.category;
                _this.forceUpdate();
            }else{
                _this.lists=[];
                _this.forceUpdate();
            }

        });
    }
    //添加图片
    addPhoto(categoryid,lists,fn=$.noop){
        var _this=this;
        if(!lists || !Array.isArray(lists))return;
        var data={'photo':[]};
        lists.forEach(function(list){
            data.photo.push({'filepath':list.filepath,'filename':list.filename});
        },this);
        ajax({
            url:'?m=photo&c=photo&a=add&categoryid='+categoryid,
            type:'POST',
            data:data
        }).success(function(ret){
            fn(ret);
        });;
    }
    //获取选择的id
    getCheckId(){
        let id=[];
        let _this=this;
        this.lists.forEach(function(list){
            if(list.check)id.push(list.id);
        });
        return id.join(',');
    }
    del(cb=$.noop){
        let _this=this;
        dialogDel({
            ok:function(){
                let topDialog=this;
                ajax({
                    url:'?m=photo&c=photo&a=del&id='+_this.getCheckId()
                }).success((ret)=>{
                    dialogTip({content:ret.info}).showModal();
                    if(ret.status){
                        _this.resetData();
                    }
                    cb(ret);
                    topDialog.close().remove();
                });
                return false;
            }
        }).showModal();
    }
    //移动到某个相册
    move(cb=$.noop,text='复制成功'){
        let _this=this;
        dialog({
            title:'选择相册',
            content:'<select class="u-slt j-sltAjax" data-url="?m=photo&c=album"></select>',
            okValue:'确定',
            ok:function(){
                var topDialog=this;
                var $target=$(this.node).find('.j-sltAjax');
                var val=$target.val();
                var arr=[];
                _this.lists.forEach(function(list){
                    if(list.check){
                        arr.push({'filename':list.title,'filepath':list.filepath});
                    }
                });
                _this.addPhoto(val,arr,function(ret){
                    dialogTip({content:text}).addEventListener('close',function(){
                        cb(ret);
                        topDialog.close().remove()
                    }).showModal();
                });
                return false;
            }
        }).addEventListener('show',function(){
            sltAjax({
                contain:this.node
            })
        }).showModal();
    }
    //返回
    handleGoBack(){
        this.context.history.goBack();
    }
    //上传
    handleUpload(){
        var _this=this;
        new WebLoader({
            isPhoto:true,
            size:1000
        }).upload().on('success',(val)=>{
            _this.addPhoto(_this.categoryid,val,function(ret){
                dialogTip({content:ret.info}).showModal();
                if(ret.status)_this.resetData();
            })
        })
    }
    //图片单击
    handleToggle(index){
        this.lists[index].check=!this.lists[index].check;
        this.forceUpdate();
    }
    //图片右击
    handleContextMenu(index,event){
        event.preventDefault();
        let _this=this;
        let list=this.lists[index];
        if(!list.check){
            list.check=true;
            this.forceUpdate();
        }
        new ContextMenu({
            event:event,
            buttons:[
                {
                    icon:'fa fa-download fa-lg',
                    text:'打开',
                    callback:function(){
                        _blank(list.filepath);
                    }
                },
                {
                    icon:'',
                    text:'全选',
                    callback:function(){
                        _this.lists.map(function(list){
                            list.check=true;
                            return list;
                        });
                        _this.forceUpdate();
                    }
                },
                {
                    icon:'fa fa-trash-o fa-lg',
                    text:'删除',
                    callback:function(){
                        _this.del();
                    }
                },
                {
                    icon:'',
                    text:'复制到',
                    callback:function(){
                        _this.move($.noop,'复制成功');
                    }
                },
                {
                    icon:'',
                    text:'移动到',
                    callback:function(){
                        _this.move(function(){
                            ajax({
                                url:'?m=photo&c=photo&a=del&id='+_this.getCheckId()
                            }).success((ret)=>{
                                if(ret.status){
                                    _this.resetData();
                                }
                            });
                        },'移动成功');
                    }
                }
            ]
        }).show();
    }
    componentWillMount(){
        this.categoryid=this.props.params.id;
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
            <div>
                <div className="m-photo-group-detail-title">
                    <div className="back" onClick={this.handleGoBack.bind(this)}><i className="fa fa-chevron-circle-left fa-lg f-mr5"></i>返回</div>
                    <div className="f-oh title"><span className="f-fr u-btn-white u-btn-flat f-ml10" onClick={this.handleUpload.bind(this)}>上传图片</span>{this.category.name}</div>
                </div>
                <div className="m-photo-timeline">
                    <div className="list">
                        <div className="timeline-content">
                            {this.lists.map(function(list,index){
                                return(
                                        <a href="javascript:void(0)" key={index} className={list.check?"select":""} onClick={this.handleToggle.bind(this,index)} onContextMenu={this.handleContextMenu.bind(this,index)}><img src={list.thumb} /><div className="mask"><i className="icon"></i></div></a>
                                );
                            },this)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentWillUnmount(){
        this.ScrollLoader.destroy();
    }
}
GroupphotoDetail.contextTypes={history:PropTypes.history};
