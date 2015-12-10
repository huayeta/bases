define('Widget', function (require, exports, module) {
    require('jquery');
    var MicroEvent=require('MicroEvent');

    var Widget = function () {
        this.boundingBox = null; //最外层的jquery对象
    };

    Widget.prototype = {
        render: function (container) {
            this.renderUI();
            this.bindUI();
            $(container || document.body).append(this.boundingBox);
            this.syncUI();
        },
        destroy: function () {
            this.boundingBox.off();
            this.boundingBox.remove();
            this.destructor();
        },
        renderUI: function () {}, //渲染html，初始化this.boundingBox
        bindUI: function () {}, //绑定事件
        syncUI: function () {}, //渲染跟绑定完之后的回调
        destructor: function () {} //销毁后的回调
    };
    MicroEvent.mixin(Widget);

    return Widget;

});
