/***
 * generzhang@tencent.com
 * 2013-11-13
 */
$(function(){
	var url, html;
	$.flow.sub($.flow.subjectId_2, function(e){//双击空白
		rememberScrollPosition();
		resetPageScroll();
		
		url = "w/flow_editor/update_flow_page?id=" + $.flow.flowDefId;
	    html = '<div id="UPDATE_LAYER" style="z-index:999999;overflow:scroll;position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px; background-color: #FFFFFF">';
	    html += '<iframe width="100%" frameborder="0" src="' + url + '" onload="autoChangeIframeHeight()"/>';
//	    html += '<iframe width="100%" frameborder="0" src="http://localhost:8080/web/jsp/custom/guide.jsp" onload="autoChangeIframeHeight()"/>';
	    html += "</div>";
	    $("body").append(html);
	});
	
	$.flow.sub($.flow.subjectId_16, function(node){//双击节点
		if (node.nodeType == "fork" || node.nodeType == "join") {
	        return;
	    }
		
		var name = node.shape.find(".textSpan").text();
		
	    url = "w/flow_editor/update_" + node.nodeType.replace('start', 'task') + "_page?id=" + node.id + "&flowDefId=" + $.flow.flowDefId + '&name=' + name;
	    openPage(url);
	});
	
	
	$.flow.sub($.flow.subjectId_17, function(link){//双击线条

		var name = link.noteObj.shape.text();
//	    url = "w/flow_editor/update_output_page?id=" + link.id + "&flowDefId=" + $.flow.flowDefId + "&taskDefId=" + link.from.id + '&ouputTaskDefId=' + link.to.id + '&name=' + name;
		url = "w/flow_editor/update_output_page?id=" + link.id + "&flowDefId=" + $.flow.flowDefId + '&name=' + name;
		openPage(url);
	});
	
	function openPage(url){
		rememberScrollPosition();
		resetPageScroll();
		
		html = '<div id="UPDATE_LAYER" style="z-index:999999;overflow:scroll;position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px; background-color: #FFFFFF">';
	    html += '<iframe width="100%" frameborder="0" src="' + url + '" onload="autoChangeIframeHeight()"/>';
	    html += "</div>";
	    $("body").append(html);
	}
	
	function addTabs(title, url){
		if (typeof(top.parent.addTab) == "function") {
	        top.parent.addTab(title, url);
	    } else {
	        window.open(url);
	    }
	}
	
	function rememberScrollPosition(){
		$.backScrollTop = $(window).scrollTop();
		$.backScrollLeft = $(window).scrollLeft();
	}
	
	function resetPageScroll(){
		 $('body').addClass('edit_page');
         $(window).scrollTop(0);
         $(window).scrollLeft(0);
	}
	
	window.backToScrollPosition = function(){
		$(window).scrollTop($.backScrollTop);
		$(window).scrollLeft($.backScrollLeft);
	}
	
	window.flowStateChange = function(){
	    $('btn_save').addClass('flow_edit_flag');
	}
	
});