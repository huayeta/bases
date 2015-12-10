function webuploaderFile(){
	//var $ = jQuery;   // just in case. Make sure it's not an other libaray.
	
var $list=$('#thelist');
var uploaderList=$('#uploader-img-list');
	window.uploaderVal=[];
var dialog = top.dialog.get(window);
var size=dialog.data.size;
var serverUrl=dialog.data.url?dialog.data.url:'?m=attachment&c=attachment&a=upload';
serverUrl+='&isadmin='+dialog.data.isadmin;
// var extensions='jpg,png,jpeg,gif,bmp,doc,docx,xls,xlsx,ppt,wma,rar,zip,mp3,7z,tar,tar.gz,txt';
// $.ajax({
//    url:'?m=member&c=index&a=getconfig',
//    type:'GET',
//    beforeSend:function(XMLHttpRequest){
//        XMLHttpRequest.setRequestHeader('Date-Type','json');
//    },
//    dataType:'json',
//    async:false,
//    success:function(ret){
//        if(ret.status && ret.info && ret.info.upload){
//            extensions=ret.info.upload.alowexts;
//        }
//    }
// });

var uploader = WebUploader.create({

    // swf文件路径
    swf: '/js/plugins/webuploader/Uploader.swf',

    // 文件接收服务端。
    server: serverUrl,

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: {
        id: '#filePicker',
        label: '点击上传'
    },
    disableGlobalDnd: true,
    chunked: false,
    auto:true,//自动上传

    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
    resize: false,
	accept: {
           title: 'Files',
           extensions: '*'
   },
	fileNumLimit: 300,
	fileSizeLimit: 50000 * 1024 * 1024,    // 5000 M
	fileSingleSizeLimit: 5000 * 1024 * 1024    // 10 M
});

$('#ctlBtn').click(function(){
	uploader.upload();	
});

// 当有文件被添加进队列的时候
uploader.on( 'fileQueued', function( file ) {
    $list.append( '<div id="' + file.id + '" class="item"><!--<a href="javascript:void(0);" class="del"></a>-->' +
        '<h4 class="info">' + file.name + '</h4>' +
        '<p class="state">等待上传...</p>' +
    '</div>' );
	
	/*$list.delegate('.del','click',function(){
		uploader.removeFile(file.id,true);	
		$(this).closest('.item').fadeOut();
	});*/
});

// 文件上传过程中创建进度条实时显示。
uploader.on( 'uploadProgress', function( file, percentage ) {
    var $li = $( '#'+file.id ),
        $percent = $li.find('.progress .progress-bar');

    // 避免重复创建
    if ( !$percent.length ) {
        $percent = $('<div class="progress progress-striped active">' +
          '<div class="progress-bar" role="progressbar" style="width: 0%">' +
          '</div>' +
        '</div>').appendTo( $li ).find('.progress-bar');
    }

    $li.find('p.state').text('上传中');

    $percent.css( 'width', percentage * 100 + '%' );
});

uploader.on( 'uploadSuccess', function( file ) {
    $( '#'+file.id ).find('p.state').text('已上传');
});

uploader.on( 'uploadError', function( file ) {
    $( '#'+file.id ).find('p.state').text('上传出错');
});

uploader.on( 'uploadComplete', function( file ) {
    $( '#'+file.id ).find('.progress').fadeOut();
	$( '#'+file.id ).fadeOut();
	uploaderList.fadeIn();
}); 

 uploader.onError = function( code ) {
        switch (code){
			case 'Q_EXCEED_NUM_LIMIT':
				alert('添加的文件数量超出');
				break;
			case 'Q_EXCEED_SIZE_LIMIT':
				alert('添加的文件总大小超出');
				break;
			case 'Q_TYPE_DENIED':
				alert('文件类型不对');
				break;
			case 'F_DUPLICATE':
				alert('不能重复选择相同的文件');
				break;
			case 'F_EXCEED_SIZE':
				alert('单个文件大小超出');
				break;
			default:
				alert('error ：'+code)
		}
    };


	uploader.onUploadSuccess=function(file,response){
		if(response.status){
			uploaderVal.push(response.info);
			var tbody=uploaderList.find('tbody');
			var tpl='<tr><td><a href="javascript:void(0);" class="file">'+response.info.filename+'</a></td></tr>';
			tbody.append(tpl);
			updateLoaderList();
		}else{
			alert(response.info);	
		}
	}
	function updateLoaderList(){
		if(size>updateLoaderSize()){
			uploaderList.find('tr:last .file').trigger('click');	
		}
	}
	function updateLoaderSize(){
		return uploaderList.find('tr.on').size();
	}
	uploaderList.delegate('tr .file','click',function(){
		var _this=$(this).closest('tr');
		if(_this.is('.on')){
			_this.removeClass('on');	
		}else{
			if (size>updateLoaderSize()){
				_this.addClass('on');
			}else{
				uploaderList.find('tr.on:first').removeClass('on');
				_this.addClass('on');	
			}
		}
	});
}
webuploaderFile();