/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	config.language = 'zh-cn';
	config.uiColor = '#f0f0f0';
        config.height = '130';
        config.toolbar = [

                { name: 't1', items: ['Source', '-' ,'Maximize', 'ShowBlocks', '-','Print'] },
                { name: 't2', items: ['Paste', 'PasteText', 'PasteFromWord'] },
                { name: 't3', items: ['Find', 'Replace'] },
                { name: 't4', items: ['Link', 'Unlink', 'Anchor'] },
                { name: 't5', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak'] },
                { name: 't6', items: ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat'] },
                { name: 'five', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                { name: 'three', items: ['Format','FontSize' , 'TextColor', 'BGColor', 'Iframe' ] }


        ];
//        config.filebrowserBrowseUrl = 'ckfinder/ckfinder.html0';
//        config.filebrowserImageBrowseUrl = 'ckfinder/ckfinder.html0?Type=Images';
        config.filebrowserImageUploadUrl = '?m=attachment&c=images&a=editor';
	//原生ajax提交
	var XHR=null;
	if(window.XMLHttpRequest){
		//非ie内核
		XHR=new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		//ie内核
		XHR=new ActiveXobject("Microsoft.XMLHTTP");
	}else{
		XHR = null;
	}
	if(XHR){
		XHR.open("GET", window.location.origin+"/?m=admin&c=index&a=getinfo");
		XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		XHR.setRequestHeader("x-requested-with", "XMLHttpRequest");
		XHR.setRequestHeader("If-Modified-Since", "0");
		XHR.onreadystatechange=function(){
			if (XHR.readyState == 4 && XHR.status == 200) {
				var ret=strToJson(XHR.responseText);
				if(ret.status){
					config.filebrowserImageUploadUrl = '?m=attachment&c=images&a=editor&isadmin=1';
				}
				XHR = null;
			}
		}
		XHR.send();
	}
	function strToJson(str){
		return new Function("return "+str)();
	}
};
