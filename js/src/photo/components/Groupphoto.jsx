import React,{ Component } from 'react';
import {findDOMNode} from 'react-dom';
import {ajax,_blank} from 'common/util';
import ContextMenu from 'common/ContextMenu';
import ScrollLoader from 'common/ScrollLoader';
import {dialogTip,dialogDel} from 'common/artDialog';
import {PropTypes} from 'react-router';

export class Groupphoto extends Component {
    constructor() {
        super();
        this.groups=[];
        this.curPage=0;
    }
    resetData(){
        this.curPage=0;
        this.groups=[];
        this.getData();
    }
    //获取数据
    getData(){
        let _this=this;
        _this.ScrollLoader=new ScrollLoader({
            target:'.g-yskj',
            curPage:_this.curPage,
            url:'?m=photo&c=album'
        }).init().on('success',function(ret){
            if(ret.data){
                _this.groups=_this.groups.concat(ret.data);
                _this.forceUpdate();
            }

        });
    }
    //新建分组
    handleAddGroup(){
        this.groups.unshift({name:'',edit:true});
        this.forceUpdate();
    }
    //进入详情
    handleTo(categoryid){
        this.context.history.pushState(null, `/group/${categoryid}`);
    }
    //分组右击
    handleContextMenu(index,event){
        event.preventDefault();
        let _this=this;
        let group=_this.groups[index];
        new ContextMenu({
            event:event,
            buttons:[
                {
                    icon:'fa fa-download fa-lg',
                    text:'打开',
                    callback:function(){
                        _this.handleTo(group.id);
                    }
                },
                {
                    icon:'fa fa-trash-o fa-lg',
                    text:'删除',
                    callback:function(){
                        dialogDel({
                            ok:function(){
                                ajax({
                                    url:'?m=photo&c=album&a=del&id='+group.id
                                }).success((ret)=>{
                                    dialogTip({content:ret.info}).showModal();
                                    if(ret.status){
                                        _this.groups.splice(index,1);
                                        _this.forceUpdate();
                                    }
                                });
                            }
                        }).showModal();
                    }
                },
                {
                    icon:'',
                    text:'重命名',
                    callback:function(){
                        group.edit=true;
                        _this.forceUpdate();
                    }
                }
            ]
        }).show();
    }
    //编辑名字
    handleIptBlur(index,event){
        let _this=this;
        let value=event.target.value;
        let group=this.groups[index];
        if(!value){
            this.groups.splice(index,1);
            this.forceUpdate();
        }else{
            ajax({
                url:'?m=photo&c=album&a=add',
                type:'POST',
                data:{'arg[name]':value,id:group.id}
            }).success((ret)=>{
                if(ret.status){_this.resetData();}
                else{dialogTip({content:ret.info}).showModal();}
            });

        }
    }
    //焦距
    handleIptFocus(component){
        let ipt=findDOMNode(component);
        if(ipt){
            setTimeout(function(){
                ipt.focus();
            },10);
        }
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
                <div className="f-mb10"><a className="u-btn-white u-btn-flat f-ml15" onClick={this.handleAddGroup.bind(this)}>新建分组</a></div>
                <div className="m-photo-group-lists">
                    <ul className="f-cb">
                        {this.groups.map(function(group,index){
                            return (
                                <li key={index}>
                                    <div className="pic" key={index} onClick={this.handleTo.bind(this,group.id)} onContextMenu={this.handleContextMenu.bind(this,index)}><div className="img"><img src={group.filepath} /></div></div>
                                    {group.edit?(<div className="edit"><input type="text" ref={this.handleIptFocus.bind(this)} onBlur={this.handleIptBlur.bind(this,index)} defaultValue={group.name} /></div>):(<div className="title f-toe">{group.name}<span className="s-gray">({group.num})</span></div>)}
                                </li>
                            );
                        },this)}
                    </ul>
                </div>
            </div>
        )
    }
    componentWillUnmount(){
        this.ScrollLoader.destroy();
    }
}
Groupphoto.contextTypes={history:PropTypes.history};
