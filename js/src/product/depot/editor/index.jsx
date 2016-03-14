import React from 'react';
import 'babel-polyfill';
import {render,findDOMNode} from 'react-dom';
import objectAssign from 'object-assign';
import serialize from 'form-serialize';
import Picture from '../add/components/Picture.jsx';
import {dialogEditor,dialog} from 'common/artDialog.es6';

class  EditorApp extends React.Component {
    constructor() {
        super();
        this.dialog=dialog.get(window)
        let data=this.dialog.data;
        this.config={
            picture:[],
            content:'',
            content1:'',
            content2:'',
            content3:'',
        }
        objectAssign(this.config,data.defaultValue,{sale:data.sale});
        if(!this.config.picture)this.config.picture=[];
        if(!this.config.title)this.config.title=data.config.title;
    }
    componentDidMount(){
        let _this=this;
        let {sale}=this.config;
        let name=[];
        sale.forEach((tmpArr)=>{
            name.push(tmpArr.name);
        })
        name=name.join('、');
        _this.form=findDOMNode(_this.refs.formName);
        dialogEditor({
            title:`${name}的规格`,
            width:750,
            height:300,
            callback:function(){
                _this.handleSubmit();
            }
        })
    }
    handleSubmit(event){
        let _this=this;
        if(event)event.preventDefault();
        let formValue=serialize(_this.form,{hash:true});
        this.dialog.close(formValue.arg).remove();
    }
    render(){
        const config=this.config;
        return(
            <div className="f-pd20">
                <form onSubmit={this.handleSubmit.bind(this)} ref="formName">
                    <div className="m-tabform f-mb10">
                        <table>
                            <thead><tr><th width="88"></th><td></td></tr></thead>
                            <tbody>
                                <tr>
                                    <th>
                                        商品名称：
                                    </th>
                                    <td>
                                        <input type="text" className="u-txt" size="60" name="arg[title]" defaultValue={config.title} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Picture picture={config.picture} video={config.video} />
                </form>
            </div>
        )
    }
}

render(<EditorApp />,document.getElementById('app'));
