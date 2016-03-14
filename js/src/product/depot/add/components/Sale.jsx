import React from 'react';
import {DialogGet} from 'common/Dialog.jsx';
import objectAssign from 'object-assign';
import {Textarea,Input} from 'common/forms.jsx';
import {connect} from 'react-redux';

class Sale extends React.Component {
    constructor() {
        super();
    }
    componentWillMount(){
        this.sale=[...this.props.sale];
        this.val=objectAssign({},this.props.val);
        // console.log(this.props);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.sale!==this.props.sale){
            this.sale=nextProps.sale;
        }
        if(nextProps.val!==this.props.val){
            this.val=objectAssign({},nextProps.val);
        }
        this.forceUpdate();
    }
    handleSpicEditor(returnValue){
        let _this=this;
        if(returnValue){
            // console.log(this.val);
            // console.log(returnValue);
            objectAssign(_this.val,returnValue);
            // console.log(this.val);
            this.forceUpdate();
        }
    }
    render(){
        let idArr=[];
        let nameArr=[];
        let {sale,val}=this;
        sale.forEach((tmp)=>{
            idArr.push(tmp.id);
            nameArr.push(tmp.name);
        })
        let config=this.props.config;
        let title=val.title || (config.title?(config.title+' '+nameArr.join(' ')):'');
        let advertisement=val.advertisement || (config.advertisement?config.advertisement:'');
        return(
            <tr>
                {sale.map((tmp,key)=>{
                    return(
                        <td className="tac" key={key}>{tmp.name}</td>
                    )
                })}
                <td className="tac"><Input type="text" className="u-txt" style={{'width':'80%'}} name={'arg[sales]['+idArr.join('|')+'][market]'} value={val.market} /></td>
                <td className="tac"><Input type="text" className="u-txt" style={{'width':'80%'}} name={'arg[sales]['+idArr.join('|')+'][bar_code]'} value={val.bar_code}  /></td>
                <td className="tac"><Input type="text" className="u-txt" style={{'width':'80%'}} name={'arg[sales]['+idArr.join('|')+'][unit]'} value={val.unit} /></td>
                <td className="tac"><Input type="text" className="u-txt" style={{'width':'80%'}} name={'arg[sales]['+idArr.join('|')+'][format]'} value={val.format} /></td>
                <td className="tac">
                    <input type="hidden" name={'arg[sales]['+idArr.join('|')+'][title]'} value={title}  />
                    <input type="hidden" name={'arg[sales]['+idArr.join('|')+'][picture][]'} value={val.picture?val.picture[0]:''}  />
                    <input type="hidden" name={'arg[sales]['+idArr.join('|')+'][picture][]'} value={val.picture?val.picture[1]:''}  />
                    <input type="hidden" name={'arg[sales]['+idArr.join('|')+'][picture][]'} value={val.picture?val.picture[2]:''}  />
                    <input type="hidden" name={'arg[sales]['+idArr.join('|')+'][picture][]'} value={val.picture?val.picture[3]:''}  />
                    <input type="hidden" name={'arg[sales]['+idArr.join('|')+'][picture][]'} value={val.picture?val.picture[4]:''}  />
                    <Textarea className="f-dn" name={'arg[sales]['+idArr.join('|')+'][content]'} value={val.content}></Textarea>
                    <Textarea className="f-dn" name={'arg[sales]['+idArr.join('|')+'][content1]'} value={val.content1}></Textarea>
                    <Textarea className="f-dn" name={'arg[sales]['+idArr.join('|')+'][content2]'} value={val.content2}></Textarea>
                    <Textarea className="f-dn" name={'arg[sales]['+idArr.join('|')+'][content3]'} value={val.content3}></Textarea>
                    <DialogGet className="u-btn" url="/js/src/product/depot/editor/index.htm" data={{defaultValue:val,sale:sale,config:{title:title}}} callback={this.handleSpicEditor.bind(this)}>编辑</DialogGet>
                </td>
            </tr>
        )
    }
}
Sale.propTypes={
    sale:React.PropTypes.array.isRequired,
    val:React.PropTypes.object,
}

export default connect((state)=>{
    return {
        config:state.config
    }
})(Sale);
