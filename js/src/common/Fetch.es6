import deepAssign from 'deep-assign';

const Fetch=(url,cfg={})=>{
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
    return fetch(url,config).then((res) => {
        if(config.isJson){
            return res.json();
        }else{
            return res.text();
        }
    })
}
export default Fetch;
