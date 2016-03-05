import React from 'react';
import {If,Then,Else} from 'react-if';
import {findDOMNode} from 'react-dom';

class Select extends React.Component {
    constructor() {
        super();
        this.options=[];
        this.initial=true;
    }
    componentDidMount(){
        this.getData();
    }
    getData(){
        const {url} = this.props;
        let _this=this;
        if(url){
            fetch(url,{
                headers:{
                    'X-Requested-With':'XMLHttpRequest',
                    'Date-Type':'json'
                },
                credentials: 'include'
            }).then((res) => res.json())
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
            const {defaultValue,asyncFn}=this.props;
            if(defaultValue){
                //设置默认值
                let options=findDOMNode(this.refs.selectDom).options;
                for(let i=0;i<options.length;i++){
                    let option=options[i];
                    if(option.value==defaultValue){
                        option.selected=true;
                    }
                }
            }
            if(asyncFn && this.props.url){
                //当异步初始化完之后
                asyncFn(findDOMNode(this.refs.selectDom))
            }
        }
    }
    render(){
        return(
            <select {...this.props} ref="selectDom" onChange={this.props.onChange}>
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
        this.value=nextProps.value;
        this.forceUpdate();
    }
    render(){
        return(
            <textarea {...this.props} value={this.value} onChange={this.handleChange.bind(this)}></textarea>
        )
    }
}

export {Select,Textarea}
