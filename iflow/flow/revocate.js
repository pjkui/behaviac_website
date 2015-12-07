/***
 * generzhang@tencent.com
 * 2013-11-13
 */

$(function(){
	
	$.flow.undoArr = [];
	$.flow.redoArr = [];
	$.flow.version = 1;
	
	var currentVersion;
	
	$.flow.sub($.flow.subjectId_9, function(type){//流程图有变化
		
		if(currentVersion){
			$.flow.undoArr.push(currentVersion);
		}
		currentVersion = {version:$.flow.version++, flow:$.flow.getFlowInfo(true)};
		$.flow.redoArr = [];
	});
	$.flow.sub($.flow.subjectId_11, function(type){//撤销操作
		if($.flow.undoArr.length){
			if(currentVersion){
				$.flow.redoArr.push(currentVersion);
			}
			currentVersion = $.flow.undoArr.pop();
		}
		$.flow.reInitFlow(currentVersion.flow);
		$.flow.pub($.flow.subjectId_6, $.flow.getMaxPosition());
	});
	$.flow.sub($.flow.subjectId_12, function(type){//重做操作
		if($.flow.redoArr.length){
			if(currentVersion){
				$.flow.undoArr.push(currentVersion);
			}
			currentVersion = $.flow.redoArr.pop();
		}
		$.flow.reInitFlow(currentVersion.flow);
		$.flow.pub($.flow.subjectId_6, $.flow.getMaxPosition());
	});
});