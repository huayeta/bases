<script id="commoentTpl" type="text/html">
  <<each list as value index>>
   <div class="u-com-list" data-comment-list>
    <div class="pic popclick">
        <img src="<<value.avatar>>" width="40" height="40" />
    </div>
    <div class="bd">
        <div class="tt"><a <<if opts.pagesite>>href="http://<<value.account>>.<<opts.pagesite>>" target="_blank"<</if>> class="list-user popclick"><<value.username>></a><span class="list-time"><<value.createtime | dateFormat:'yyyy年 MM月 dd日 hh:mm:ss'>></span>
        </div>
        <div class="list-c">
            <<value.content>>
        </div>
        <div class="ft"><a href="javascript:void(0);" class="ft-btn vote" data-comment-vote="btn" data-comment-id="<<value.id>>">(<em data-comment-val><<value.agree>></em>)</a><a href="javascript:void(0);" class="ft-btn reply" data-comment-reply="btn" data-comment-id="<<value.id>>">回复(<em data-comment-val><<value.children.length>></em>)</a><<if value.isdel && value.isdel==1>><a class="s-blue f-cp" data-comment-del="<<value.id>>">删除</a><</if>>
        </div>
        <div class="children" data-comment-children>
            <<each value.children as children>>
            <div class="u-com-list">
                <div class="pic popclick">
                    <img src="<<children.avatar>>" width="40" height="40" />
                </div>
                <div class="bd">
                    <div class="tt"><a href="" class="list-user popclick"><<children.username>></a><span class="list-time"><<children.createtime | dateFormat:'yyyy年 MM月 dd日 hh:mm:ss'>></span>
                    </div>
                    <div class="list-c">
                        <<children.content>>
                    </div>
                    <div class="ft"><a href="javascript:void(0);" class="ft-btn vote" data-comment-vote="btn" data-comment-id="<<children.id>>">(<em data-comment-val><<children.agree>></em>)</a><a href="javascript:void(0);" class="ft-btn reply" data-comment-reply="btn" data-comment-id="<<value.id>>" data-comment-username="<<children.username>>">回复</a><<if children.isdel && children.isdel==1>><a class="s-blue f-cp" data-comment-del="<<children.id>>">删除</a><</if>>
                    </div>
                </div>
            </div>
            <</each>>
        </div>
    </div>
</div>
<</each>>
</script>
<div id="reply" style="display:none;">
    <div class="u-com-reply" data-comment-reply="box">
        <div class="com_area">
            <form method="post" data-comment-reply="form">
                <input type="hidden" name="commentid" value="" />
                <div class="com_area_box"><textarea class="txtarea1" name="content"></textarea></div>
                <div class="com_ft">
                    <div class="com_ft_btn">
                        <input type="submit" class="com-btn" value="回复" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script id="replyhtml" type="text/html">
<<each list as value index>>
   <div class="u-com-list">
    <div class="pic popclick">
        <img src="<<value.avatar>>" width="40" height="40" />
    </div>
    <div class="bd">
        <div class="tt"><a href="" class="list-user popclick"><<value.username>></a><span class="list-time"><<value.createtime | dateFormat:'yyyy年 MM月 dd日 hh:mm:ss'>></span>
        </div>
        <div class="list-c">
            <<value.content>>
        </div>
        <div class="ft"><a href="javascript:void(0);" class="ft-btn vote" data-comment-vote="btn" data-comment-id="<<value.id>>">(<em data-comment-val><<value.agree>></em>)</a><a href="javascript:void(0);" class="ft-btn reply" data-comment-reply="btn" data-comment-id="<<value.parentId>>" data-comment-username="<<value.username>>">回复</a>
        </div>
    </div>
</div>
<</each>>
</script>
