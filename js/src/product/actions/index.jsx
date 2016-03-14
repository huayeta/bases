export const UPDATA_CLASSIFY='updata_classify';
export const UPDATA_CONFIG='updata_config';

export const updataClassify=(arr)=>{
    return {type:UPDATA_CLASSIFY,classify:arr};
}
export const updataConfig=(name,value)=>{
    return {type:UPDATA_CONFIG,name:name,value:value};
}
