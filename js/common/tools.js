// JavaScript Document

define('tools', function(require, exports, module) {
    require('jquery');
    //选项卡
    (function(a) {
        a.fn.tabs = function(cb) {
            this.each(function() {
                var $this=a(this);
                var tx=$this.data('autoinit');
                if(tx===false)return true;
                a(this).children(":eq(1)").children().hide().eq(0).show();
                if (a(this).find(".opt").size() == 1) {
                    var b = a(this).find(".opt").children()
                } else {
                    var b = a(this).children(":eq(0)").children();
                    if (b.size() < 1) {
                        return false
                    } else {
                        if (b.size() == 1) {
                            b = b.children()
                        }
                    }
                }
                b.each(function(c) {
                    a(this).click(function() {
                        a(this).parent().children().removeClass("select");
                        a(this).addClass("select");
                        var $con=a(this).parents(".tabs:first").children(":eq(1)").children().hide().eq(c);
                        $con.show()
                        if(a.isFunction(cb))cb(this,$con[0]);
                    })
                });
                if (a(this).attr("scroll") != "undefined") {}
            })
        };
        a(function() {
            a(".tabs").tabs();
            a('.tabs .opt').children('.select').click();
        })
    })($);
    //搜索value点击恢复初始
    $('.txt').bind({
        focus: function() {
            if (this.value == this.defaultValue) {
                this.value = "";
                $(this).addClass('txt_on');
            }
        },
        blur: function() {
            if (this.value == "") {
                this.value = this.defaultValue;
                $(this).removeClass('txt_on')
            }
        }
    });
    //年龄
    (function(a) {
        a.fn.age = function(d) {
            var b = "",
                c = "",
                d;
            this.each(function() {
                if (typeof d == "undefined") {
                    d = a(this).attr("def")
                }
                c = '<option value="">请选择</option>';
                for (i = 12; i < 120; i++) {
                    b = d == i ? "selected" : "";
                    c += '<option value="' + i + '" ' + b + " >" + i + "</option>"
                }
                a(this).empty().append(c)
            })
        };
        a(function() {
            a(".age").age()
        })
    })(jQuery);
    //星座
    (function(a) {
        a.fn.constellation = function(e) {
            var b = "",
                c = "",
                e, d = {
                    "121-219": "水瓶座",
                    "220-320": "双鱼座",
                    "321-420": "白羊座",
                    "421-521": "金牛座",
                    "522-621": "双子座",
                    "622-722": "巨蟹座",
                    "723-823": "狮子座",
                    "824-923": "处女座",
                    "924-1023": "天秤座",
                    "1024-1122": "天蝎座",
                    "1123-1221": "射手座",
                    "1222-120": "魔羯座"
                };
            this.each(function() {
                var f = a(this).attr("def");
                if (typeof e == "undefined") {
                    a.each(d, function(h, g) {
                        if (f == g) {
                            e = h
                        }
                    })
                }
                c = '<option value="">请选择</option>';
                a.each(d, function(h, g) {
                    b = e == h ? "selected" : "";
                    c += '<option value="' + g + '" ' + b + " >" + g + "</option>"
                });
                a(this).empty().append(c)
            })
        };
        a(function() {
            a(".constellation").constellation()
        })
    })(jQuery);
    //血型
    (function(a) {
        a.fn.blood = function(e) {
            var b = "",
                c = "",
                e, d = ["A型", "B型", "O型", "AB型", "其他"];
            this.each(function() {
                if (typeof e == "undefined") {
                    e = a(this).attr("def")
                }
                c = '<option value="">请选择</option>';
                for (i = 0; i < 5; i++) {
                    b = e == d[i] ? "selected" : "";
                    c += '<option value="' + d[i] + '" ' + b + " >" + d[i] + "</option>"
                }
                a(this).empty().append(c)
            })
        };
        a(function() {
            a(".blood").blood()
        })
    })(jQuery);
    //生肖
    (function(a) {
        a.fn.zodiac = function(e) {
            var b = "",
                c = "",
                e, d = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
            this.each(function() {
                if (typeof e == "undefined") {
                    e = a(this).attr("def")
                }
                c = '<option value="">请选择</option>';
                for (i = 0; i < d.length; i++) {
                    b = e == d[i] ? "selected" : "";
                    c += '<option value="' + d[i] + '" ' + b + " >" + d[i] + "</option>"
                }
                a(this).empty().append(c)
            })
        };
        a(function() {
            a(".zodiac").zodiac()
        })
    })(jQuery);
    //职业
    (function(a) {
        a.fn.profession = function(e) {
            var b = "",
                c = "",
                e, d = ["在校学生", "固定工作者", "自由职业者", "待业/无业/失业", "退休", "其他"];
            this.each(function() {
                if (typeof e == "undefined") {
                    e = a(this).attr("def")
                }
                c = '<option value="">请选择</option>';
                for (i = 0; i < 6; i++) {
                    b = e == d[i] ? "selected" : "";
                    c += '<option value="' + d[i] + '" ' + b + " >" + d[i] + "</option>"
                }
                a(this).empty().append(c)
            })
        };
        a(function() {
            a(".profession").profession()
        })
    })(jQuery);
    //学历
    (function(a) {
        a.fn.educational = function(e) {
            var b = "",
                c = "",
                e, d = ["小学以下", "初中", "高中", "中专", "大专", "本科", "研究生", "博士及以上"];
            this.each(function() {
                if (typeof e == "undefined") {
                    e = a(this).attr("def")
                };
                c = '<option value="">请选择</option>';
                for (i = 0; i < 8; i++) {
                    b = e == d[i] ? "selected" : "";
                    c += '<option value="' + d[i] + '" ' + b + " >" + d[i] + "</option>"
                }
                a(this).empty().append(c)
            })
        };
        a(function() {
            a(".educational").educational()
        })
    })(jQuery);
    // 分析url地址
    var parseUrl = function(url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function() {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length,
                        i = 0,
                        s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        }
        //字符串转换成json
    function strToJson(str) {
        var json = (new Function("return " + str))();
        return json;
    }
    //返回jquery对象
    var getJquery = function(a) {
            return (a instanceof jQuery) ? a : $(a);
        }
        //获取某个值
    function getVal(a) {
        var a = a || {};
        var defaults = {
            target: '',
            targetStr: '',
            content: 'data-content'
        }
        var opts = $.extend(defaults, a);
        if (!opts.targetStr) return;
        var arr = {
            '.': true,
            '#': true
        };
        var $target = getJquery(opts.target);
        var returnResult = {
            target: $target[0],
            targetStr: opts.targetStr,
            content: opts.content
        }
        if (!arr[opts.targetStr.toString().charAt(0)]) {
            opts.content = opts.targetStr.substring(1, opts.targetStr.length - 1);
        }
        returnResult.val = $target.attr(opts.content);
        return returnResult;
    }
    //获取当前页面某个参数
    var getCurParams = function(a, url) {
            if (!a) return;
            var url = parseUrl(url ? url : window.location.href);
            if (url.params[a]) return url.params[a];
            return undefined;
        }
    //获得当前页面的url
	var getCurUrl=function(a){
		var a=a||{};
		var defaults={
            url:window.location.href,
			remove:[]
		};
		var opts=$.extend(defaults,a);
        if(opts.isRemove)opts.remove=opts.isRemove;//兼容老的一些用法
		var url=parseUrl(opts.url);
		var tpl='/?';
		for(var i in url.params){
			if(!opts.isPage && i=='page')continue;
			if(opts.remove.length>0){
				var isContinue=false;
				for(var j=0;j<opts.remove.length;j++){
					if(opts.remove[j]==i)isContinue=true;
				}
				if(isContinue)continue;
			}
			tpl=tpl+i+'='+url.params[i]+'&';
		}
		if(tpl.charAt(tpl.length-1)=='&')tpl=tpl.substr(0,tpl.length-1);
		return tpl;
	}
        //中文下的逗号转换成英文下的逗号
    var convertComma = function(a) {
            var a = a || {};
            var defaults = {
                target: '.j-convertComma'
            };
            var opts = $.extend(defaults, a);
            var $target = getJquery(opts.target);
            $target.keyup(function() {
                var _this = $(this);
                var val = _this.val();
                val = val.replace(/，/ig, ',');
                _this.val(val);
            });
        }
        //分页js跳转
    var pageJump = function() {
        var jumpTxt = $('.pages .jump input');
        if (jumpTxt.size() > 0) {
            jumpTxt.on('keypress', function(event) {
                if (event.which == 13) {
                    window.location.href = getCurUrl({
                        remove: ['page']
                    }) + '&page=' + $(this).val();
                }
            });
        }
    }
    pageJump();
    //筛选多级联动name位置函数
    var beforeName = function(a) {
        var a = a || {};
        var defaults = {
            target: '.beforeName',
            name: '',
            isRequire: false
        }
        var opts = $.extend(defaults, a);
        var $target = $(opts.target);
        if (!opts.name) opts.name = $target.attr('name');
        if (!opts.name) return;
        var slt = $('select', $target);
        var length = slt.length;
        if (!length) return;
        var tmp = length - 1;
        $.each(slt, function(i, n) {
            var _this = $(n);
            _this.attr('name', '');
        });
        return setName();

        function setName() {
            var sltTmp = slt.eq(tmp);
            var val = sltTmp.val();
            if (!opts.isRequire) {
                if (tmp < 0) {
                    slt.eq(0).attr('name', opts.name);
                    return true;
                }
                if (val) {
                    sltTmp.attr('name', opts.name);
                    return sltTmp.val();
                } else {
                    tmp--;
                    return setName();
                }
            } else {
                if (tmp == 0 && !val) {
                    require.async('fnDialog', function(dialog) {
                        dialog.tips({
                            content: '分类最少选择一个'
                        });
                    })
                    return false;
                }
                if (sltTmp.find('option').size() > 1 && !val) {
                    require.async('fnDialog', function(dialog) {
                        dialog.tips({
                            content: '请选择最后一个分类'
                        });
                    })
                    return false;
                }
                if (val) {
                    sltTmp.attr('name', opts.name);
                    return true;
                } else {
                    tmp--;
                    return setName();
                }
            }
        }
    };
    //搜索条件
    var searchOrder = function(obj) {
        var searchform = $(obj);
        if (searchform.size() > 0) {
            searchform.delegate('[data-search]', 'click', function() {
                var _this = $(this);
                var order = _this.data('search'); //字段
                var val = _this.data('content'); //字段的值
                var type = _this.data('type'); //按照什么顺序排序的
                var tpl = getCurUrl({
                    remove: ['page', order]
                });
                if (!type) {
                    if (!_this.is('.sel')) {
                        tpl += '&' + order + '=' + val;
                    }
                } else {
                    if (!_this.is('.sel')) {
                        tpl += '&' + order + '=' + val + ' ' + type;
                    } else {
                        tpl += '&' + order + '=' + val;
                    }
                }
                window.location.href = tpl;
            });
            var typeObj = searchform.find('[data-search]');
            $.each(typeObj, function(i, n) {
                var _this = $(n);
                var search = _this.data('search');
                var content = _this.data('content');
                var type = _this.data('type');
                var val = getCurParams(search);
                if (!type) {
                    if (val && val == content) {
                        _this.addClass('sel');
                    }
                } else {
                    if (val && val.indexOf(content) != -1 && val.indexOf(type) != -1) {
                        _this.addClass('sel');
                    }
                }
            });
            searchform.submit(function() {
                beforeName();
                var _this = $(this);
                var ipt = _this.find('[datatype]');
                var tx = true;
                $.each(ipt, function(i, n) {
                    var _n = $(n);
                    if (_n.val() == '') {
                        tx = false;
                        _n.addClass('Validform_error');
                        return;
                    }
                })
                return tx;
            });
        }
    }
    searchOrder('form[name=searchform]');
    //排序相关
    var order = function(a) {
            var a = a || {};
            var defaults = {
                target: '[data-myorder]'
            };
            var opts = $.extend(defaults, a);
            $(document).delegate(opts.target, 'click', function() {
                var _this = $(this);
                var val = getVal({
                    target: _this,
                    targetStr: opts.target
                });
                var url = getCurUrl({
                    remove: ['page', val.val]
                });
                var order = getCurParams('order');
                url = url + '&order=' + val.val;
                if (order && order.indexOf('desc') != -1) {
                    url = url + '&order=' + val.val;
                } else {
                    url = url + '&order=' + val.val + ' desc';
                }
                window.location.href = url;
            })
            var $target = $(opts.target);
            $target.each(function() {
                var _this = $(this);
                var val = getVal({
                    target: _this,
                    targetStr: opts.target
                });
                var order = getCurParams('order');
                if (val.val && order && order.indexOf(val.val) != -1) {
                    if (order.indexOf('desc') != -1) {
                        _this.addClass('u-icon-order-down');
                    } else {
                        _this.addClass('u-icon-order-up');
                    }
                } else {
                    _this.addClass('u-icon-order');
                }
            });
        }
    //初始化链接
    var orderLink=function(a){
        var a=a||{};
        var defaults={
            target:'.j-orderLink'
        };
        var opts=$.extend(defaults,a);
        $(document).on('click',opts.target,function(event){
            event.preventDefault();
            var _this=$(this);
            var type=$.trim(_this.data('type'));
            if(!type)return;
            type=type.split('=');
            if(!type || !$.isArray(type) || type.length!=2)return;
            var url=getCurUrl({
                remove:['page',type[0]]
            });
            window.location.href=url+'&'+type.join('=');
        })
    }
        //全选、取消新图标
    var checkIcon = function(a) {
        var a = a || {};
        var defaults = {
            contain: 'body',
            btn: '.j-checkBtn',
            val: '.j-checkVal',
            change: function() {}
        };
        var opts = $.extend(defaults, a);
        //btn按钮
        $(document).on('click', opts.btn, function() {
            var $btn = $(this);
            var $parent = $btn.closest(opts.contain);
            var $val = $parent.find(opts.val);
            if (!$btn.hasClass('checked')) {
                $btn.addClass('checked fa-check-square').removeClass('fa-square-o');
                $val.addClass('checked fa-check-square').removeClass('fa-square-o');
            } else {
                $btn.removeClass('checked fa-check-square').addClass('fa-square-o');
                $val.removeClass('checked fa-check-square').addClass('fa-square-o');
            }
        });
        //val按钮
        $(document).on('click', opts.val, function() {
            var $this = $(this);
            var $parent = $this.closest(opts.contain);
            var $btn = $parent.find(opts.btn);
            if (!$this.hasClass('checked')) {
                $this.addClass('checked fa-check-square').removeClass('fa-square-o');
                var $val = $parent.find(opts.val);
                $val.each(function(i) {
                    //有一个没有选中
                    if (!$(this).hasClass('checked')) return false;
                    //当循环到最后一个的时候
                    if (i == ($val.size() - 1)) {
                        $btn.addClass('checked fa-check-square').removeClass('fa-square-o');
                    }
                });
            } else {
                $this.removeClass('checked fa-check-square').addClass('fa-square-o');
                $btn.removeClass('checked fa-check-square').addClass('fa-square-o');
            }
            opts.change($this);
        });
    };
    //获取真值新图标
    var checkIconVal = function(a) {
            var a = a || {};
            var defaults = {
                contain: 'body',
                val: '.j-checkVal',
                attr: 'data-value'
            };
            var opts = $.extend(defaults, a);
            var $val = $(opts.contain).find(opts.val + '.checked');
            var arr = [];
            $val.each(function() {
                arr.push($(this).attr(opts.attr));
            });
            return arr.join(',');
        }
        //全选、取消
    var checkSel = function(a) {
        var defaults = {
            contain: document,
            parent: '', //一个父级点击后响应里面的checkbox
            btn: '[data-check-btn]',
            val: '[data-check-val]',
            change: '',
            size: '2' //多选还是单选
        }
        var opts = $.extend(defaults, a);
        var contain = $(opts.contain);
        $.each(contain, function(i, n) {
            var doc = $(n);
            var parent = doc.find(opts.parent);
            var btn = doc.find(opts.btn);
            var box = doc.find(opts.val);
            if (opts.size == '1') {
                box.click(function() {
                    var _this = $(this);
                    box.not(_this[0]).prop('checked', false);
                    if ($.isFunction(opts.change)) opts.change(this);
                });
            } else {
                box.change(function() {
                    if (box.filter(':checked').size() == box.size()) {
                        btn.prop('checked', true);
                    } else {
                        btn.prop('checked', false);
                    }
                    if ($.isFunction(opts.change)) opts.change(this, box, btn);
                });
                btn.click(function() {
                    if (!$(this).prop('checked')) {
                        btn.prop('checked', false);
                        box.prop('checked', false);
                    } else {
                        btn.prop('checked', true);
                        box.prop('checked', true);
                    }
                    if ($.isFunction(opts.change)) opts.change(this, box, btn);
                });
            }
            parent.click(function(e) {
                var target = $(e.target);
                if (!target.is(opts.val)) {
                    target.closest(opts.parent).find(opts.val).click();
                }
            });
        });
    }
    checkSel();
    //返回全选的data-check-val的值
    var checkval = function(attr, obj) {
            var doc = $('body');
            if (obj) doc = $(obj);
            var prop = 'data-check-val';
            if (attr) prop = attr;
            var val = [];
            doc.find('[' + prop + ']:checked').each(function(i) {
                val.push($(this).attr(prop));
            });
            return val.join(',');
        }
        //返回全选的data-check-val的对象
    var checkObj = function(attr, obj) {
            var doc = $('body');
            if (obj) doc = $(obj);
            var prop = 'data-check-val';
            if (attr) prop = attr;
            var val = [];
            return doc.find('[' + prop + ']:checked');
        }
        //服务加入购物车
    var addServiceCart = function(a) {
            var a = a || {};
            var defaults = {
                target: '[data-serviceCart]',
                data: '',
                name: ['id', 'description'],
                url: '?m=service&c=cart&a=add',
                checkObj: 'data-check-val',
                before: '',
                success: ''
            }
            var opts = $.extend(defaults, a);
            $(document).delegate(opts.target, 'click', function() {
                var _this = $(this);
                var tx = true;
                if ($.isFunction(opts.before)) {
                    tx = opts.before(_this[0])
                }
                if (tx) {
                    require.async(['fnDialog', 'validForm', 'tools'], function(dialog, validForm, tools) {
                        var DATA;
                        if (opts.data) {
                            DATA = $.isFunction(opts.data) ? opts.data(_this[0]) : opts.data;
                        } else {
                            var obj;
                            if (!_this.data('check')) {
                                obj = _this
                            } else {
                                obj = tools.checkObj(opts.checkObj);
                            }
                            var data = {
                                products: []
                            };
                            $.each(obj, function(i, n) {
                                var $n = $(n);
                                var objTmp = {};
                                for (var j in opts.name) {
                                    objTmp[opts.name[j]] = $n.data(opts.name[j]);
                                }
                                objTmp['quantity'] = 1;
                                data.products.push(objTmp);
                            });
                            DATA = data;
                        }
                        if (DATA) {
                            validForm.request({
                                url: opts.url,
                                type: 'post',
                                data: DATA,
                                success: function(ret) {
                                    if ($.isFunction(opts.success)) {
                                        opts.success(ret, _this[0]);
                                    } else {
                                        dialog.tips({
                                            content: ret.info
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            })
        }
        //服务立即购买
    var serviceOrder = function(a) {
            var a = a || {};
            var defaults = {
                target: '[data-serviceOrder]',
                isAgreement: true,
                agreement: '.j-agreement',
                url: '?m=service&c=order&a=submit',
                before: '',
                name: ['id'],
                checkObj: 'data-check-val',
                data: '',
                success: ''
            };
            var opts = $.extend(defaults, a);
            $(document).delegate(opts.target, 'click', function() {
                var _this = $(this);
                var tx = true;
                var $agreement = $(opts.agreement);
                if ($agreement.size() > 0 && !$agreement.is(':checked') && opts.isAgreement) {
                    tx = false;
                    require.async('fnDialog', function(dialog) {
                        dialog.alert({
                            content: $agreement.parent().text() ? ('请先' + $agreement.parent().text()) : '请先同意服务条款'
                        });
                    })
                }
                if ($.isFunction(opts.before) && tx) {
                    tx = opts.before(_this[0])
                }
                if (tx) {
                    require.async(['fnDialog', 'validForm'], function(dialog, validForm) {
                        var DATA;
                        if (opts.data) {
                            DATA = $.isFunction(opts.data) ? opts.data(_this[0]) : opts.data;
                        } else {
                            var obj;
                            if (!_this.data('check')) {
                                obj = _this
                            } else {
                                obj = checkObj(opts.checkObj);
                            }
                            var data = {
                                products: []
                            };
                            $.each(obj, function(i, n) {
                                var $n = $(n);
                                var objTmp = {};
                                for (var j in opts.name) {
                                    objTmp[opts.name[j]] = $n.data(opts.name[j]);
                                }
                                objTmp['quantity'] = 1;
                                objTmp['checked'] = 'on';
                                data.products.push(objTmp);
                            });
                            DATA = data;
                        }
                        if (DATA) {
                            validForm.request({
                                url: opts.url,
                                type: 'POST',
                                data: DATA,
                                success: function(ret) {
                                    if ($.isFunction(opts.success)) {
                                        opts.success(ret, _this[0]);
                                    } else {
                                        if (ret.status) {
                                            location.href = ret.url;
                                        } else {
                                            dialog.alert({
                                                content: ret.info
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            })
        }
        //模板添加删除
    var addtpl = function(a) {
            var defaults = {
                contain: document,
                addbefore: '',
                addcallback: '',
                delcallback: ''
            }
            var opts = $.extend(defaults, a);
            $(opts.contain).delegate('[data-add]', 'click', function() {
                var _this = $(this).closest(opts.contain);
                var tpl = $('[data-tpl]', _this).html();
                var box = $('[data-box]', _this);
                var num = parseInt($(this).data('num'));
                var tpl = tpl.replace(/(_i_)/ig, num);
                if ($.isFunction(opts.addbefore)) tpl = opts.addbefore(this, tpl);
                box.append(tpl);
                $(this).data('num', num + 1);
                if ($.isFunction(opts.addcallback)) opts.addcallback(this, box[0]);
            });

            $(opts.contain).delegate('[data-del]', 'click', function() {
                var _this = $(this).closest('.j-tpl');
                _this.remove();
                if ($.isFunction(opts.delcallback)) opts.delcallback(this);
            });
        }
        //单页面弹窗修改内容
    var modifyDialog = function(a) {
            var defaults = {
                target: '[data-modify]',
                title: '修改',
                data: '',
                html: '',
                event: 'click',
                padding: '',
                before: function() {},
                onshow: '',
                callback: '',
                button: ''
            };
            var opts = $.extend(defaults, a);
            $(document).delegate(opts.target, opts.event, function() {
                var _this = $(this);
                var tx = true;
                if (opts.before(_this) == false) tx = false;
                var data = opts.data;
                if ($.isFunction(opts.data)) data = opts.data(_this[0]);
                if (tx) {
                    require.async(['fnDialog'], function(dialog) {
                        dialog.alert({
                            icon: false,
                            title: opts.title,
                            data: opts.data,
                            content: $.isFunction(opts.html) ? opts.html(_this[0]) : opts.html,
                            button: opts.button,
                            padding: opts.padding,
                            onshow: function(content, dia) {
                                if ($.isFunction(opts.onshow)) opts.onshow(_this[0], content, dia);
                            },
                            callback: function(content, dia) {
                                if ($.type(opts.callback) == 'function') {
                                    opts.callback(_this[0], content, dia);
                                }
                            }
                        });
                    });
                }
            });
        }
        //执行事件，选择连接
    var exeLink = function(a) {
            var a = a || {};
            var defaults = {
                target: '[data-link]',
                site: '',
                contain: document,
                onshow: function() {},
                callback: ''
            }
            var opts = $.extend(defaults, a);
            var tpl = '<select class="u-slt f-mr15"><option value="">请选择</option><option value="1">站内栏目</option><option value="2">常用链接</option><option value="3">功能连接</option></select><select class="u-slt"><option value="">请选择</option></select>';
            var site = opts.site;
            if (!site) {
                var sx = opts.target.substring(1, opts.target.length - 1);
                site = $(opts.target).attr(sx);
            }
            modifyDialog({
                target: opts.target,
                title: '选择链接',
                html: tpl,
                onshow: function(obj, content) {
                    require.async(['validForm', 'fnDialog'], function(validForm, dialog) {
                        var slt = $('select', $(content));
                        var slt0 = slt.eq(0);
                        var slt1 = slt.eq(1);
                        slt0.change(function() {
                            var val = $(this).val();
                            if (val == 1) {
                                validForm.request({
                                    url: '?m=site&c=category&a=index&id=' + opts.site,
                                    success: function(ret) {
                                        if (ret.status) {
                                            var tpl = '<option value="">请选择</option>';
                                            for (var i in ret['info']) {
                                                var str = '<option value="' + ret['info'][i]['url'] + '">' + ret['info'][i]['name'] + '</option>'
                                                tpl += str;
                                            }
                                            slt1.empty().append(tpl);
                                        } else {
                                            alert(ret.info);
                                        }
                                    }
                                });
                            } else if (val == 2) {
                                slt1.empty().append('<option value="?m=article&a=category">文章</option><option value="?m=photo&a=category">图片</option><option value="?m=information&a=category">供求</option><option value="?m=product&a=category">商品</option><option value="javascript:void(0);">空连接</option>');
                            } else if (val == 3) {
                                slt1.empty().append('<option value="javascript:yst.recharge();">充值卡</option><option value="javascript:yst.cardBinding();">购物卡</option><option value="javascript:yst.algorithm();">机制商品</option>');
                            }
                        });
                    });
                    opts.onshow(obj, content);
                },
                callback: function(obj, content, dia) {
                    var val = $('select', $(content)).eq(1).val();
                    if ($.type(opts.callback) == 'function') {
                        opts.callback(val, obj)
                    } else {
                        var parent = $(obj).closest(opts.contain);
                        var valObj = $('[data-link-val]', parent);
                        $.each(valObj, function(i, n) {
                            var _this = $(n);
                            var tag = n.nodeName.toLowerCase();
                            if (tag == 'a') _this.attr('href', val);
                            if (tag == 'input') _this.val(val);
                            if (tag == 'img') _this.attr('src', val);
                        });
                    }
                    dia.close(true).remove();
                }
            });
        }
        //上传函数封装
    var upload = function(a) {
        require.async(['fnDialog'], function(dialog) {
            var defaults = {
                target: '[data-upload]',
                contain: '',
                before: '',
                success: '',
                size: 1,
                type: 'image',
                url: '',
                isadmin: '0',
                isProduct: false,
                callback: '' //绑定之后再回调
            };
            var url;
            var opts = $.extend(defaults, a);
            if (opts.type == 'image') {
                url = '?m=attachment&c=images&a=dialog';
            } else if (opts.type = 'file') {
                url = '?m=attachment&c=attachment&a=dialog';
            } else {
                alert('选择的"type"类型不对');
            }
            if (url && opts.target) {
                $(document).delegate(opts.target, 'click', function() {
                    var _this = this;
                    var _url = url;
                    var sx = opts.target.substring(1, opts.target.length - 1);
                    if ($(_this).attr(sx) == 'file') _url = '?m=attachment&c=attachment&a=dialog';
                    if ($(_this).attr(sx) == 'image') _url = '?m=attachment&c=images&a=dialog';
                    if (opts.isadmin != '0') _url += '&isadmin=1';
                    dialog.get({
                        url: _url,
                        data: {
                            'size': opts.size,
                            'url': opts.url,
                            'before': opts.before,
                            'isadmin': opts.isadmin,
                            'isProduct': opts.isProduct
                        },
                        callback: function(ret) {
                            if ($.type(opts.success) == 'function') {
                                opts.success(ret, _this)
                            } else {
                                var parent;
                                if (opts.contain != '') {
                                    parent = $(_this).closest(opts.contain);
                                } else {
                                    parent = $(_this).parent();
                                }
                                var val = $('[data-upload-val]', parent);
                                $.each(val, function(i, n) {
                                    var _this = $(n);
                                    var attr=_this.attr('data-upload-val');
                                    if(!attr)attr='filepath';
                                    var tag = n.nodeName.toLowerCase();
                                    if (tag == 'a') _this.attr('href', ret[0][attr]);
                                    if (tag == 'input') _this.val(ret[0][attr]);
                                    if (tag == 'img') _this.attr('src', ret[0][attr]);
                                });
                                if ($.isFunction(opts.callback)) {
                                    opts.callback(ret, _this);
                                }
                            }
                        }
                    });
                });
            }
        });
    }
    var del = function(a) {
        var defaults = {
            chackIcon: false, //是否是图标选择
            target: '[data-del]',
            checkval: 'data-check-val',
            before: '',
            success: '',
            url: '',
            content: '',
            check: 0
        }
        var opts = $.extend(defaults, a);
        $(document).delegate(opts.target, 'click', function() {
            var _this = $(this);
            var tr = true;
            if ($.type(opts.before) == 'function' && opts.before(this, opts) == false) tr = false;
            var sx = opts.target.substring(1, opts.target.length - 1);
            var url = opts.url ? opts.url : _this.attr(sx);
            if (!url) url = window.location.href;
            if (_this.data('check')) {
                if (!opts.chackIcon) {
                    url += checkval(opts.checkval);
                } else {
                    url += checkIconVal();
                }
            }
            if (_this.data('content')) opts.content = _this.data('content');
            if (tr) {
                require.async(['fnDialog', 'validForm'], function(dialog, validForm) {
                    validForm.confirm({
                        content: opts.content,
                        url: url,
                        success: function(ret) {
                            if ($.type(opts.success) == 'function') {
                                opts.success(ret, _this[0])
                            } else {
                                if (ret.status) {
                                    dialog.tips({
                                        content: ret.info,
                                        callback: function() {
                                            location.reload();
                                        }
                                    })
                                } else {
                                    dialog.tips({
                                        content: ret.info,
                                        time: 2500
                                    });
                                }
                            };
                        }
                    });
                });
            }
        });
    }
    var ajax = function(a) {
        var defaults = {
            target: '[data-ajax]',
            isLogin: false,
            isLoginReload: false,
            alert: false,
            ajaxContent: '',
            before: '',
            success: '',
            url: '',
            time: ''
        }
        var opts = $.extend(defaults, a);
        $(document).delegate(opts.target, 'click', function() {
            var _this = $(this);
            var tr = true;
            if (_this.data('isClick')) return;
            _this.data('isClick', true);
            if (_this.data('ajaxcontent')) opts.ajaxContent = _this.data('ajaxcontent');
            if (opts.ajaxContent) {
                _this.data('default', _this.text());
                _this.text(opts.ajaxContent);
            }
            if (opts.isLogin) {
                require.async(['box'], function(box) {
                    if (!box.isLogin()) {
                        tr = false;
                        box.getLogin({
                            onclose: function() {
                                _this.data('isClick', false);
                            },
                            callback: function() {
                                if (opts.isLoginReload) {
                                    window.location.reload();
                                }
                            }
                        });
                    }
                    callback();
                });
            } else {
                callback();
            }

            function callback() {
                if ($.type(opts.before) == 'function' && opts.before(_this[0], opts) == 'false') tr = false;
                var sx = opts.target.substring(1, opts.target.length - 1);
                var url = opts.url ? opts.url : _this.attr(sx);
                if (_this.data('check')) url += checkval();
                if (_this.data('alert') == true) opts.alert = true;
                if (tr) {
                    require.async(['fnDialog', 'validForm'], function(dialog, validForm) {
                        validForm.request({
                            url: url,
                            success: function(ret) {
                                if (opts.ajaxContent) _this.text(_this.data('default'));
                                _this.data('isClick', false);
                                var time = '';
                                if (!ret.status) time = 2500;
                                if (opts.time) time = opts.time;
                                if ($.type(opts.success) == 'function') {
                                    opts.success(ret, _this[0])
                                } else {
                                    if (!opts.alert) {
                                        dialog.tips({
                                            content: ret.info,
                                            callback: function() {
                                                if (ret.status) location.reload();
                                            },
                                            time: time
                                        });
                                    } else {
                                        dialog.alert({
                                            content: ret.info,
                                            callback: function(content, d) {
                                                if (ret.status) {
                                                    location.reload();
                                                } else {
                                                    d.close().remove();
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    });
                } else {
                    if (opts.ajaxContent) _this.text(_this.data('default'));
                }
            }
        });
    }
    var get = function(a) {
            var defaults = {
                target: '[data-get]',
                isLogin: false,
                isLoginReload: false,
                contain: document,
                before: '',
                click: '',
                callback: '',
                url: '',
                data: ''
            }
            var opts = $.extend(defaults, a);
            $(opts.contain).delegate(opts.target, 'click', function() {
                var tr = true;
                var _this = $(this);
                if (opts.isLogin) {
                    require.async(['box'], function(box) {
                        if (!box.isLogin()) {
                            tr = false;
                            box.getLogin({
                                callback: function() {
                                    if (opts.isLoginReload) {
                                        window.location.reload();
                                    }
                                }
                            });
                        }
                        if (opts.click && $.isFunction(opts.click)) opts.click(_this[0], opts);
                        if (!tr) return;
                        callback();
                    });
                } else {
                    if (opts.click && $.isFunction(opts.click)) opts.click(_this[0], opts);
                    callback();
                }

                function callback() {
                    var tx = _this.attr('data-get-tx') //防止重复委托点击事件重复出现弹窗
                    if (tx == '1') tr = false;
                    if ($.type(opts.before) == 'function' && opts.before(_this[0], opts) === false) tr = false;
                    var sx = opts.target.substring(1, opts.target.length - 1);
                    var url = opts.url ? opts.url : _this.attr(sx);
                    if (_this.data('check')) url += checkval();
                    if (tr) {
                        _this.attr('data-get-tx', 1);
                        var data = opts.data;
                        if (opts.data && $.isFunction(opts.data)) data = opts.data(_this[0]);
                        require.async(['fnDialog'], function(dialog) {
                            dialog.get({
                                url: url,
                                data: data,
                                callback: function(val) {
                                    if ($.type(opts.callback) == 'function') {
                                        opts.callback(val, _this[0])
                                    } else {
                                        if (eval(val)) location.reload();
                                    }
                                },
                                onclose: function() {
                                    _this.attr('data-get-tx', 0);
                                }
                            });
                        });
                    }
                }
            });
        }
        //初始化select
    var sltajax = function(a) {
        if(!(this instanceof sltajax)){
            return new sltajax(a);
        }
        var a = a || {};
        var defaults = {
            target: '[data-slt]',
            val: 'id', //是否重新加载
            change: '', //重新加载之后的函数
            content: '', //内部加载之前加载一段html
            url: '',
            contain: document,
            def: ''
        };
        var opts = $.extend(defaults, a);
        var that=this;
        var data = '';
        that.init=function(){
            $(opts.target, opts.contain).each(function() {
                var _this = $(this);
                // var tx = _this.attr('data-slt-tx'); //为了防止重复
                // if (tx || tx == '0') {
                    var val=getVal({
                        target:_this,
                        targetStr:opts.target
                    });
                    // var sx = opts.target.substring(1, opts.target.length - 1);
                    // var url = opts.url ? opts.url : $(this).attr(sx);
                    var url=val.val?val.val:opts.url;
                    var attr = $.trim(_this.attr('data-slt-attr'));
                    var arr =attr? attr.split(','):[];
                    var def = opts.def;
                    if ($(this).attr('data-slt-def')) def = $(this).attr('data-slt-def');
                    arr = $.grep(arr, function(i, n) {
                        return n != '';
                    }, true);
                    var tpl = '';
                    require.async(['validForm'], function(validForm) {
                        validForm.request({
                            url: url,
                            async: false,
                            isJson: true,
                            success: function(ret) {
                                data = ret;
                                var info = ret.info;
                                if ($.type(info) == 'object') info = info.infos;
                                for (var i = 0, n = info.length; i < n; i++) {
                                    var st = '';
                                    var selected = '';
                                    if (def == info[i].id) selected = 'selected';
                                    if (arr.length > 0) {
                                        for (var j = 0; j < arr.length; j++) {
                                            st += ' data-' + arr[j] + '="' + info[i][arr[j]] + '"';
                                        }
                                    }
                                    tpl += '<option ' + st + ' value="' + info[i][opts.val] + '" ' + selected + '>' + info[i].name + '</option>';
                                }
                                _this.html(opts.content + tpl);
                                // _this.attr('data-slt-tx', 1); //为了防止重复
                                if ($.isFunction(opts.change)) {
                                    // _this.change(function() {
                                    //     opts.change(_this, data);
                                    // }).change();
                                    _this.off('.clickFn');
                                    _this.on('click.clickFn',function(){
                                        opts.change(_this, data);
                                    }).trigger('click');
                                }
                            }
                        });
                    });
                // }
            });
        };
        that.init();
        return that;
    };
    //select切换div显示隐藏
    var switchSlt = function(a) {
            var a = a || {};
            var defaults = {
                target: '[data-switchSlt=btn]',
                isRemove: false,
                box: '[data-switchSlt=box]',
                change: function() {},
                contain: document //父对象
            }
            var opts = $.extend(defaults, a);
            var contain = $(opts.contain);
            var target = $(opts.target, contain);
            $.each(target, function(i, n) {
                var _this = $(n);
                var parent = _this.closest(opts.contain);
                var box = $(opts.box, parent);
                var children = box.children();
                var clone = children.clone(true, true);
                _this.change(function() {
                    var index = _this.find('option:selected').index();
                    if (opts.isRemove) {
                        box.html('');
                        box.append(clone.eq(index).clone(true, true).show());
                    } else {
                        children.hide();
                        children.eq(index).show();
                    }
                    opts.change(_this[0]);
                });
                _this.trigger('change');
            })
        }
        //select搜索
    var sltSearch = function(a) {
        var a = a || {};
        var defaults = {
            txt: ".j-sltSearchTxt",
            slt: '.j-sltSearch',
            parent: '.j-sltSearchParent'
        };
        var opts = $.extend(defaults, a);
        var $txt = $(opts.txt);
        $.each($txt, function() {
            var _this = $(this);
            var $parent = _this.closest(opts.parent);
            var $slt = $parent.find(opts.slt);
            var $option = $slt.find('option');
            var arr = [];
            $.each($option, function() {
                arr.push({
                    'val': $(this).attr('value'),
                    'txt': $(this).text()
                });
            });
            _this.keyup(function() {
                var val = _this.val();
                var tpl = '';
                for (var i = 0, n = arr.length; i < n; i++) {
                    if (arr[i].txt.indexOf(val) != -1) {
                        tpl += '<option value="' + arr[i].val + '">' + arr[i].txt + '</option>';
                    }
                }
                $slt.html(tpl);
            });
        });
    }

    //radio切换div显示隐藏
    var switchRadio = function(a) {
            var a = a || {};
            var defaults = {
                target: '[data-switchRadio]',
                box: '[data-switchRadio=box]',
                size: 1, //当是2的时候是切换box的children
                isRemove: false,
                change: '',
                contain: document //父对象
            }
            var opts = $.extend(defaults, a);
            var contain = $(opts.contain);
            $.each(contain, function(i, n) {
                var $n = $(n);
                var switchBtn = $(opts.target, $n);
                var target = switchBtn.filter('input:radio');
                var box = switchBtn.filter(opts.box);
                if (opts.size == 1) {
                    var attr = opts.target.substring(1, opts.target.length - 1);
                    target.change(function() {
                        var _this = target.filter(':checked');
                        var con = _this.attr(attr);
                        if (con == 'on') {
                            box.show();
                        } else {
                            box.hide();
                        }
                    }).change();
                } else {
                    var children = box.children();
                    var clone = children.clone();
                    target.change(function() {
                        var _this = target.filter(':checked');
                        if (_this.size() > 0) {
                            var index = target.index(_this);
                            // console.log(target);
                            if (_this.data('index')) index = _this.data('index');
                            // console.log(index);
                            if (opts.isRemove) {
                                box.html('');
                                box.append(clone.eq(index).clone(true).show());
                            } else {
                                children.hide().eq(index).show();
                            }
                            if ($.isFunction(opts.change)) opts.change($n[0], box[0]);
                        }
                    }).change();
                }
            })
        }
        //checkbox切换div显示隐藏
    var switchCheckbox = function(a) {
        var a = a || {};
        var defaults = {
            target: '[data-switchCheckbox]',
            box: '[data-switchCheckbox=box]',
            isRemove: false,
            change: '',
            size: 1,
            contain: document //父对象
        }
        var opts = $.extend(defaults, a);
        var contain = $(opts.contain);
        $.each(contain, function(i, n) {
            var switchBtn = $(opts.target, $(n));
            var target = switchBtn.filter('input:checkbox');
            var btns=switchBtn.filter(function(index){
                return !$(this).is(opts.box);
            });
            var box = switchBtn.filter(opts.box);
            var boxClone=box.clone(true);
            if(opts.isRemove){
                box.html('');
            }
            target.change(function() {
                var _this = $(this);
                if (opts.size == 1) {
                    if (_this.is(':checked')) {
                        box.show();
                    } else {
                        box.hide();
                    }
                } else {
                    var index = btns.index(_this);
                    var children=box.children().eq(index);
                    if (_this.is(':checked')) {
                        if(opts.isRemove){
                            box.append(boxClone.children().eq(index).attr('data-index',index).clone(true).show());
                        }else{
                            box.children().eq(index).show();
                        }
                    } else {
                        if(opts.isRemove){
                            box.children('[data-index='+index+']').remove();
                        }else{
                            box.children().eq(index).hide();
                        }
                    }
                }
                if ($.isFunction(opts.change)) opts.change(_this[0]);
            }).change();
        })
    }

    //表单修改时返回true
    function changeForm() {
        if (!(this instanceof changeForm)) {
            return new changeForm();
        }
        var $target = $('[data-changeform]');
        var obj = {}
        this.set = function() {
            $.each($target, function() {
                var _this = $(this);
                var key = _this.data('changeform');
                obj[key] = _this.val();
            });
            // console.log(obj);
        }
        this.get = function() {
            var tx = false;//当data-changeform=true的dom没变动返回true
            var tmp = false;//当data-changeform!=true的dom变动的时候返回true
            $.each($target, function() {
                var _this = $(this);
                var key = _this.data('changeform');
                if (key != 'true' && obj[key] != _this.val()) {
                    tmp = true;
                    return false;
                }
            });
            if (tmp) {
                if ($target.filter('[data-changeform=true]').val() == obj['true']) {
                    tx = true;
                }
            }
            return tx;
        }
        return this;
    }

    //弹窗选择会员
    var choose = function(a) {
            var a = a || {};
            var defaults = {
                target: '[data-choose]',
                contain: document, //父对象
                wrap: document, //最外层的对象,主要用在跨框架用。
                url: '?m=common&c=dialog&a=choose_member',
                click: '',
                callback: '',
                status: 'member',
                size: '1'
            }
            var opts = $.extend(defaults, a);
            if (!$.isFunction(opts.callback)) {
                opts.callback = function(val, obj) {
                    var parent;
                    var wrap;
                    if (opts.wrap instanceof jQuery) {
                        wrap = opts.target;
                    } else {
                        wrap = $(opts.target);
                    }
                    if (wrap.is(obj)) {
                        parent = $(obj).closest(opts.contain);
                    } else {
                        parent = opts.wrap;
                    }
                    var chooseval = $('[data-choose-val]', parent);
                    $.each(chooseval, function(i, n) {
                        var _this = $(n);
                        var attr = _this.attr('data-choose-val');
                        var arr = [];
                        for (var i in val) {
                            var tmp=attr;
                            //单独处理nickname和realname的值
                            if(attr=='realname' || attr=='nickname'){
                                if(val[i]['realname'] && attr=='realname'){
                                    tmp='realname';
                                }else if(val[i]['nickname'] && attr=='realname'){
                                    tmp='nickname';
                                }else if(val[i]['nickname'] && attr=='nickname'){
                                    tmp='realname';
                                }else if(val[i]['realname'] && attr=='nickname'){
                                    tmp='nickname';
                                }else if(val[i]['account']){
                                    tmp='account';
                                }else if(val[i]['id']){
                                    tmp='id';
                                }
                            }
                            arr.push(val[i][tmp]);
                        }
                        if (n.nodeName == 'INPUT') {
                            _this.val(arr.join(','));
                            $(obj).data('defaultsel',arr.join(','));
                        } else {
                            _this.html(arr.join(','));
                        }
                    })
                }
            }
            get({
                target: opts.target,
                before: function(obj, parames) {
                    var $target = $(obj);
                    var url = $target.data('url');
                    if (url) {
                        parames.data.url = url;
                    } else {
                        if (opts.status == 'admin') parames.data.url = '?m=common&c=dialog&a=admin_choose_member';
                        if (opts.status == 'product') parames.data.url = '?m=common&c=dialog&a=choose_product';
                    }
                    //默认值
                    var defaultSel=$target.data('defaultsel');
                    if(defaultSel)defaultSel=(defaultSel+'').split(',');
                    parames.data.defaultSel=defaultSel;
                    return true;
                },
                url: '?m=common&c=dialog&a=index',
                click: opts.click,
                callback: opts.callback,
                data: {
                    size: opts.size,
                    url: opts.url,
                    status: opts.status
                },
                contain: opts.wrap
            });
        }
        //判断是否打开了完善信息
    var openInfo = function(a) {
            if (!(this instanceof openInfo)) {
                return new openInfo(a);
            }
            var defaults = {
                isAlert: true
            };
            var opts = $.extend(defaults, a);
            var _this = this;
            _this.certification = function(member, info) {
                require.async(['validForm', 'fnDialog', 'member/member/newtabs'], function(validForm, dialog, newtabs) {
                    var str = '';
                    var tmp = '';
                    var url = '';
                    _this.isStatus = true;
                    if (member.isemail && member.isemail == '1' && !isTrue(info.isemail)) {
                        tmp += '认证邮箱、';
                        url = '?m=member&c=account&a=verify_email';
                        _this.isStatus = false;
                    }
                    if (member.ismobile && member.ismobile == '1' && !isTrue(info.ismobile)) {
                        tmp += '认证手机、';
                        if (!url) url = '?m=member&c=account&a=verify_mobile';
                        _this.isStatus = false;
                    }
                    if (member.isauth && member.isauth == '1' && !isTrue(info.isidcard)) {
                        tmp += '认证身份、';
                        if (!url) url = '?m=member&c=account&a=verify_card';
                        _this.isStatus = false;
                    }
                    // if (member.isgroupid && member.isgroupid == '1' && !isTrue(info.groupid)) {
                    //     tmp += '认证vip会员、';
                    //     var topBody=$(window.top.document).find('.j-member-body');
                    //     var is_yst=topBody.attr('is_yst');
                    //     if (!url){
                    //         if(is_yst=='1'){
                    //             url = '?m=service&c=vip&a=buy';
                    //         }else{
                    //             url = '?m=algorithm&c=index&a=index';
                    //         }
                    //     }
                    //     _this.isStatus = false;
                    // }
                    //判断是否为真
                    function isTrue(a) {
                        if (!a) return false;
                        if (a == '0') return false;
                        if (a == '') return false;
                        return true;
                    }
                    _this.alert = function(b) {
                        tmp = tmp.substring(0, tmp.length - 1);
                        str = '您还没有完善信息（' + tmp + '），建议先去完善信息';
                        dialog.alert({
                            cancel:false,
                            content: str,
                            callback: function(content, dia) {
                                newtabs.newtabs('账户管理', url);
                                dia.close(true).remove();
                            },
                            close: function(content, val) {
                                if (!val && b && b.close && $.isFunction(b.close)) {
                                    b.close();
                                }
                            }
                        });
                    }
                    if ($.isFunction(_this.callback)) _this.callback(_this);
                    if (!_this.isStatus && opts.isAlert) {
                        _this.alert();
                    }
                });
            }
            _this.init = function() {
                require.async(['validForm', 'fnDialog', 'wbmc'], function(validForm, dialog, wbmc) {
                    validForm.request({
                        url: '?m=member&c=index&a=getconfig',
                        success: function(re) {
                            if (re.status && re.info) {
                                var member = re.info.member;
                                if (member && member.addinfo == '1') {
                                    validForm.request({
                                        url: '?m=member&c=index&a=getinfo&expand=true',
                                        success: function(ret) {
                                            var info = ret.info;
                                            var str='';
                                            if(member.isname=='1'){
                                                if(!info.realname){
                                                    //个人
                                                    str+='<tr><th width="80">姓名：</th><td><input type="text" class="u-txt" name="par[realname]" datatype="*" /></td></tr>';
                                                }
                                            }
                                            if(member.isphone=='1'){
                                                if(!info.mobile){
                                                    //个人
                                                    str+='<tr><th>手机：</th><td><input type="text" class="u-txt" name="par[mobile]" datatype="m"/>';
                                                }
                                            }
                                            if(member.isarea=='1'){
                                                if(!info.county){
                                                    //个人
                                                    str+='<tr><th>所在地：</th><td><input type="hidden" name="par[area]" class="j-area"><select class="u-slt f-mr10" id="LP" name="par[province]"></select><select class="u-slt f-mr10" id="LC" name="par[city]"></select><select class="u-slt slt2" id="LA" name="par[county]" datatype="*"></select></td></tr>';
                                                }
                                            }
                                            if(str){
                                                dialog.alert({
                                                    icon: false,
                                                    title: '完善信息',
                                                    cancel:false,
                                                    content: '<div class="m-tabform" style="width:500px;"><form action=""><table><thead><tr><th width="80"></th><th></th></tr></thead><tbody>'+str+'</tbody></table></form></div>',
                                                    onshow: function(content, dia) {
                                                        var $content=$(content);
                                                        var $area=$content.find('.j-area');
                                                        wbmc({
                                                            name: 'area',
                                                            root: 1,
                                                            val: 'name',
                                                            oid: ['#LP', '#LC', '#LA'],
                                                            change:function(obj,area){
                                                                var $obj=$(obj);
                                                                if($obj.attr('id')=='LA'){
                                                                    var id=$obj.find('option:selected').attr('id');
                                                                    $area.val(id);
                                                                }
                                                            }
                                                        });
                                                        validForm.form({
                                                            target: $(content).find('form')[0],
                                                            url: '?m=member&c=account',
                                                            success: function(ree) {
                                                                if (ree.status) {
                                                                    dialog.tips({
                                                                        content: ree.info,
                                                                        callback: function() {
                                                                            dia.close().remove();
                                                                            _this.certification(member, info);
                                                                        }
                                                                    });
                                                                } else {
                                                                    dialog.tips({
                                                                        content: ree.info
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    },
                                                    callback: function(content, dia) {
                                                        $(content).find('form').submit();
                                                    }
                                                });
                                            }else{
                                                _this.certification(member, info);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    });
                })
            };
            _this.init();
            return _this;
        }
        //上锁
    var lock = function(a) {
            var defaults = {
                target: '[data-lock]',
                contain: document,
                box: '#container',
                onshow: function() {},
                success: function() {}
            }
            var opts = $.extend(defaults, a);
            $(opts.contain).delegate(opts.target, 'click', function() {
                require.async(['validForm', 'fnDialog'], function(validForm, dialog) {
                    dialog.alert({
                        title: '锁屏',
                        content: '<form action="?m=member&c=index&a=lock_screen" id="form_lock"><p class="f-mb10 s-gray f-fs12">请使用登陆密码解锁。</p><input type="password" class="u-txt" size="30" name="password"></form>',
                        showModal: false,
                        cancel: function() {
                            return false;
                        },
                        onshow: function(content, dia) {
                            opts.onshow();
                            var container = $(window.parent.document).find(opts.box);
                            container.hide();
                            validForm.request({
                                url: '?m=member&c=index&a=lock_screen'
                            });
                            validForm.form({
                                target: $('#form_lock', content),
                                success: function(ret) {
                                    if (ret.status) {
                                        opts.success();
                                        container.show();
                                        dia.close(true).remove();
                                    } else {
                                        dialog.tips({
                                            content: ret.info
                                        })
                                    }
                                }
                            });
                        },
                        callback: function(content, dia) {
                            $('form', content).submit();
                        }
                    });
                });
            })
        }
        //序列化
    var serialize = function(obj) {
        if (!obj) return '';
        switch (obj.constructor) {
            case Object:
                var str = "{";
                for (var o in obj) {
                    str += o + ":" + serialize(obj[o]) + ",";
                }
                if (str.substr(str.length - 1) == ",")
                    str = str.substr(0, str.length - 1);
                return str + "}";
                break;
            case Array:
                var str = "[";
                for (var o in obj) {
                    str += serialize(obj[o]) + ",";
                }
                if (str.substr(str.length - 1) == ",")
                    str = str.substr(0, str.length - 1);
                return str + "]";
                break;
            case Boolean:
                return "\"" + obj.toString() + "\"";
                break;
            case Date:
                return "\"" + obj.toString() + "\"";
                break;
            case Function:
                break;
            case Number:
                return "\"" + obj.toString() + "\"";
                break;
            case String:
                return "\"" + obj.toString() + "\"";
                break;
        }
    }

    //div编辑器初始化
    var divEditor = function() {
        var _this = $('[contenteditable=true]')[0];
        var EditDiv = {
            focus: false //确定当前焦点在编辑框内
        };
        //判断浏览器
        var browser = {};
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            browser.name = 'MSIE';
            browser.ie = true;
        } else if (navigator.userAgent.indexOf("Firefox") > 0) {
            browser.name = 'Firefox';
            browser.firefox = true;
        } else if (navigator.userAgent.indexOf("Chrome") > 0) {
            browser.name = 'Chrome';
            browser.chrome = true;
        } else if (navigator.userAgent.indexOf("Safari") > 0) {
            browser.name = 'Safari';
            browser.safari = true;
        } else if (navigator.userAgent.indexOf("Opera") >= 0) {
            browser.name = 'Opera';
            browser.opera = true;
        } else {
            browser.name = 'unknow';
        }
        _this.onpaste = function(e) {
            _this = this;
            setTimeout(function() {
                var val = _this.innerHTML;
                val = val.replace(/<(?!br).*?>/ig, "");
                _this.innerHTML = val;
            }, 0);
        }
        _this.onfocus = function(e) {
            EditDiv.focus = true;
        }
        _this.onblur = function(e) {
            EditDiv.focus = false;
        }
        _this.onkeydown = function(e) {
                var ev = e || window.event;
                var key = ev.keyCode || ev.charCode;
                var sel, rang, br, fixbr, node, inner, tempRange, offset;
                if (key == 13) {
                    if (ev.preventDefault) {
                        ev.preventDefault();
                    } else {
                        ev.returnValue = false;
                    }
                    if (window.getSelection) {
                        if (EditDiv.focus === false) {
                            return false;
                        }
                        br = document.createElement('br');
                        sel = window.getSelection();
                        rang = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
                        if (rang === null) {
                            return false;
                        }
                        rang.deleteContents();
                        node = sel.focusNode;
                        inner = false;
                        while (node.parentNode != document.documentElement) { //確定focusNode是否在編輯框內
                            if (node === this) {
                                inner = true;
                                break;
                            } else {
                                node = node.parentNode;
                            }
                        }
                        if (inner) {
                            if (browser.chrome || browser.safari || browser.firefox) { //chrome、safari內，尾部換行時多添加一個<br type='_moz'>
                                tempRange = rang.cloneRange();
                                tempRange.selectNodeContents(this);
                                tempRange.setEnd(rang.endContainer, rang.endOffset);
                                offset = tempRange.toString().length;
                                if (offset == this.textContent.length && this.querySelectorAll("#edit-div br[type='_moz']").length == 0) { //在行尾且不存在<br type='_moz'>時
                                    fixbr = br.cloneNode();
                                    fixbr.setAttribute('type', '_moz');
                                    rang.insertNode(fixbr);
                                }
                            }
                            rang.insertNode(br);
                        }
                        if (document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("Range", "2.0")) {
                            tempRange = document.createRange();
                            tempRange.selectNodeContents(this);
                            tempRange.setStart(rang.endContainer, rang.endOffset);
                            tempRange.setEnd(rang.endContainer, rang.endOffset);
                            sel.removeAllRanges();
                            sel.addRange(tempRange);
                        }
                    } else {
                        rang = document.selection.createRange();
                        if (rang === null) {
                            return false;
                        }
                        rang.collapse(false)
                        rang.pasteHTML('<br>');
                        rang.select();
                    }
                }
            }
            //查看html片斷
        function preview() {
            var htmls = document.getElementById('edit-div').innerHTML;
            if (htmls) {
                htmls = '<div style="margin:0;padding:0;background:#bbb;">' + htmls + '<\/div>';
                var view = window.open('about:blank', 'view');
                view.document.open();
                view.document.write(htmls);
                view.document.close();
            }
        }
    }
    var autofill = function(a) {
        var a = a || {};
        var defaults = {
            url: '',
            width: '', //滚动宽度
            target: '.j-autofill',
            minLength: 2, //最小多少个字符触发
            limit: 12, //每次请求多少个字符
            formatItem: '', //格式化每一样的内容
            formatResult: '', //最后输出的结果
            scrollHeight: 300, //出现滚动条的最大高度
            change: ''
        };
        var opts = $.extend(defaults, a);
        var $tpl = $('<div class="m-autofill"></div>');
        $('body').append($tpl);
        $(opts.target).each(function() {
            //得到文本框对象
            var wordInput = $(this);
            //定义全局变量
            var highlightindex = -1; //表示高亮的节点
            var timeoutId; //表示延時向服务器发送请的时间

            wordInput.attr('autocomplete', 'off'); //关闭自动填写

            wordInput.change(function() {
                if ($.isFunction(opts.change)) opts.change(wordInput);
            });

            //给文本框添加键盘按下并弹起的事件
            wordInput.keyup(function(event) {
                //得到文本框距离屏幕左边距和上边的距离
                var wordInputOffset = wordInput.offset();
                //自动补全框最开始隐藏起来
                //添加样式必须现价 css("position","absolute")属性
                $tpl.css("top", wordInputOffset.top + wordInput.outerHeight() + "px").css("left", wordInputOffset.left + "px").width(opts.width ? opts.width : (wordInput.outerWidth() - 2));

                //处理文本框中的键盘事件
                //得到弹出框对象
                var autoNode = $tpl;
                //得到当前按键的code值
                var myEvent = event || window.evnet;
                var keyCode = myEvent.keyCode;
                var infos;

                //如果输入的是字母，应该将文本框最新的信息发送给服务器
                //如果输入的是退格键或删除键，也应该将文本框的信息发送给服务器
                //65~90字母键，48~57数字键，96~105小键盘上的数字键，8是BackSpace，46是Delete
                if (keyCode >= 65 || keyCode <= 90 || keyCode == 8 || keyCode == 46) {
                    //1、首先获取文本框的内容
                    var wordText = wordInput.val();
                    //文本内容不为空才将文本框内容发给服务器
                    if (wordText != "" && wordText.length >= opts.minLength) {
                        //2、将文本框的内容发给服务器
                        //对上次未执行的延时做清除操作
                        clearTimeout(timeoutId);
                        //对服务器端进行交互延迟500ms,避免快速打字造成的频繁请求
                        timeoutId = setTimeout(function() {
                            $.get(opts.url, {
                                keywords: wordText,
                                'limit': opts.limit
                            }, function(data) {
                                if (data.status == '0') return;
                                //清空div里原来的内容
                                autoNode.html("");
                                infos = data.info.infos;
                                for (var i = 0; i < infos.length; i++) {
                                    //将新建的节点加入到弹出框的节点中
                                    var newDivNode = $('<div class="list">').data("index", i);
                                    var item = $.isFunction(opts.formatItem) ? opts.formatItem(infos[i]) : '';
                                    newDivNode.html(item).appendTo(autoNode);
                                    //添加鼠标进入事件,高亮节点
                                    newDivNode.mouseover(function() {
                                        //将原来高亮的节点取消
                                        if (highlightindex != -1) {
                                            autoNode.children("div").eq(highlightindex).removeClass('list-active');
                                        }
                                        //记录新的高亮节点
                                        highlightindex = $(this).data("index");
                                        $(this).addClass('list-active');
                                    });
                                    //鼠标移出，取消高亮
                                    newDivNode.mouseout(function() {
                                        //取消节点的高亮
                                        $(this).removeClass('list-active');
                                    });
                                    //鼠标补全
                                    newDivNode.click(function() {
                                        //文本框的内容变成高亮显示的内容
                                        if ($.isFunction(opts.formatResult)) {
                                            opts.formatResult(infos[$(this).data('index')], wordInput[0]);
                                        } else {
                                            wordInput.val($(this).text());
                                        }
                                        //隐藏弹出窗体
                                        autoNode.hide();
                                    });
                                };
                                //如果服务服务器端有数据,则显示弹出框
                                if (infos.length > 0) {
                                    autoNode.show();
                                    if (autoNode.height() > opts.scrollHeight) {
                                        autoNode.height(opts.scrollHeight);
                                    } else {
                                        autoNode.height('auto');
                                    }
                                } else {
                                    autoNode.hide();
                                    //弹出框隐藏时没有高亮显示的节点
                                    highlightindex = -1;
                                }
                            }, "json");
                        }, 500);


                    } else {
                        autoNode.hide();
                        //弹出框隐藏时没有高亮显示的节点
                        highlightindex = -1;
                    }
                } else if (keyCode == 38) { //向上键
                    //得到弹出框的所有子节点
                    var autoNodes = autoNode.children("div");
                    if (highlightindex != -1) {
                        //如果原来存在高亮显示节点，则将背景色改为白色
                        autoNodes.eq(highlightindex).removeClass('list-active');
                        //将highlightindex等于零的情况单独拿出来处理
                        if (highlightindex == 0) {
                            highlightindex = autoNodes.length - 1;
                        } else {
                            highlightindex--;
                        }
                    } else {
                        highlightindex = autoNodes.length - 1;
                    }

                    //让现在高亮的内容变成红色
                    autoNodes.eq(highlightindex).addClass('list-active');
                } else if (keyCode == 40) { //向下键
                    //得到弹出框的所有子节点
                    var autoNodes = autoNode.children("div");
                    if (highlightindex != -1) {
                        //如果原来存在高亮显示节点，则将背景色改为白色
                        autoNodes.eq(highlightindex).removeClass('list-active');
                    }
                    highlightindex++;

                    if (highlightindex == autoNodes.length) {
                        highlightindex = 0;
                    }
                    //让现在高亮的内容变成红色
                    autoNodes.eq(highlightindex).addClass('list-active');
                } else if (keyCode == 13) {
                    //如果输入的是回车

                    if (highlightindex != -1) {
                        //取出高亮显示下拉框的内容
                        var comText = autoNode.hide().children("div").eq(highlightindex);
                        //文本框的内容变成高亮显示的内容
                        if ($.isFunction(opts.formatResult)) {
                            wordInput.val(opts.formatResult(infos[comText.data('index')]));
                        } else {
                            wordInput.val(comText.text());
                        }

                        highlightindex = -1;
                    }
                }
            });
        });
    }
    var fancyBox = function(a) {
        var a = a || {};
        var defaults = {
            contain: document,
            target: '.j-fancyBox'
        }
        var opts = $.extend(defaults, a);
        var target = opts.target instanceof jQuery ? opts.target : $(opts.target, opts.contain);
        if (window != top.window && top.window.fancyBoxTop) {
            top.window.fancyBoxTop(opts);
        } else {
            require.async(['fancyBox', 'seajsCss'], function(fancyBox, seajsCss) {
                seajs.use("/js/plugins/fancyBox/jquery.fancybox.css?v=2.1.5");
                target.fancybox();
            });
        }
    }
    var fancyBoxTop = function(a) {
            var a = a || {};
            var opts = a;
            if (!opts.contain || !opts.target) return;
            var $fancybox = $(opts.target, opts.contain);
            require.async(['fancyBox', 'seajsCss'], function(fancyBox, seajsCss) {
                seajs.use("/js/plugins/fancyBox/jquery.fancybox.css?v=2.1.5");
                $.each($fancybox, function(i, n) {
                    $(n).fancybox();
                });
            });
        }
        //添加右击菜单
    var contextMenu = function(a) {
        var a = a || {};
        var defaults = {
            target: document,
            addMenu: [],
            itemClick: function(index, obj) {}
        };
        var opts = $.extend(defaults, a);
        if (opts.addMenu.length == 0) return;
        //        var $target=opts.target instanceof jQuery?opts.target:$(opts.target);
        $('head').append('<style type="text/css" id="contextMenu">.u-contextmenu{ border: 1px solid #eee; box-shadow: 0 0 3px #eee; position: absolute; background: #fff;}.u-contextmenu li{ line-height: 30px; padding: 3px 10px; cursor: pointer;}</style>');
        var $tpl = $('<div class="u-contextmenu"><ul></ul></div>');
        var li = '';
        var $target; //右击的范围
        var ev; //点击时的event
        for (var i = 0, n = opts.addMenu.length; i < n; i++) {
            li += '<li>' + opts.addMenu[i] + '</li>';
        }
        $tpl.find('ul').append(li);

        function close() {
            $('.u-contextmenu').remove();
        }
        $(document).delegate(opts.target, 'contextmenu', function(event) {
            var clientX = event.clientX;
            var clientY = event.clientY;
            ev = event;
            $target = $(this);
            close();
            $tpl.clone().css({
                top: clientY + 'px',
                left: clientX + 'px'
            }).appendTo($('body'));
            return false;
        });
        $(document).delegate('.u-contextmenu li', 'click', function() {
            var index = $(this).index(); //点击的第几个
            opts.itemClick(index, $target[0], ev);
        });
        $(document).bind('click', function() {
            close();
        });
    };

    //时间格式化
    var dateFormat = function(date, format) {
        //        date = new Date(parseInt(date)*1000);
        var map = {
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "h": date.getHours(), //小时
            "m": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    };

    //获取iframe内部的高度
    var iframeHeight = function(a) {
        var a = a || {};
        var defaults = {
            target: '',
            ele: 'body',
            autoLoad:true,
            callback: function() {}
        };
        var opts = $.extend(defaults, a);
        if (!opts.target) return;
        var $target=getJquery(opts.target);
        $target.each(function(){
            var $this=$(this);
            $this.on('load', function() {
                var _this = $(this);
                var $ele=_this.contents().find(opts.ele);
                if($ele.size()==0)$ele=_this.contents().find('body');
                var height = $ele[0].scrollHeight;
                opts.callback(height, _this[0]);
            });
            if(opts.autoLoad)$this.attr('src',$this.data('src'));
        });
    }

    //href链接纠正
    var correctHref = function(a) {
        var a = a || {};
        var defaults = {
            target: '.j-correct-href'
        }
        var opts = $.extend(defaults, a);
        $(opts.target).each(function() {
            var _this = $(this);
            var href = _this.data('href');
            if (href) {
                var reg = /^(\w+:\/\/)?(.+(?:\..+)+)$/i;
                var arr = reg.exec(href);
                var _href = 'javascript:void(0);';
                if ($.isArray(arr) && arr[2]) _href = (arr[1] ? arr[1] : 'http://') + arr[2]
                _this.attr('href', _href);
            }
        });
    }

    //去掉前后空格
    var trim = function(a) {
        var a = a || {};
        var defaults = {
            target: '.j-trim'
        }
        var opts = $.extend(defaults, a);
        var $target = $(opts.target);
        //鼠标按下的时候
        $target.keydown(function(event) {
            //如果是空格
            if (event.keyCode == 32) {
                return false;
            }
        });
        //内容被修改的时候
        $target.change(function(event) {
            //去掉前后空格
            var $this = $(this);
            $this.val($.trim($this.val()));
        });
        //粘贴的时候
        $target.each(function() {
            $(this)[0].onpaste = function() {
                //去掉前后空格
                var $this = $(this);
                setTimeout(function() {
                    $this.val($.trim($this.val()));
                }, 0);
            }
        });
    }

    //往会员中心跳转
    var gotoMember = function() {
        if (!(this instanceof gotoMember)) {
            return new gotoMember();
        }
        var _this = this;
        _this.set = function(a) {
            var a = a || {};
            var defaults = {
                target: '[data-gotomember]',
                title: '跳转链接',
                url: ''
            };
            var opts = $.extend(defaults, a);
            require.async('cookie', function(cookie) {
                $(document).delegate(opts.target, 'click', function() {
                    var __this = $(this);
                    var title = opts.title;
                    var url = opts.url;
                    if (__this.data('gotomember')) {
                        var arr = __this.data('gotomember').split(',');
                        title = arr[0];
                        url = arr[1];
                    }
                    $.cookie('gotomember', serialize({
                        "title": title,
                        "url": url
                    }));
                })
            });
        }
        _this.get = function() {
            require.async('cookie', function(cookie) {
                var json = strToJson($.cookie('gotomember'));
                if (!json || $.isEmptyObject(json)) return;
                $.cookie('gotomember', null);
                require.async(['member/member/newtabs'], function(newtabs) {
                    newtabs.newtabs(json['title'], json['url']);
                });
            });
        }
        return _this;
    }

    //在网页顶部显示错误信息
    var showMsg = function(a) {
        var a = a || {};
        var defaults = {
            content: '',
            onshow: function() {}
        };
        var opts = $.extend(defaults, a);
        if (!opts.content) return;
        var tpl = '<div class="m-error-top show"><i class="close">×</i><div class="con f-dib"></div></div>';
        var $tpl = $(tpl);
        var $con = $tpl.find('.con');
        var $close = $tpl.find('.close');
        $con.html(opts.content);
        if (window.top == window) {
            $('body').append($tpl);
        } else {
            $(window.top.document).find('body').append($tpl);
        }
        $tpl.css({
            'margin-left': '-' + $con.width() / 2 + 'px'
        });
        opts.onshow($con[0]);
        $close.click(function() {
            $tpl.remove();
        });
    }

    //网页右下角消息管理
    var manageTips = function(a) {
            if (!(this instanceof manageTips)) {
                return new manageTips(a);
            }
            var a = a || {};
            var defaults = {
                delay: 10000 //延迟多少消失
            }
            var opts = $.extend(defaults, a);
            var _this = this;
            var tpl = '<div class="m-tips-rb"><div class="j-lists"></div></div>';
            var $tpl = $(tpl);
            var $lists = $tpl.find('.j-lists');
            $('body').append($tpl);
            //消失消息效果
            _this.remove = function(obj) {
                    obj.slideUp();
                    setTimeout(function() {
                        obj.remove();
                    }, 2000)
                }
                //显示消息效果
            _this.show = function(obj) {
                    obj.hide();
                    $lists.append(obj);
                    obj.slideDown();
                    var timer = setTimeout(function() {
                        _this.remove(obj);
                    }, opts.delay);
                    obj.data('timer', timer);
                }
                //添加消息
            _this.add = function(obj) {
                /*
                    1:文字消息,2:图片消息
                    {type:1,content:'',click:''}
                    {type:2,image:'',title:'',content:'',click:''}
                */
                var obj = obj || {};
                if (!obj.type) obj.type = 1;
                var tmp = '';
                switch (obj.type) {
                    case 1:
                        {
                            tmp = '<div class="list"><div class="close">×</div><div class="con">' + obj.content + '</div></div>';
                            break;
                        }
                    case 2:
                        {
                            tmp = '<div class="list"><div class="close">×</div><div class="con">';
                            tmp += '<div class="pic"><img src="' + obj.image + '" /></div>';
                            tmp += '<div class="info"><div class="title f-toe">' + obj.title + '</div><div class="des">' + obj.content + '</div></div>';
                            tmp += '</div></div>';
                        }
                }
                var $tmp = $(tmp);
                $tmp.click(function() {
                    var $this = $(this);
                    if (obj.click && $.isFunction(obj.click)) {
                        obj.click();
                        _this.remove($this);
                        clearTimeout($this.data('timer'));
                    }
                });
                $tmp.find('.close').click(function() {
                    var $parent = $(this).closest('.list');
                    _this.remove($parent)
                    clearTimeout($parent.data('timer'));
                    event.stopPropagation();
                });
                _this.show($tmp);
            }

            return _this;
        }
        // var manageTips=function(a){
        //     if(!(this instanceof manageTips)){
        //         return new manageTips(a);
        //     }
        //     var a=a||{};
        //     var defaults={
        //         delay:10000,//延迟多少消失
        //         max:4//最大显示多少条
        //     }
        //     var opts=$.extend(defaults,a);
        //     var _this=this;
        //     _this.contents=[];//储存了消息列表
        //     _this.size=0;//显示的消息条数
        //     _this.unread=null;//未读消息的jquery
        //     var tpl='<div class="m-tips-rb"><div class="j-lists"></div></div>';
        //     var $tpl=$(tpl);
        //     var $lists=$tpl.find('.j-lists');
        //     $('body').append($tpl);
        //     //显示未读信息
        //     _this.showUnread=function(){
        //     	if(!_this.unread){
        //     		var tmp='<div class="list j-unread"><div class="con">您有<b class="s-red f-mlr5 f-fs14">'+_this.contents.length+'</b>条未处理的信息</div></div>';
        //     		_this.unread=$(tmp);
        //          _this.unread.hide();
        //          $tpl.append(_this.unread);
        //          _this.unread.slideDown();
        //     	}else{
        //     		var $b=_this.unread.find('b');
        //     		$b.text(_this.contents.length);
        //     	}
        //     }
        //     //消失消息效果
        //     _this.remove=function(obj){
        //     	_this.size--;
        //     	obj.slideUp();
        //     	setTimeout(function(){
        //     		obj.remove();
        //     	},2000)
        //     }
        //     //显示消息效果
        //     _this.show=function(obj){
        //     	_this.size++;
        //     	obj.hide();
        //         $lists.append(obj);
        //         obj.slideDown();
        //         var timer=setTimeout(function(){
        //         	obj.data('timer',null);
        //         	_this.contents.push(obj.clone(true));
        //         	_this.remove(obj);
        //         	_this.showUnread();
        //         },opts.delay);
        //         obj.data('timer',timer);
        //     }
        //     //添加消息
        //     _this.add=function(obj){
        //         /*
        //             1:文字消息,2:图片消息
        //             {type:1,content:'',click:''}
        //             {type:2,image:'',title:'',content:'',click:''}
        //         */
        //         var obj=obj||{};
        //         if(!obj.type)obj.type=1;
        //         var tmp='';
        //         switch (obj.type){
        //             case 1:{
        //                 tmp='<div class="list"><div class="close">×</div><div class="con">'+obj.content+'</div></div>';
        //                 break;
        //             }
        //             case 2:{
        //                 tmp='<div class="list"><div class="close">×</div><div class="con">';
        //                 tmp+='<div class="pic"><img src="'+obj.image+'" /></div>';
        //                 tmp+='<div class="info"><div class="title f-toe">'+obj.title+'</div><div class="des">'+obj.content+'</div></div>';
        //                 tmp+='</div></div>';
        //             }
        //         }
        //         var $tmp=$(tmp);
        //         $tmp.click(function(){
        //         	var $this=$(this);
        //         	if(obj.click && $.isFunction(obj.click)){
        //         		obj.click();
        //         		_this.remove($this);
        //         		clearTimeout($this.data('timer'));
        //         	}
        //         });
        //         if(_this.size<opts.max){
        //         	_this.show($tmp);
        //         }else{
        //         	_this.contents.push($tmp);
        //         	_this.showUnread();
        //         }
        //     }

    //      //未读消息点击的时候
    //      $tpl.delegate('.j-unread', 'click', function(event) {
    //      	if(_this.size==opts.max)return;
    //      	var size=_this.size;
    //      	var del=0;
    //      	for(var i=0,n=_this.contents.length;i<n;i++){
    //      		del=i;
    //      		if(size==opts.max)return;
    //      		_this.show(_this.contents[i]);
    //      		size++;
    //      	}
    //      	_this.contents.splice(0,del+1);
    //      	_this.unread.find('b').text(_this.contents.length);
    // if(_this.contents.length==0){
    // 	_this.unread.remove();
    // 	_this.unread=null;
    // }
    //      });
    //      //关闭按钮被点击
    //      $lists.delegate('.close', 'click', function(event) {
    //      	var $parent=$(this).closest('.list');
    //      	_this.remove($parent)
    //      	clearTimeout($parent.data('timer'));
    //      });
    //      return _this;
    //  }

    //桌面通知
    var notification = function(a) {
        var a = a || {};
        var defaults = {
            title: '提示信息', //通知的标题
            time: false, //是否自动关闭
            body: '', //通知的内容
            tag: '', //通知的id
            icon: '', //图标的url
            show: function() {},
            click: function() {},
            close: function() {},
            error: function() {}
        };
        var opts = $.extend(defaults, a);
        if (window.Notification) {
            if (Notification.permission == 'granted') {
                callback();
            } else {
                Notification.requestPermission(function(status) {
                    if (status == 'granted') {
                        callback();
                    }
                })
            }

            function callback() {
                var notify = new Notification(opts.title, {
                    body: opts.body,
                    tag: opts.tag,
                    icon: opts.icon
                });
                notify.onshow = function() {
                    opts.show();
                    if (opts.time) {
                        setTimeout(notify.close.bind(notify), opts.time);
                    }
                };
                notify.onclick = opts.click;
                notify.onclose = opts.close;
                notify.onerror = opts.error;
            }
        }
    }

    var _blank=function(url){
        if(!url)return;
        var $blank=$('<form target="_blank" action="'+url+'"></form>');
        $blank.trigger('submit');
    }

    var limitWord=function (a) {
        var a=a||{};
        var defaults={
            target:'.j-limitWord',
            wordText:'.j-limitWordText'
        };
        var opts=$.extend(defaults,a);
        var $target=$(opts.target);
        $.each($target,function(){
            var $this=$(this);
            var $text=$this.find(opts.wordText);
            var num=parseInt($text.text());
            var $ipt=$this.find('input');
            if($ipt.size()==0)$ipt=$this.find('textarea');
            $ipt.keyup(function(){
                var size=$ipt.val().length;
                if(size<=num){
                    $text.text(num-size);
                }else{
                    $ipt.val($ipt.val().substring(0,num));
                    $text.text(0);
                }
            }).keyup();
        });
    }

    //协议
    var agreement=function(a){
        var a=a||{};
        var defaults={
            target:'.j-agreement'
        }
        var opts=$.extend(defaults,a);
        var $target=$(opts.target);
        if($target.size()==0)return;
        require.async(['validForm'],function(validForm){
            $target.each(function(){
                var $this=$(this);
                var type=$this.data('type');
                if(!type)return;
                var $agreement=$this.find('[data-agreement]');
                if($agreement.size()==0)return;
                validForm.request({
                    url:'?m=member&a=agreement&name='+type,
                    isJson:true,
                    success:function(ret){
                        if(ret.status){
                            $agreement.each(function(){
                                var _this=$(this);
                                var arg=_this.data('agreement');
                                if(!arg)return true;
                                _this.text(ret.info[arg]);
                            });
                        }
                    }
                });
            });
        })
    }

    module.exports = {
        getCurParams: getCurParams, //获取url的参数
        getCurUrl:getCurUrl,//获取当前页面的url
        getJquery: getJquery, //获得jquery对象
        strToJson: strToJson, //字符串转换成json
        convertComma: convertComma, //中文下的逗号转换成英文下的逗号
        fancyBox: fancyBox, //弹窗查看图片
        fancyBoxTop: fancyBoxTop, //当需要穿过iframe的时候顶层要写这个函数赋值到window上查看图片
        autofill: autofill, //input自动补全
        divEditor: divEditor, //div编辑器初始化
        openInfo: openInfo, //判断是否打开了完善信息
        beforeName: beforeName, //多级联动name转换
        upload: upload, //上传函数
        parseUrl: parseUrl, //url解析函数
        serialize: serialize, //序列化
        del: del, //删除函数
        get: get, //根据url获取弹窗
        ajax: ajax, //直接ajax请求url函数
        slt: sltajax, //selet初始化函数
        switchSlt: switchSlt, //select切换div显示隐藏
        sltSearch: sltSearch, //select搜索
        switchRadio: switchRadio, //radio切换div显示隐藏
        switchCheckbox: switchCheckbox, //checkbox切换div显示隐藏
        changeForm: changeForm, //form表单变动的时候
        searchOrder: searchOrder, //搜索函数
        orderLink:orderLink,//排序
        order: order, //排序函数
        checkIcon: checkIcon, //全选针对图标函数
        checkSel: checkSel, //全选函数
        checkObj: checkObj, //全选函数
        checkval: checkval, //获取全选函数的值
        addServiceCart: addServiceCart, //服务加入购物车
        serviceOrder: serviceOrder, //服务立即购买
        addtpl: addtpl, //模板
        modify: modifyDialog, //弹窗修改函数
        choose: choose, //弹窗选择会员
        lock: lock, //上锁函数
        link: exeLink, //执行链接函数
        dateFormat: dateFormat, //时间格式化函数
        iframeHeight: iframeHeight, //获取iframe内部的高度
        correctHref: correctHref, //纠正href链接
        trim: trim, //去掉前后空格
        showMsg: showMsg, //在网页顶部显示错误信息
        contextMenu: contextMenu, //右击添加菜单
        gotoMember: gotoMember, //往会员中心跳转
        manageTips: manageTips, //网页右下角消息管理
        notification: notification, //html5的通知
        _blank:_blank,//触发新窗口打开
        limitWord:limitWord,//限制输入个数
        agreement:agreement//协议
    }
});
