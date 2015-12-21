/*! Sea.js 2.3.0 | seajs.org/LICENSE.md */
!function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return z++}function e(a){return a.match(C)[0]}function f(a){for(a=a.replace(D,"/"),a=a.replace(F,"$1/");a.match(E);)a=a.replace(E,"/");return a}function g(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||"/"===c?a:a+".js"}function h(a){var b=u.alias;return b&&w(b[a])?b[a]:a}function i(a){var b=u.paths,c;return b&&(c=a.match(G))&&w(b[c[1]])&&(a=b[c[1]]+c[2]),a}function j(a){var b=u.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(H,function(a,c){return w(b[c])?b[c]:a})),a}function k(a){var b=u.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=y(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break}return c}function l(a,b){var c,d=a.charAt(0);if(I.test(a))c=a;else if("."===d)c=f((b?e(b):u.cwd)+a);else if("/"===d){var g=u.cwd.match(J);c=g?g[0]+a.substring(1):a}else c=u.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=j(a),a=g(a);var c=l(a,b);return c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}function o(a,b,c){var d=K.createElement("script");if(c){var e=y(c)?c(a):c;e&&(d.charset=e)}p(d,b,a),d.async=!0,d.src=a,R=d,Q?P.insertBefore(d,Q):P.appendChild(d),R=null}function p(a,b,c){function d(){a.onload=a.onerror=a.onreadystatechange=null,u.debug||P.removeChild(a),a=null,b()}var e="onload"in a;e?(a.onload=d,a.onerror=function(){B("error",{uri:c,node:a}),d()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&d()}}function q(){if(R)return R;if(S&&"interactive"===S.readyState)return S;for(var a=P.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];if("interactive"===c.readyState)return S=c}}function r(a){var b=[];return a.replace(U,"").replace(T,function(a,c,d){d&&b.push(d)}),b}function s(a,b){this.uri=a,this.dependencies=b||[],this.exports=null,this.status=0,this._waitings={},this._remain=0}if(!a.seajs){var t=a.seajs={version:"2.3.0"},u=t.data={},v=c("Object"),w=c("String"),x=Array.isArray||c("Array"),y=c("Function"),z=0,A=u.events={};t.on=function(a,b){var c=A[a]||(A[a]=[]);return c.push(b),t},t.off=function(a,b){if(!a&&!b)return A=u.events={},t;var c=A[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete A[a];return t};var B=t.emit=function(a,b){var c=A[a],d;if(c){c=c.slice();for(var e=0,f=c.length;f>e;e++)c[e](b)}return t},C=/[^?#]*\//,D=/\/\.\//g,E=/\/[^/]+\/\.\.\//,F=/([^:/])\/+\//g,G=/^([^/:]+)(\/.+)$/,H=/{([^{]+)}/g,I=/^\/\/.|:\//,J=/^.*?\/\/.*?\//,K=document,L=location.href&&0!==location.href.indexOf("about:")?e(location.href):"",M=K.scripts,N=K.getElementById("seajsnode")||M[M.length-1],O=e(n(N)||L);t.resolve=m;var P=K.head||K.getElementsByTagName("head")[0]||K.documentElement,Q=P.getElementsByTagName("base")[0],R,S;t.request=o;var T=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,U=/\\\\/g,V=t.cache={},W,X={},Y={},Z={},$=s.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6};s.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=s.resolve(b[d],a.uri);return c},s.prototype.load=function(){var a=this;if(!(a.status>=$.LOADING)){a.status=$.LOADING;var c=a.resolve();B("load",c);for(var d=a._remain=c.length,e,f=0;d>f;f++)e=s.get(c[f]),e.status<$.LOADED?e._waitings[a.uri]=(e._waitings[a.uri]||0)+1:a._remain--;if(0===a._remain)return a.onload(),b;var g={};for(f=0;d>f;f++)e=V[c[f]],e.status<$.FETCHING?e.fetch(g):e.status===$.SAVED&&e.load();for(var h in g)g.hasOwnProperty(h)&&g[h]()}},s.prototype.onload=function(){var a=this;a.status=$.LOADED,a.callback&&a.callback();var b=a._waitings,c,d;for(c in b)b.hasOwnProperty(c)&&(d=V[c],d._remain-=b[c],0===d._remain&&d.onload());delete a._waitings,delete a._remain},s.prototype.fetch=function(a){function c(){t.request(g.requestUri,g.onRequest,g.charset)}function d(){delete X[h],Y[h]=!0,W&&(s.save(f,W),W=null);var a,b=Z[h];for(delete Z[h];a=b.shift();)a.load()}var e=this,f=e.uri;e.status=$.FETCHING;var g={uri:f};B("fetch",g);var h=g.requestUri||f;return!h||Y[h]?(e.load(),b):X[h]?(Z[h].push(e),b):(X[h]=!0,Z[h]=[e],B("request",g={uri:f,requestUri:h,onRequest:d,charset:u.charset}),g.requested||(a?a[g.requestUri]=c:c()),b)},s.prototype.exec=function(){function a(b){return s.get(a.resolve(b)).exec()}var c=this;if(c.status>=$.EXECUTING)return c.exports;c.status=$.EXECUTING;var e=c.uri;a.resolve=function(a){return s.resolve(a,e)},a.async=function(b,c){return s.use(b,c,e+"_async_"+d()),a};var f=c.factory,g=y(f)?f(a,c.exports={},c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=$.EXECUTED,B("exec",c),g},s.resolve=function(a,b){var c={id:a,refUri:b};return B("resolve",c),c.uri||t.resolve(c.id,b)},s.define=function(a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,x(a)?(c=a,a=b):c=b),!x(c)&&y(d)&&(c=r(""+d));var f={id:a,uri:s.resolve(a),deps:c,factory:d};if(!f.uri&&K.attachEvent){var g=q();g&&(f.uri=g.src)}B("define",f),f.uri?s.save(f.uri,f):W=f},s.save=function(a,b){var c=s.get(a);c.status<$.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=$.SAVED,B("save",c))},s.get=function(a,b){return V[a]||(V[a]=new s(a,b))},s.use=function(b,c,d){var e=s.get(d,x(b)?b:[b]);e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=V[d[f]].exec();c&&c.apply(a,b),delete e.callback},e.load()},t.use=function(a,b){return s.use(a,b,u.cwd+"_use_"+d()),t},s.define.cmd={},a.define=s.define,t.Module=s,u.fetchedList=Y,u.cid=d,t.require=function(a){var b=s.get(s.resolve(a));return b.status<$.EXECUTING&&(b.onload(),b.exec()),b.exports},u.base=O,u.dir=O,u.cwd=L,u.charset="utf-8",t.config=function(a){for(var b in a){var c=a[b],d=u[b];if(d&&v(d))for(var e in c)d[e]=c[e];else x(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),u[b]=c}return B("config",a),t}}}(this);

var pathsUrl='';
if(window.location.href.indexOf('file://')!=-1 || window.location.href.indexOf('192.168.1')!=-1){
	pathsUrl="http://yst.lqper.com";
}

seajs.config({
	paths:{
		js:pathsUrl+'/js',
		member:pathsUrl+'/member/js',
		mobile:pathsUrl+'/js/mobile'
	},
	alias:{
		seajsCss:'js/seajs-css',//用seajs加载css文件，如link标签
		jquery:'js/plugins/jquery/jquery',
		// jquery:'js/components/dist/jquery.min.js',
		jscrollpane:'js/plugins/jscrollpane/jquery.jscrollpane.min',
		lazyload:'js/plugins/lazyload/jquery.lazyload.min',
		blocksit:'js/plugins/blocksit/blocksit.min',
		fancyBox:'js/plugins/fancyBox/jquery.fancybox.min',//图片预览
		sortable:'js/plugins/sortable/Sortable.min',//拖拽排序
        waitforimages:'js/plugins/waitforimages/jquery.waitforimages.min',//判断图片加载
		autoComplete:'js/plugins/autocomplete/jquery.autocomplete',
		cookie:'js/plugins/cookie/jquery.cookie',
		form:'js/plugins/form/jquery.form',
		jqzoom:'js/plugins/jqzoom/jquery.jqzoom',
		slide:'js/plugins/superSlide/jquery.SuperSlide',
		md5:'js/plugins/md5/md5',
		dialog:'js/plugins/artDialog/src/dialog',
		dialogPlus:'js/plugins/artDialog/src/dialog-plus',
        calelf:'js/plugins/calelf/calelf',
        calendar:'js/plugins/calelf/calendar',
        template:'js/plugins/template/template.min',
        tree:'js/plugins/tree/tree',
		webuploader:'js/plugins/webuploader/sea.webuploader.min',
		underscore:'js/plugins/underscore/underscore',
		perfectScrollbar:'js/plugins/perfectScrollbar/js/min/perfect-scrollbar.min',
        validForm:'js/common/validForm',
        wbmc:'js/common/jquery.wbmc',
		skin:'js/common/skin',
		tools:'js/common/tools',
		fnDialog:'js/common/fnDialog',
        box:'js/common/box',
		map:'js/common/map',
		time:'js/common/time',
		pages:'js/common/pages',
        comment:'js/comment/comment',
        dragloader:'js/common/dragloader',
        // scrollLoading:'js/common/jquery.scrollloading',
		Widget:'js/common/widget',
		common:'js/common/common',
		MicroEvent:'js/common/microevent',
		react:'js/components/react/react.min',
        activity:'js/activity/activity',
		label:'js/label/js/label',
		editor:'js/label/js/editor',
		cart:'js/cart/cart',
		order:'js/cart/order',
		productComment:'js/cart/productComment',
		productRecord:'js/cart/productRecord',
		serviceCart:'js/cart/serviceCart',
		angular:'mobile/plugins/angular/angular.min',
        ngAnimate:'mobile/plugins/angular/ngAnimate/angular-animate.min',
        ngRouter:'mobile/plugins/angular/ngRouter/angular-router.min',
        ngTouch:'mobile/plugins/angular/ngTouch/angular-touch.min',
        ngResource:'mobile/plugins/angular/ngResource/angular-resource.min',
		ngSanitize:'mobile/plugins/angular/angular-sanitize.min',
		ngCookies:'mobile/plugins/angular/ngCookies/angular-cookies.min',
		localStorage:'mobile/plugins/angular/localStorage/angular-local-storage.min',
		uiRouter:'mobile/plugins/angular/uiRouter/angular-ui-router.min',
		bundle:'mobile/ionic/ionic.bundle',
		iscroll:'mobile/plugins/iscroll/iscroll',
		zepto:'mobile/plugins/zepto/zepto.min',
		touch:'mobile/plugins/touch/touch',
		hammer:'mobile/plugins/hammer/hammer.min',
		mSelect:'mobile/plugins/mSelect/m.select',
		mTime:'mobile/plugins/mSelect/m.time',
		mWbmc:'mobile/plugins/mSelect/m.wbmc',
        touchSlide:'mobile/plugins/touchSlide/TouchSlide',
        swiper:'mobile/plugins/swiper/swiper.min',
        media:'mobile/plugins/media/media',
        mUeditor:'mobile/plugins/ueditor/sea.ueditor',
		simpop:'mobile/common/simpop',
        mTools:'mobile/common/m.tools',
        mBox:'mobile/common/m.box',
        mMap:'mobile/common/m.map',
        mCart:'mobile/cart/mCart',
        mProductComment:'mobile/cart/mProductComment',
        swiperSlider:'mobile/swiper/swiperSlider',
		aPost:'mobile/angularApp/aPost',
		aHttp:'mobile/angularApp/aHttp',
		aForm:'mobile/angularApp/aForm',
		aUpload:'mobile/angularApp/aUpload',
		aTemplate:'mobile/aTemplate/aTemplate',
		aMemberView:'mobile/aMemberView/aMemberView',
		aImageView:'mobile/aImageView/aImageView',
		aActivity:'mobile/aActivity/aActivity',
		aValidAccount:'mobile/aValidAccount/aValidAccount',
		aSelect:'mobile/aSelect/aSelect',
        aTools:'mobile/angularApp/aTools',
        aBox:'mobile/angularApp/aBox',
        aComment:'mobile/angularApp/aComment',
		wx:'http://res.wx.qq.com/open/js/jweixin-1.0.0.js',
		'jquery.ui.widget':'js/mobile/plugins/jqueryFileUpload/vendor/jquery.ui.widget.js',
		'jquery.iframe.transport':'js/mobile/plugins/jqueryFileUpload/jquery.iframe-transport.js',
		jqueryFileUpload:'js/mobile/plugins/jqueryFileUpload/jquery.fileupload.js'
	},
	map: [
		[ /^(.*\/.*\.(?:css|js))(?:.*)$/i, '$1?t=20151002' ]
	]
});


if (!window.console) {
	window.console = {
		log: function(msg) {
	 }
	}
}
