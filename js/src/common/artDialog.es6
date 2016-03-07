import objectAssign from 'object-assign';

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
    objectAssign(opts,obj);
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
    objectAssign(opts,obj);
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
    objectAssign(opts,obj);
    return dialog(opts);
}

//计算dialog的最大高度
const maxhDialog=(h)=>{
    let yskjDom=document.querySelectorAll('.g-yskj')[0];
    yskjDom.setAttribute('style','height:auto');
    let maxH=window.parent.window.document.documentElement.clientHeight*0.75;
    let height;
    if(h){
        height=(parseFloat(h,10)>maxH)?maxH:parseFloat(h,10);
    }else{
        let H=document.querySelectorAll('.j-dialog')[0].clientHeight+1;
        height=(H>maxH?maxH:H);
    }
    yskjDom.setAttribute('style','height:'+height+'px');
    return height;
}
//重新等位dialog的高度
const resetDialog=()=>{
    let tmpDialog=dialog.get(window);
    tmpDialog.height(maxhDialog());
}

//弹窗的内部js
const dialogEditor=(obj={})=>{
    let tmpDialog=dialog.get(window);
    let title=obj.title || document.title || '提示信息';
    tmpDialog.title(title);
    if(obj.width)tmpDialog.width(obj.width);
    if(obj.height){
        let maxH=maxhDialog(obj.height);
        tmpDialog.height(maxH);
    }
    tmpDialog.reset();
    if(obj.button){
        tmpDialog.button(obj.button);
    }else{
        tmpDialog.button([{
            value:'确定',
            callback:function(){
                if(typeof obj.callback == 'function'){
                    obj.callback.bind(dialog)();
                }
                return false;
            },
            autofocus: true
        }]);
    }
}

export {dialog,dialogTip,dialogDel,dialogGet,dialogEditor,resetDialog};
