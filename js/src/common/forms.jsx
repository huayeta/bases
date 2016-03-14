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
    handleChange(event){
        this.value=event.target.value;
        this.forceUpdate();
    }
    handleBlur(){
        let value=this.input.value;
        let {datatype}=this.props;
        if(datatype){
            if(datatype=='*'){
                // if(!value)this.input.
            }
        }
    }
    componentDidMount(){
        this.input=findDOMNode(this.refs.inputText);
    }
    render(){
        return(
            <input ref="inputText" type="text" {...this.props} value={this.value} onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)} />
        )
    }
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

export {Input,Select,Textarea}
