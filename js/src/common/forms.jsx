import React from 'react';
import {If,Then,Else} from 'react-if';
import {findDOMNode} from 'react-dom';
import Fetch from 'common/Fetch.es6';

class Input extends React.Component {
    constructor() {
        super();
        this.value='';
    }
    componentWillMount(){
        this.value=this.props.value;
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.value!==this.props.value){
            this.value=nextProps.value;
            this.forceUpdate();
        }
    }
    setValue(value){
        this.value=value;
        this.forceUpdate();
    }
    handleChange(event){
        let {onChange}=this.props;
        this.value=event.target.value;
        if(onChange)onChange(event);
        this.forceUpdate();
    }
    handleBlur(event){
        let value=event.target.value;
        let {datatype}=this.props;
        if(datatype){
            if(datatype=='*'){
                // if(!value)this.input.
            }
        }
    }
    render(){
        return(
            <input type="text" {...this.props} value={this.value} onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)} />
        )
    }
}
Input.propTypes={
    onChange:React.PropTypes.func,
}

class InputLimitword extends React.Component {
    constructor() {
        super();
    }
    componentWillMount(){
        let {value}=this.props;
        this.updataValue(value);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.value!=this.props.value){
            this.updataValue(nextProps.value);
            this.forceUpdate();
            this.input.setValue(this.value);
        }
    }
    componentDidMount(){
        this.input=this.refs.input;
    }
    updataValue(value){
        let {limit}=this.props;
        let newValue=value.substr(0,limit);
        this.value=newValue;
        this.length=newValue.length;
    }
    handleChange(event){
        let {limit,onChange}=this.props;
        let value=event.target.value;
        this.updataValue(value);
        event.target.value=this.value;
        this.input.setValue(this.value);
        this.forceUpdate();
        if(onChange)onChange(event);
    }
    render(){
        let {value,onChange,...other}=this.props;
        return(
            <span className="u-txt-word"><Input ref="input" type="text" className="u-txt" {...other} value={this.value} onChange={this.handleChange.bind(this)} /><em><b className="s-yellow">{this.props.limit-this.length}</b><span>/{this.props.limit}</span></em></span>
        )
    }
}
InputLimitword.propTypes={
    limit:React.PropTypes.number.isRequired,
    onChange:React.PropTypes.func,
}

class Select extends React.Component {
    constructor() {
        super();
        this.options=[];
        this.initial=true;
    }
    componentWillMount(){
        this.value=this.props.value;
    }
    componentDidMount(){
        this.getData();
    }
    getData(){
        const {url} = this.props;
        let _this=this;
        if(url){
            Fetch(url,{isJson:true})
            .then((res) => {
                if(res.status && res.info && Array.isArray(res.info.infos) && res.info.infos.length>0){
                    _this.options=res.info.infos;
                    _this.forceUpdate();
                }
            })
        }
    }
    componentDidUpdate(){
        if(this.initial){
            this.initial=false;
            const {value,asyncFn}=this.props;
            // if(value){
            //     //设置默认值
            //     let options=findDOMNode(this.refs.selectDom).options;
            //     for(let i=0;i<options.length;i++){
            //         let option=options[i];
            //         if(option.value==value){
            //             option.selected=true;
            //         }
            //     }
            // }
            if(asyncFn && this.props.url){
                //当异步初始化完之后
                asyncFn(findDOMNode(this.refs.selectDom))
            }
        }
    }
    handleChange(event){
        let value=event.target.value;
        this.value=value;
        this.forceUpdate();
        this.props.onChange(event)
    }
    render(){
        return(
            <select {...this.props} value={this.value} ref="selectDom" onChange={this.handleChange.bind(this)}>
                {this.props.children}
                {this.options.map((option,index)=>{
                    return(
                        <option value={option.id} key={index}>
                            {option.name}
                        </option>
                    )
                })}
            </select>
        )
    }
}
Select.propTypes={
    onChange:React.PropTypes.func,
    asyncFn:React.PropTypes.func,
}

class Textarea extends React.Component {
    constructor() {
        super();
    }
    componentWillMount(){
        this.value=this.props.value;
    }
    handleChange(event){
        let value=event.target.value;
        this.value=value;
        this.forceUpdate();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.value!==this.props.value){
            this.value=nextProps.value;
            this.forceUpdate();
        }
    }
    shouldComponentUpdate(nextProps){
        if(!this.value)return false;
        return true;
    }
    render(){
        return(
            <textarea {...this.props} value={this.value} onChange={this.handleChange.bind(this)}></textarea>
        )
    }
}

export {Input,InputLimitword,Select,Textarea}
