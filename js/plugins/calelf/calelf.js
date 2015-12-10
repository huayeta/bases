/*!
 * javascript calelf Calendar Control 
 * @author lqper
 * @site www.lqper.com
 * @mail lqper@foxmail.com
 * @update 2008-11-15
 * @param {Object} o Need to insert the date the object or id
 * @param {Object} f Date Format(Y-m-d H:i)
 * @param {Object} l Language 0->Chinese,1->English(Default 0)
 * @param {Object} s To select display year and month
 * @Examples
 * <input type="Text" id="demo1" onclick="calelf(this);"><br>
  * <input type="Text" id="demo1" data-calelf="Y-m-d H:i:00"><br>
 * <input type="Text" id="demo2"><a onclick="calelf('demo2','Y-M-D',1);"></a><br>
 */
define(function(require,exports,module){
	var $yskj=$('.g-yskj');
	$yskj.css('position','relative');
function calelf(o,f,l,s){
	var $=function(s){return document.getElementById(s);},B = navigator.userAgent.indexOf("MSIE") != -1 && !window.opera,AE = function(G, R, C){ if(B){G.attachEvent("on" + R,(function(S){return function(){C.call(S)}})(G))}else{G.addEventListener(R, C, false)}},C=function(name){return document.createElement(name)},
    getEvent=function(){if(document.all)return window.event;func = getEvent.caller;while (func != null) {var arg0 = func.arguments[0];if(arg0){if((arg0.constructor == Event||arg0.constructor == MouseEvent)||(typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)){return arg0;}func = func.caller;}return null;}},
	self = this,
	CONTAINER_ID 	= 'calendarelf';	//container id
	CALENDAR_TITLE	= 'calendartitle',	//calendar title
	CALENDAR_NOW	= 'calendar_now',
	PREV_YEAR		= 'PrevYear',
	PREV_MONTH		= 'PrevMonth',
	NEXT_YEAR		= 'NextYear',
	NEXT_MONTH		= 'NextMonth',
	CALENDAR_DATE	= 'calendar_date',
	CALENDAR_TIME	= 'calendar_time',
	CALENDAR_MINUTE	= 'calendar_minute',
	CALENDAR_SELECT	= 'calendarselect',
	CALENDAR_CLEAR	= 'calendarclear',
	INPUT_MINUTES	= 'inputminutes',
	START_YEAR		= 1930,				//start year
	END_YEAR		= 2020;				//end year
	if(typeof o=='string')o=$(o);else if(typeof o=='undefined')return false;
	this.lang = {year:['年',' Year '],month:['月',' Month '],now:['当前日期','Now'],weeks:[["日", "一", "二", "三", "四", "五", "六"], ["S", "M", "T", "W", "T", "F", "S"]],BS:['确定','Select'],BC:['清空','Clear'],time:['时间','Time'],LM:['精确分钟','Exact minutes']};
	this.L = l||0;
	this.S = s||1;
	this.C = o;
	this.F = f||'Y-m-d';
	this.year=this.month=this.day=this.hours=this.minutes=0;
	this.P;this.tempobj= [];
	this.creatediv=function(){
        if ($(CONTAINER_ID)) return;
		this.P = C("div");
		this.P.style.display = 'none';
		this.P.style.position = 'absolute';
		var div = C('div');
		div.id = CONTAINER_ID;
		div.style.position = 'absolute';
		div.style.zIndex = '99999';
		var iframe = C('iframe');
		iframe.id = 'calelf_iframe';
		iframe.src = "about:blank";
		iframe.style.position = 'absolute';
		iframe.frameBorder = '0';
		iframe.border = '0';
		iframe.style.height = "238px";
		this.P.appendChild(iframe);
		this.P.appendChild(div);
		if($yskj.size()>0){
			$yskj.append(this.P);
		}else{
			document.body.appendChild(this.P);
		}
		this.initstyle();
	};
    this.initstyle=function() {
        var style = "";
		style += '#'+CONTAINER_ID+'{font-size:12px;font-family:sans-serif;}.navbutton{font-size:13px;}';		
		style += '#'+CONTAINER_ID+' table{border-collapse:collapse;}';
		style += '#'+CONTAINER_ID+' td{padding:1px;}';
		style += '#'+CONTAINER_ID+' .datetime{border:1px solid #999999;background-color:#EEEEEE;}';
		style += '#'+CONTAINER_ID+' .date,'+'#'+CONTAINER_ID+' .time{padding:5px;background:#EEEEEE;}';
		style += '#'+CONTAINER_ID+' .navigation,'+'#'+CONTAINER_ID+' input{cursor:pointer;text-align:center;}';
		style += '#'+CONTAINER_ID+' td.date_con table,'+'#'+CONTAINER_ID+' td.time_con table,'+'#'+CONTAINER_ID+' td.minute_con table{width:100%;}';
		style += '#'+CONTAINER_ID+' .date_con td,'+'#'+CONTAINER_ID+' .time_con td,'+'#'+CONTAINER_ID+' .minute_con td{background:#fff;cursor:pointer;border:1px solid #eee;padding:2px 5px;color:#000;text-align:center;}';
		style += '#'+CONTAINER_ID+' .monthLabel{background-color:#fff;border:1px solid #999999;font-weight:bold;text-align:center;}';
		if (this.S != 0)style += '#'+CONTAINER_ID+' .monthLabel{height:24px;}.monthLabel td{font-size:13px;}';
		style += '#'+CONTAINER_ID+' .dayLabel{background:#003366;border:1px solid #003366;text-align:center;}';
		style += '#'+CONTAINER_ID+' .dayLabel td{color:#fff;}';
		style += '#'+CONTAINER_ID+' td.dayothermonth{color:#aaa;}';
		style += '#'+CONTAINER_ID+' td.weekend{background:#CCCCCC;}';
		style += '#'+CONTAINER_ID+' td.current{background:#ff8040;color:#fff;}';
		style += '#'+CONTAINER_ID+' .hr{height:1px;margin:2px 0;color:#CCCCCC;}';
		style += '#'+CONTAINER_ID+' input,#'+CONTAINER_ID+' select{border:1px solid #999999;}';
		style += '#'+CONTAINER_ID+' .minutesinput{float:right;}';
		style += '#'+CONTAINER_ID+' .minutesinput input{width:30px;}';
		style += '#'+CONTAINER_ID+' .calendar_button{text-align:center;}.monthLabel select{margin-right:5px}.calendar_button input{margin:0 15px 5px;}';
        var style_obj = C("style");
        style_obj.type = "text/css";
        document.getElementsByTagName('head')[0].appendChild(style_obj);
        if (style_obj.styleSheet) {
            style_obj.styleSheet.cssText = style;
        } else {
            style_obj.appendChild(document.createTextNode(style));
        }
    };
	this.newdate=function(){
	    this.year	= new Date().getFullYear();
	    this.month	= new Date().getMonth();
		this.day	= new Date().getDate();
	    this.hours	= new Date().getHours();
		this.minutes= new Date().getMinutes();
	}
	this.html=function(){
		var iframewidth = 0;
		content = '<table class="datetime" cellspacing="0" cellpadding="0" border="0"><tbody><tr>';
		if(this.F.indexOf('y')!=-1||this.F.indexOf('m')!=-1||this.F.indexOf('d')!=-1){iframewidth+=194;content += '<td valign="top" class="date">'+this.htmld()+'</td>';}
		if(this.F.indexOf('h')!=-1||this.F.indexOf('i')!=-1){iframewidth+=194;content += '<td valign="top" class="time">'+this.htmlt()+'</td>';}
		content += '</tr><tr><td colspan="3" class="calendar_button"><input type="button" value="'+this.lang.BS[this.L]+'" id="calendarselect"/><input type="button" value="'+this.lang.BC[this.L]+'" id="calendarclear"/></td></tr></tbody></table>';
		$(CONTAINER_ID).innerHTML = content;
		$('calelf_iframe').width = iframewidth+'px';
		if (this.S != 0){this.Syearmonth();}
	};
	this.htmld=function(){
		var str = '<table cellspacing="0" cellpadding="0" border="0"><tbody>';
		str += '<tr class="monthLabel"><td id="calendartitle" colspan="7"></td></tr>';
		str += '<tr class="navigation"><td class="navbutton" id="PrevYear"><<</td><td class="navbutton" id="PrevMonth"><</td>';
		str += '<td colspan="3" class="navbutton" id="calendar_now">'+this.lang.now[this.L]+'</td><td class="navbutton" id="NextMonth">></td><td class="navbutton" id="NextYear">>></td></tr>';
		str += '<tr class="dayLabel">';
		for(var i=0;i<7;i++){str += '<td>'+this.lang.weeks[this.L][i]+'</td>'}
		str += '</tr><tr><td colspan="7" class="date_con"><div id="calendar_date"><table cellspacing="0" cellpadding="0" border="0">';
		for(var i=0;i<6;i++){
			str += '<tr class="calendarRow">';
			for(var j=0;j<7;j++){
				var style = '';
				if (j == 0 || j == 6){style = 'weekend';}
				str += '<td class="'+style+'"></td>'
			}
			str += '</tr>';
		}
		str += '</table></div></td></tr></tbody></table>';
		return str;
	};
	this.htmlt=function(){
		var str = '<table cellspacing="0" cellpadding="0" border="0">';	
		str += '<tbody><tr class="monthLabel"><td>'+this.lang.time[this.L]+'</td></tr><tr><td class="time_con">'
		str += '<div id="calendar_time"><table cellspacing="0" cellpadding="0" border="0">';
		for(var i=0;i<4;i++){
			str += '<tr>';
			for(var j=0;j<6;j++){str += '<td class="hour">'+(i*6+j)+'</td>';}
			str += '</tr>';
		}
		str += '</table></div></td></tr><tr><td><hr class="hr"/></td></tr><tr><td class="minute_con">';
		str += '<div id="calendar_minute"><table cellspacing="0" cellpadding="0" border="0">'
		str += '<tr><td class="minute">:00</td><td class="minute">:05</td><td class="minute">:10</td><td class="minute">:15</td><td class="minute">:20</td><td class="minute">:25</td></tr>';
		str += '<tr><td class="minute">:30</td><td class="minute">:35</td><td class="minute">:40</td><td class="minute">:45</td><td class="minute">:50</td><td class="minute">:55</td></tr>';
		str += '</table></div></td></tr>';
		str += '<tr class="minutesinput"><td>'+this.lang.LM[this.L]+':<input id="inputminutes" maxlength="2"/></td></tr><tr><td><hr class="hr"/></td></tr>';
		str += '</tbody></table>';
		return str;
	};
	this.readdate=function(){
		this.F=this.F.toLowerCase();
		var v=this.C.value;
		if(v==''||v.split("-").length!=3){this.newdate();return;}
		var arr,date,time;
		if(v.split(" ").length==2){
			arr=v.split(" ");date=arr[0].split("-");time=arr[1].split(":");
		    this.hours=time[0]*1;this.minutes=time[1]*1;
		}else{date=v.split("-");}
	    this.year=date[0]*1;this.month=date[1]-1;this.day=date[2]*1;
	};
	this.pzero=function(v){var v=v*1;if(v<10)return ('0'+v);else return v;};
	this.dayarr=function(y, m){
	    var result,arr = [],n=0,p=0,day = new Date(y,m,1).getDay(),nowdaynum = new Date(y,m+1,0).getDate(),prevdaynum = new Date(y,m,0).getDate();
		for(var i=0;i<42;i++){
			if(i<day){arr[i]=prevdaynum-(day-1)+i;}
			else if(i+1>nowdaynum+day){n++;arr[i]=n;}
			else{p++;arr[i]=p;}
		}
		result = {'v':arr,'si':day,'ni':nowdaynum+day};
	    return result;
	};
	this.assign=function(){
		if($(CALENDAR_TITLE)!=null){if(this.S==0){$(CALENDAR_TITLE).innerHTML = this.year+this.lang.year[this.L]+(this.month+1)+this.lang.month[this.L];}else{var o=$(CALENDAR_TITLE).getElementsByTagName('select');o[0].value=this.year;o[1].value=this.month+1;}}
		var f=this.F.replace(/y/g,this.year),f=f.replace(/m/g,this.pzero(this.month+1)),f=f.replace(/d/g,this.pzero(this.day)),f=f.replace(/h/g,this.pzero(this.hours)),f=f.replace(/i/g,this.pzero(this.minutes));
		this.C.value=f;
	};
	this.tdclick=function(o,type){
		if(typeof this.tempobj[type]!='undefined')this.tempobj[type].className = this.tempobj[type].className.replace(/\scurrent/g,'');
		this[type] = o.innerHTML.replace(/:/g,'');
		o.className = o.className+' current';
		this.tempobj[type] = o;
		this.assign();
	};
	this.process=function(){
		this.assign();
	    var R = this.dayarr(this.year,this.month);
		if($(CALENDAR_DATE)!=null){
			var tds = $(CALENDAR_DATE).getElementsByTagName("td");
			for(var i=0;i<tds.length;i++){
		        tds[i].innerHTML = R.v[i];
		        if(i>=R.si&&i<(R.ni)){
					tds[i].className	= tds[i].className.indexOf('weekend')!=-1?'weekend day':'day';
					if(tds[i].innerHTML==this.day)this.tdclick(tds[i],'day');
		            tds[i].onclick 		= function(){self.tdclick(this,'day');};
					tds[i].ondblclick 	= function(){self.tdclick(this,'day');self.hide();};
					tds[i].onmouseover	= function(){self.tempobj['color']=this.style.backgroundColor;this.style.backgroundColor='#EBE4C0';}
					tds[i].onmouseout	= function(){this.style.backgroundColor=self.tempobj['color'];}
					tds[i].onselectstart= function(){return false;};
		        }else{
					if(i<R.si){tds[i].onclick=function(){self.Pmonth();};}
					else {tds[i].onclick= function(){self.Nmonth();};}
					tds[i].onmouseover	= tds[i].onmouseout=function(){};
					tds[i].className	= tds[i].className.indexOf('weekend')!=-1?'weekend dayothermonth':'dayothermonth';
				}
		    }
		}
		if($(CALENDAR_TIME)!=null){
		    tds = $(CALENDAR_TIME).getElementsByTagName("td");
			for(var i=0;i<tds.length;i++){
				if(tds[i].innerHTML==this.hours)this.tdclick(tds[i],'hours');
	            tds[i].onclick 		= function(){self.tdclick(this,'hours');}
				tds[i].ondblclick 	= function(){self.tdclick(this,'hours');self.hide();};
		    }
		    tds = $(CALENDAR_MINUTE).getElementsByTagName("td");
			for(var i=0;i<tds.length;i++){
				if(tds[i].innerHTML==this.minutes){this.tempobj.s=true;this.tdclick(tds[i],'minutes');}
		        tds[i].onclick		= function(){self.tdclick(this,'minutes');$(INPUT_MINUTES).value='';};
				tds[i].ondblclick 	= function(){self.tdclick(this,'minutes');self.hide();};
		    }
			if(this.tempobj.s!=true){$(INPUT_MINUTES).value=this.minutes;};
		}
	};
	this.Syearmonth=function(){
		if($(CALENDAR_TITLE)==null)return;
		var o=$(CALENDAR_TITLE);
		var y = C("select"),m = C("select");
		for(var i=START_YEAR;i<=END_YEAR;i++){y.options[y.length] = new Option(i+this.lang.year[this.L], i);}
		for(var i=1;i<=12;i++){m.options[m.length] = new Option(i+this.lang.month[this.L], i);}
		y.onchange=function(){self.year=this.options[this.options.selectedIndex].value;self.process();}
		m.onchange=function(){self.month=this.options[this.options.selectedIndex].value-1;self.process();}
		o.innerHTML='';y.value=this.year;m.value=this.month+1;o.appendChild(y);o.appendChild(m);
	};
	this.Pmonth=function(){if(this.month==0){this.year--;this.month=11;}else{this.month--;};this.process();};
	this.Nmonth=function(){if(this.month==11){this.year++;this.month=0;}else{this.month++;};this.process();}
	this.prentobj=function(o){o.parentNode};
	this.pevent=function(){
		document.onclick=function(){var objevent=getEvent();var o=typeof(objevent.srcElement)=="undefined"?objevent.target:objevent.srcElement;for(var i=0;i<30;i++){if(o==null||typeof o =='undefined'||(o.tagName=='INPUT'&&self.C==o)||o.id==CONTAINER_ID){return;}if(o.nodeName=='BODY'||o.nodeName=='HTML'){self.hide();return;}o=o.parentNode;}}
		if($(CALENDAR_NOW)!=null)$(CALENDAR_NOW).onclick		= function(){self.newdate();self.process();}
		if($(PREV_YEAR)!=null)$(PREV_YEAR).onclick				= function(){self.year--;self.process();}
		if($(PREV_MONTH)!=null)$(PREV_MONTH).onclick			= function(){self.Pmonth();}
		if($(NEXT_YEAR)!=null)$(NEXT_YEAR).onclick				= function(){self.year++;self.process();}
		if($(NEXT_MONTH)!=null)$(NEXT_MONTH).onclick			= function(){self.Nmonth();}
		if($(CALENDAR_SELECT)!=null)$(CALENDAR_SELECT).onclick	= function(){self.hide();}
		if($(CALENDAR_CLEAR)!=null)$(CALENDAR_CLEAR).onclick	= function(){self.C.value='';self.hide();}
		if($(INPUT_MINUTES)!=null)$(INPUT_MINUTES).onchange		= function(){if(this.value>-1&&this.value<61){self.minutes=this.value;self.assign();self.tempobj.minutes.className = self.tempobj.minutes.className.replace(/\scurrent/g,'');}else{this.value='';}}
		if($(CALENDAR_TITLE)!=null&&this.S==0)$(CALENDAR_TITLE).ondblclick	= function(){if(this.innerHTML.length<20){self.Syearmonth();}else{self.assign();}}
	};
	this.show=function(){
        var getAbsPoint = function(e){var x = e.offsetLeft,y = e.offsetTop;while (e = e.offsetParent) {x += e.offsetLeft,y += e.offsetTop;}return {"x": x,"y": y};};
	    var xy = getAbsPoint(this.C);
	    this.P.style.left = xy.x + "px";
	    this.P.style.top = (xy.y + this.C.offsetHeight) + "px";
	    this.P.style.display = '';
	};
	this.hide=function(){this.P.style.display = 'none';};
	(this.init=function(){
		this.creatediv();
		this.readdate();
		this.html();
		this.show();
		this.process();
		this.pevent();
	})();
}

$(document).delegate('[data-calelf]','click',function(){
	var str=$(this).data('calelf');
	calelf(this,str);	
});

	module.exports={
		calelf:calelf
	}
});