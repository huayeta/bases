import $ from 'jquery';
import Widget from 'common/Widget';
import events from './events';

//右键菜单
export default class ContextMenu extends Widget{
    constructor(obj={}) {
        super();
        this.config={
            event:'',
            buttons:[]
        }
        Object.assign(this.config,obj);
    }
    renderUI(){
        this.boundingBox=$('<div><style type="text/css" id="contextMenu">.u-contextmenu{ border: 1px solid #c8ccd5; box-shadow: 0px 1px 3px rgba(0,0,0,0.2); position: absolute; background: #fff;overflow:hidden;width:160px;}.u-contextmenu li{ line-height: 32px;}.u-contextmenu li a{cursor: pointer; position:relative; display:block; height:20px; overflow:hidden; padding:5px 0; color:#3a404a; border-top:1px solid #fff; border-bottom:1px solid #fff;}.u-contextmenu li a i{ position:absolute; top:10px; left:5px; opacity:.7;}.u-contextmenu li a span{ display:block; padding:0 12px 0 32px; line-height:20px; overflow:hidden;white-space:nowrap;word-wrap:normal;text-overflow:ellipsis;}.u-contextmenu li.split{ height:1px; line-height:1px;font-size:1px; margin:1px 0; overflow:hidden;}.u-contextmenu li.split .line{ padding-left:27px; height:1px; line-height:1px; font-size:1px; overflow:hidden;}.u-contextmenu li.split .line div{height:1px; line-height:1px;font-size:1px;overflow:hidden; background-color:#eeeff4;}.u-contextmenu li a:hover{text-decoration:none;background: #f3f8ff;border-top: 1px #d5e5f5 solid;border-bottom: 1px #d5e5f5 solid;}.u-contextmenu li a:hover i{opacity:1;}</style><div class="u-contextmenu j-contextmenu"><ul></ul></div></div>');
        let li='';
        for (let i = 0, n = this.config.buttons.length; i < n; i++) {
            let button=this.config.buttons[i];
            li += '<li data-index="'+i+'"><a href="javascript:void(0);"><i class="'+(button.icon?button.icon:"")+'"></i><span>' + button.text + '</span></a></li>';
            if(button.split){
                li+='<li class="split"><div class="line"><div></div></div></li>';
            }
        }
        this.boundingBox.find('ul').append(li);
    }
    bindUI(){
        let _this=this;
        this.boundingBox.on('mousedown','li',function(event){
            let $this=$(this);
            let index=$this.data('index');
            _this.config.buttons[index].callback.call(_this);
            _this.fire('close');
            _this.destroy();
            event.stopPropagation();
        });
        this.close=function(){
            _this.destroy();
        }
        $(document).on('mousedown',this.close);
    }
    syncUI(){
        let event=this.config.event;
        let $contextmenu=this.boundingBox.find('.j-contextmenu');
        let clientX = event.clientX;
        let clientY = event.clientY;
        let $window=$(window);
        let clientHeight=$window.height();
        let clientWidth=$window.width();
        let scrollHeight=$(document).height();
        let scrollTop=$window.scrollTop();
        let scrollLeft=$window.scrollLeft();
        let offsetHeight=$contextmenu.outerHeight();
        let offsetWidth=$contextmenu.outerWidth();
        let styles={};
        if(clientY+offsetHeight>clientHeight){
            styles.bottom='1px';
        }else{
            styles.top=scrollTop+clientY+'px';
        }
        if(clientX+offsetWidth>clientWidth){
            styles.right='1px';
        }else{
            styles.left=scrollLeft+clientX+'px';
        }
        $contextmenu.css(styles);
        this.fire('show');
    }
    destructor(){
        this.boundingBox.off();
        $(document).off('mousedown',this.close);
        this.boundingBox.remove();
    }
    show(obj={}){
        Object.assign(this.config,obj);
        if(!this.config.event)return this;
        this.render();
        return this;
    }
}
