import React,{ Component } from 'react';
import {ajax,_blank} from 'common/util';
import ContextMenu from 'common/ContextMenu';
import ScrollLoader from 'common/ScrollLoader';
import {dialogTip,dialogDel} from 'common/artDialog';

export class Allphoto extends Component {
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
    //获取数据
    getData(){
        let _this=this;
        _this.ScrollLoader=new ScrollLoader({
            target:'.g-yskj',
            curPage:_this.curPage,
            url:'?m=photo&c=photo'
        }).init().on('success',function(ret){
            if(ret.data){
                _this.lists=_this.lists.concat(ret.data);
                _this.forceUpdate();
            }

        });
    }
    //获得选择的id
    getCheckId(){
        var id=[];
        var _this=this;
        this.state.lists.forEach(function(list){
            if(list.check)id.push(list.id);
        });
        return id.join(',');
    }
    //图片点击
    handleToggle(index){
        this.lists[index].check=!this.lists[index].check;
        this.forceUpdate();
    }
    //图片右击
    handleContextMenu(index,event){
        event.preventDefault();
        let _this=this;
        let img=this.lists[index];
        img.check=true;
        this.forceUpdate();
        new ContextMenu({
            event:event,
            buttons:[
                {
                    icon:'fa fa-download fa-lg',
                    text:'打开',
                    callback:function(){
                        _blank(img.filepath);
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
                        dialogDel({
                            ok:function(){
                                ajax({
                                    url:'?m=photo&c=photo&a=del&id='+_this.getCheckId()
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
        )
    }
    componentWillUnmount(){
        this.ScrollLoader.destroy();
    }
}
