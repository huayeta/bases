<div>
	<script type="text/html" id="productComment">
		<<each items as item>>
		<div class="comment-item">
            <div class="comment-user"><<item.name>></div>
            <div class="comment-content"><<item.content>></div>
            <div class="comment-date">
                <<if item.createtime && item.createtime!='0'>><<item.createtime | dateFormat:'yyyy-MM-dd hh:mm:ss'>> <</if>>
                <<if item.sales && item.sales.length>0>>
                <<each item.sales as sale>>
                <<item.dicts[item.dicts[sale].pid].name>>：<<item.dicts[sale].name>>;
                <</each>>
                <</if>>
            </div>
            <<if item.image>>
            <div class="comment-images">
                <ul>
                	<<each item.image as image>>
                    <li><img src="<<image>>"></li>
                    <</each>>
                </ul>
            </div>
            <</if>>
            <<if item.appendcontent>><div class="comment-content"><span class="tt">追加评论：</span><<item.appendcontent>></div><</if>>
            <<if item.appendimage>>
            <div class="comment-images">
                <ul>
                	<<each item.appendimage as image>>
                    <li><img src="<<image>>"></li>
                    <</each>>
                </ul>
            </div>
            <</if>>
            <<if item.children && item.children.length>0>>
            <<each item.children as children>>
            <div class="comment-reply">卖家回复：<<children.content>></div>
            <<if children.image>>
            <div class="comment-images">
                <ul>
                    <<each children.image as image>>
                    <li><img src="<<image>>"></li>
                    <</each>>
                </ul>
            </div>
            <</if>>
            <</each>>
            <</if>>
        </div>
        <</each>>
	</script>
</div>