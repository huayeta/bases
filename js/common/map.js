define('map',function(require, exports, module){
	require('jquery');
	
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
		var _url="http://api.map.baidu.com/api?v=2.0&ak=VUeZ23xRAGkwdHSNfrOUVega&callback=initialize";
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
	
	var getPoint=function(a){
		var a=a||{};
		var defaults={
			target:'[data-getPoint]',
			point:'',
			contain:document,
			callback:''
		};
		var opts=$.extend(defaults,a);
		require.async(['tools'],function(tools){
			tools.get({
				target:opts.target,
				url:'?m=common&c=dialog&a=map',
				before:function(obj,opt){
					var sx=opts.target.substring(1,opts.target.length-1);
					if(!opt.data)opt.data={};
					opt.data.point=$(obj).attr(sx);
				},
				conatain:opts.contain,
				callback:function(val,target){
					var point=val.point.lng+','+val.point.lat;
					var $this=$(target);
					if(val){
						if($.type(opts.callback)=='function'){opts.callback(val,target)}
						else{
							var parent;
							if(opts.contain!=document){parent=$this.closest(opts.contain);}
							else{parent=$(document)}
							var valObj=$('[data-getPoint-val]',parent);
							$.each(valObj,function(i,n){
								var $n=$(n);
								var tag=n.nodeName.toLowerCase();
								if(tag=='input')$n.val(point);
							});
						}
					}
				}
			});
		});
	};
	
	var initPoint=function(a){
		var a=a||{};
		var defaults={
			id:'initMap',
			point:'',//初始point
			txt:'[data-initPoint="txt"]',
			btn:'[data-initPoint="btn"]',
			city:'[data-initPoint="city"]',
			contain:document,
			callback:''
		};
		var opts=$.extend(defaults,a);
		var $contain=$(opts.contain);
		var $txt=$(opts.txt,$contain);
		var $city=$(opts.city,$contain);
		getMap({
			callback:function(){
				require.async(['fnDialog'],function(dialog){
					// 百度地图API功能
					var curDialog=dialog.dialog;
					var map = new BMap.Map(opts.id);
					map.enableScrollWheelZoom();                 //启用滚轮放大缩小
					// 创建地址解析器实例
					var myGeo = new BMap.Geocoder();
					var myCity = new BMap.LocalCity();
					var cityName;//所在的城市名字
					var cityNameObj;//所在城市的dom
					var detailAdd;//显示具体地址的jquery对象
					var marker;
					function addMarker(point){
						if(marker)map.removeOverlay(marker);
						marker=new BMap.Marker(point);//创建marker标注对象
						map.addOverlay(marker);
						marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
					}
					myCity.get(function(result){
						cityName = result.name;
						if(cityName){
	//						map.setCenter(cityName);
							map.centerAndZoom(cityName);      // 初始化地图,用城市名设置地图中心点
							curDialog.statusbar('<span style="color:#111">当前所在的城市为：<span class="s-green" id="cityName">'+cityName+'</span><span id="detailAdd"></span></span>');
							detailAdd=$('#detailAdd',window.top.document);
							cityNameObj=$('#cityName',window.top.document);
							if(opts.point){
								var point=opts.point.split(',');
								var pointMap = new BMap.Point(point[0],point[1]);
//								map.setCenter(pointMap);
								map.centerAndZoom(pointMap, 16);
								addMarker(pointMap);
//								setTimeout(function(){addMarker(pointMap);},2000)
							}
						}
					});
					//点击搜索地址到地图上
					$contain.delegate(opts.btn,'click',function(){
						var val=$txt.val();
						var city=$city.val();
						if(city){
							cityName=city;
							cityNameObj.text(cityName);
						}
						if(val){
							// 将地址解析结果显示在地图上,并调整地图视野
							myGeo.getPoint(val, function(point){
								if (point) {
									map.centerAndZoom(point, 16);
									addMarker(point);
								}
							}, cityName);
						}
					});
					//点击地图拾取坐标
					map.addEventListener("click",function(e){
						var point = e.point;
						addMarker(point);
//						console.log(point);
						myGeo.getLocation(point, function(rs){
							var addComp = rs.addressComponents;
							detailAdd.html('，所在地：<span class="s-green">'+rs.address+'</span>，坐标：<span class="s-green">'+point.lng+':'+point.lat+'</span>');
							if($.isFunction(opts.callback))opts.callback(e);
						});  
	//					map.centerAndZoom(point, 16);
					});
				});
			}
		});
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
		if(!/^\d+\.\d+,\d+.\d+$/i.test(opts.point)){
			throw new Error('坐标格式不对');
			return;
		}
		var point=opts.point.split(',');
		getMap({
			callback:function(){
				$.getScript('http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.js',function(){
					loadCss({url:'http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.css'});
					// 百度地图API功能
					var map = new BMap.Map(opts.id);
					var xx=parseFloat(point[0]);
					var yy=parseFloat(point[1]);
					var poi = new BMap.Point(xx,yy);//初始化在地图
					map.centerAndZoom(poi, 16);
					map.enableScrollWheelZoom();//启用鼠标滚轮
					var marker;
					function addMarker(point){
						if(marker)map.removeOverlay(marker);
						marker=new BMap.Marker(point);//创建marker标注对象
						map.addOverlay(marker);
//						marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
					}
					//创建检索信息窗口对象
					var searchInfoWindow=null;
					searchInfoWindow = new BMapLib.SearchInfoWindow(map, opts.content, {
						title  : opts.title,      //标题
						width  : opts.width,             //宽度
						height : opts.height,              //高度
						panel  : "panel",         //检索结果面板
						enableAutoPan : true,     //自动平移
						searchTypes   :[
							BMAPLIB_TAB_SEARCH,   //周边检索
							BMAPLIB_TAB_TO_HERE,  //到这里去
							BMAPLIB_TAB_FROM_HERE //从这里出发
						]
					});
					addMarker(poi);
					marker.addEventListener("click", function(e){
						openInfo();
					});
					openInfo();
					function openInfo(){
						if(opts.isOpen){
							searchInfoWindow.open(marker);
//							var infoImg=$('.infoImg',target);
//							$.each(infoImg,function(i,n){
//								//图片加载完毕重绘infowindow
//							   n.onload = function (){
//								   searchInfoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
//							   }
//							});
						}
					}
				});
			}
		});
	};
	
	module.exports={
		getPoint:getPoint, //获取坐标
		initPoint:initPoint, //初始化坐标
		openInfoWindow:openInfoWindow //信息窗口实例
	}
})