import deepAssign from 'deep-assign';
import es6Promise from 'es6-promise';

es6Promise.polyfill();

const Fetch=(url,cfg={})=>{
    //默认发送cookie
    let config=deepAssign({},{
        credentials: 'include'
    },cfg);
    if(config.isJson){
        deepAssign(config,{
            headers:{
                "x-requested-with":"XMLHttpRequest",
                'Date-Type':'json'
            }
        })
    }
    if(config.method=='POST'){
        deepAssign(config,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    }
    return fetch(url,config).then((res) => {
        if(config.isJson){
            return res.json();
        }else{
            return res.text();
        }
    })
}
export default Fetch;
