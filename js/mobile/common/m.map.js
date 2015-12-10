define('mMap',function(require, exports, module){
    require('zepto');
	
	var getMap=function(a){
		var a=a||{};
		var defaults={
			isPhone:false,
			callback:''
		};
		var opts=$.extend(defaults,a);
		if(window.initialize){
			if(opts.callback || $.isFunction(opts.callback))opts.callback();
			return;
		}
		var _url="http://api.map.baidu.com/api?v=1.0&type=quick&ak=VUeZ23xRAGkwdHSNfrOUVega&callback=initialize";
		var script=document.createElement("script");
		script.src=_url;
		document.body.appendChild(script);
		window.initialize=function(){
			if(opts.callback || $.isFunction(opts.callback))opts.callback();
		}
	}
	
	//判断css是否加载了，然后加载
    var loadCss=function(a){
        var a=a||{};
        var defaults={url:''};
        var opts=$.extend(defaults,a);
        var isCss=false;
		$('link').each(function() {
            var _this=$(this);
			if(_this.attr('href').indexOf(opts.url)!=-1){
				isCss=true;
				return false;	
			}
        });
		if(!isCss){
			$('head').append('<link href="'+opts.url+'" rel="stylesheet" type="text/css" />');	
		} 
    };
	
	var openInfoWindow=function(a){
		var a=a||{};
		var defaults={
			id:'infoMap',
			isOpen:true,
			point:'',
			title:'检索信息',
			content:'',
			width:290,
			height:105
		};
		var opts=$.extend(defaults,a);
		var target=$('#'+opts.id);
		if(target.size()==0)return;//不存在显示地图的dom
		if(target.attr('data-point'))opts.point=target.attr('data-point');
		if(!opts.point){
			throw new Error('不存在坐标');
			return;
		}
		if(opts.point.indexOf(',')==-1){
			throw new Error('坐标格式不对');
			return;
		}
		var point=opts.point.split(',');
		getMap({
			callback:function(){
				// 百度地图API功能
				var map = new BMap.Map(opts.id);
				var xx=parseFloat(point[0]);
				var yy=parseFloat(point[1]);
				var poi = new BMap.Point(xx,yy);//初始化在地图
				map.centerAndZoom(poi, 16);
				map.addControl(new BMap.ZoomControl()); 
				var marker;
				function addMarker(point){
					if(marker)map.removeOverlay(marker);
					marker=new BMap.Marker(point);//创建marker标注对象
					map.addOverlay(marker);
				}
				//创建检索信息窗口对象
				var infoWindow=null;
				var infoWindow = new BMap.InfoWindow(opts.content, {
					title :	opts.title, // 信息窗口标题
					width : opts.width,    // 信息窗口宽度
					height: opts.height,     // 信息窗口高度
					enableAutoPan : true //自动平移
				});  // 创建信息窗口对象
				addMarker(poi);
				marker.addEventListener("click", function(e){
					openInfo();
				});
				openInfo();
				function openInfo(){
					if(opts.isOpen){
						map.openInfoWindow(infoWindow,poi); //开启信息窗口
						var infoImg=$('.infoImg',target);
						$.each(infoImg,function(i,n){
							//图片加载完毕重绘infowindow
						   n.onload = function (){
							   infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
						   }
						});
					}
				}
			}
		});
	};
	
	module.exports={
		openInfoWindow:openInfoWindow //信息窗口实例	
	};
});