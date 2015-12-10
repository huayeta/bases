define('mSelect',function(require, exports, module){
	require('zepto');
	require('iscroll');
	require('seajsCss');

	seajs.use('/js/mobile/plugins/mSelect/zepto.mtimer.css');

    var mSelect = function(opts){
		var defaults = {
            target:'.j-mSelect',
			value : {},
			def : '',
			callback : null,
			cancel : null
		};
		var opts = $.extend(defaults, opts);
		var itemHeight = 48;
		var picker = {
			init : function(){
                opts.click(opts);
				var _this = this;

				_this.renderHTML();
                
                var container=$('.mt_poppanel');
                var $box = $('.box',container);
                $box.append('<div class="m-select"><ul><li class="mt_note">上下滚动选取</li><li></li></ul></div>');
                var $select=$box.find('.m-select');
                //初始化选项
                var str = '';
                for(var i in opts.value){
                    str+='<li data-value="'+i+'">'+opts.value[i]+'</li>';
                }
                str+='<li></li><li></li>';
                $select.find('ul').append(str);

                //初始化scroll
                var elHeight = itemHeight;
                var selectScroll = new IScroll('.m-select', {
                    snap : 'li',
                    probeType : 2,
                    tap : true
                });
                // selectScroll.on('scroll', function(){
                //     _this.updateSelected($select, this);
                // });
                selectScroll.on('scrollEnd', function(){
                    _this.updateSelected($select, this);
                });

                this.selectScroll = selectScroll;

                //初始化点击input事件
                // $target.on('tap', function(){
                //     if(container.hasClass('show')){
                //         _this.hidePanel();
                //     }
                //     else{
                //         _this.showPanel();
                //     }
                // });

                //初始化点击li
                // $select.find('li').on('tap', function(){
                //  _this.checkSelect($(this));
                // });

                //初始化点击事件
                $('.mt_ok', container).on('click', function(){
                    var $selected=$select.find('.selected');
                    _this.hidePanel();
                    opts.callback && typeof opts.callback=='function' && opts.callback({'name':$selected.text(),'value':$selected.attr('data-value')});
                });
                $('.mt_cancel', container).on('click', function(){
                    _this.hidePanel();
                    opts.cancel && typeof opts.cancel=='function' && opts.cancel();
                });
                $('.mt_mask').on('click', function(){
                    _this.hidePanel();
                });

                //初始化原有的数据
                _this.setValue();
                _this.showPanel();
			},
			renderHTML : function(){
				var stime = opts.timeStart + ':00';
				var etime = opts.timeStart + opts.timeNum + ':00';
				var html = '<div class="mt_mask"></div><div id="mSelect" class="mt_poppanel"><div class="mt_panel"><h3 class="mt_title">请选择选项</h3><div class="mt_body"><div class="box"></div><div class="mt_indicate"></div></div><div class="mt_confirm"><a href="javascript:void(0);" class="mt_ok">确定</a> <a href="javascript:void(0);" class="mt_cancel">取消</a></div></div></div>';
				$(document.body).append(html);
			},
			updateSelected : function(container, iscroll){
				var index = (-iscroll.y) / itemHeight + 2;
				var current = container.find('li').eq(index);
				current.addClass('selected').siblings().removeClass('selected');
			},
			showPanel : function(container){
				$('.mt_poppanel, .mt_mask').addClass('show');
			},
			hidePanel : function(){
				$('.mt_poppanel, .mt_mask').removeClass('show');
                setTimeout(function(){$('.mt_poppanel, .mt_mask').remove()},300);
			},
			setValue : function(){
				var value = opts.def;
                var item;
                if(value!=null && value!==''){
                    item = $('.m-select li[data-value="'+value+'"]');
                }else{
					item=$('.m-select li').eq(2);
                }
				this.checkSelect(item);
				this.updateSelected($('.m-select'),this.selectScroll);

			},
			checkSelect : function(el){
				if(el.size()==0)return;
				var target = el.prev('li').prev('li');
				if(target.size()>0)this.selectScroll.scrollToElement(target[0]);
			}
		}
		$(opts.target).on('click',function(){
            picker.init();
        })
	}
    module.exports={
        mSelect:mSelect
    }
});