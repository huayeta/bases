let dialog;
if(window.top!=window && window.top.window.dialog){
    dialog=window.top.window.dialog;
}else {
    require.ensure([],function(require){
        window.$=window.jQuery=require('jquery');
        require('src/lib/artDialog/dist/dialog-min.js');
        dialog=window.dialog;
    })
}

const getDialog=(cb)=>{
    if(dialog)return cb(dialog);
    let timer=setInterval(()=>{
        if(dialog){
            clearInterval(timer);
            cb(dialog);
        }
    },100);
}

//time时间消失
const dialogTip=(obj={})=>{
    let opts={
        time:1000
    };
    Object.assign(opts,obj);
    let dia=dialog(opts);
    dia.addEventListener('show',()=>{
        setTimeout(()=>{
            dia.close().remove();
        },opts.time)
    })
    return dia;
}
//del删除
const dialogDel=(obj={})=>{
    let opts={
        icon:'warning',
        content:'是否确认删除此数据（注意：此操作不可还原）',
        title:'提示信息',
        padding:'20px 50px',
        okValue:'删除',
        cancelValue:'取消'
    };
    Object.assign(opts,obj);
    // opts.content='<i class="u-icon-'+opts.icon+'-big f-mr20 f-dib f-vam"></i><div style="display:inline-block;">'+opts.content+'</div>';
    opts.content=`<i class="u-icon-${opts.icon}-big f-mr20 f-dib f-vam"></i><div style="display:inline-block;">${opts.content}</div>`;
    return dialog(opts);
}
//获取框架
const dialogGet=(obj={})=>{
    let opts={
        title:'loading...',
        padding:0,
        fixed: true
    };
    Object.assign(opts,obj);
    return dialog(opts);
}

export {dialog,dialogTip,dialogDel,dialogGet};
