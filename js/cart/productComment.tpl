<div>
<script type="text/html" id="productComment">
    <table>
        <tbody>
           <<each items as item>>
            <tr>
                <td class="col-master">
                   <<if item.appendcontent==''>>
                    <div class="master-content"><<item.content>></div>
                    <<if item.image>>
                    <div class="master-photos">
                        <ul>
                           <<each item.image as image>>
                            <li><a class="j-fancyBox" href="<<image>>" target="_blank" rel="group<<item.id>>"><img src="<<image>>" /></a></li>
                            <</each>>
                        </ul>
                    </div>
                    <</if>>
                    <<if item.createtime && item.createtime!='0'>><div class="master-date"><<item.createtime | dateFormat:'MM.dd'>></div><</if>>
                    <<if item.children && item.children.length>0>>
                    <<each item.children as children>>
                    <div class="master-reply">卖家回复：<<children.content>></div>
                    <<if children.image>>
                    <div class="master-photos">
                        <ul>
                           <<each children.image as image>>
                            <li><a class="j-fancyBox" href="<<image>>" target="_blank" rel="group<<item.id>>"><img src="<<image>>" /></a></li>
                            <</each>>
                        </ul>
                    </div>
                    <</if>>
                    <</each>>
                    <</if>>
                    <<else>>
                    <div class="master-premiere">
                        <div class="tag">
                            <div class="tt">初次评价:</div>
                            <<if item.createtime && item.createtime!='0'>><div class="master-date"><<item.createtime | dateFormat:'MM.dd'>></div><</if>>
                        </div>
                        <div class="info">
                            <div class="master-content"><<item.content>></div>
                            <<if item.image>>
                            <div class="master-photos">
                                <ul>
                                   <<each item.image as image>>
                                    <li><a class="j-fancyBox" href="<<image>>" target="_blank" rel="group<<item.id>>"><img src="<<image>>" /></a></li>
                                    <</each>>
                                </ul>
                            </div>
                            <</if>>
                        </div>
                    </div>
                    <div class="master-premiere">
                        <div class="tag">
                            <div class="tt">追加评价:</div>
                        </div>
                        <div class="info">
                            <div class="master-content"><<item.appendcontent>></div>
                            <<if item.appendimage>>
                            <div class="master-photos">
                                <ul>
                                   <<each item.appendimage as image>>
                                    <li><a class="j-fancyBox" href="<<image>>" target="_blank" rel="group<<item.id>>"><img src="<<image>>" /></a></li>
                                    <</each>>
                                </ul>
                            </div>
                            <</if>>
                        </div>
                    </div>
                    <<if item.children && item.children.length>0>>
                    <<each item.children as children>>
                    <div class="master-reply">卖家回复：<<children.content>></div>
                    <<if children.image>>
                    <div class="master-photos">
                        <ul>
                           <<each children.image as image>>
                            <li><a class="j-fancyBox" href="<<image>>" target="_blank" rel="group<<item.id>>"><img src="<<image>>" /></a></li>
                            <</each>>
                        </ul>
                    </div>
                    <</if>>
                    <</each>>
                    <</if>>
                    <</if>>
                </td>
                <td class="col-meta">
                    <<if item.sales && item.sales.length>0>>
                    <<each item.sales as sale>>
                    <p class="sku"><span><<item.dicts[item.dicts[sale].pid].name>>：<<item.dicts[sale].name>></span></p>
                    <</each>>
                    <</if>>
                </td>
                <td class="col-author">
                    <div class="user-info">
                       <<item.name>><<if item.isanonymous=='1'>><span>匿名</span><</if>>
                    </div>
                </td>
            </tr>
            <</each>>
        </tbody>
    </table>
</script>
</div>