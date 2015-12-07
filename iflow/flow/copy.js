/***
 * generzhang@tencent.com
 * 2013-11-13
 */
$(function () {
	var clipNode, newNode;
	$.flow.clipboardNodes = [];
	$.flow.sub($.flow.subjectId_14, function(type){
		$.flow.clipboardNodes = [];
		for(var i=0,len=$.flow.keyboard.nodes.length; i<len; i++){
			clipNode = $.flow.keyboard.nodes[i];
			newNode = {};
			
			newNode.nodeX = clipNode.shape.offset().left+clipNode.shape.width()*2;
			newNode.nodeY = clipNode.shape.offset().top+clipNode.shape.height()/2;
			newNode.nodeText = clipNode.shape.find(".textSpan").text();
			newNode.nodeType = clipNode.nodeType;
			newNode.nodeWidth = clipNode.shape.width();
			newNode.nodeHeight = clipNode.shape.height();
			
			$.flow.clipboardNodes.push(newNode);
		}
	});
	$.flow.sub($.flow.subjectId_15, function(type){
		var shape, shapes = [];
		for(var i=0,len=$.flow.clipboardNodes.length; i<len; i++){
			newNode = $.flow.clipboardNodes[i];
			shapes.push($.flow.createNode(newNode.nodeType, newNode.nodeText, newNode.nodeX, newNode.nodeY, null, true, true));
			newNode.nodeX = newNode.nodeX+newNode.nodeWidth*2;
			newNode.nodeY = newNode.nodeY+newNode.nodeHeight/2;
		}
		$('.userUICom').removeClass('nodeSelected');
		$.flow.keyboard.setNodesNull();
		for(var j=0, length=shapes.length; j<length; j++){
			shape = shapes[j];
			shape.addClass('nodeSelected');
			$.flow.keyboard.addNode(shape[0].nodeObj);
		}
		
		$.flow.pub($.flow.subjectId_6, $.flow.getMaxPosition());
		$.flow.pub($.flow.subjectId_9, '复制粘贴');
	});
});