/***
 * generzhang@tencent.com
 * 2013-11-13
 */
$(function () {
	$.flow.sub($.flow.subjectId_20, function(info){
		if($.flow.readOnly){
			$('#flow_tools').hide();
			$('#flowHelp').hide();
			$('body').addClass('body-readonly');
		}else{
			$('#flow_tools').show();
			$('#flowHelp').show();
			$('body').removeClass('body-readonly');
			
			$.flow.toolBox.init();
			$.flow.toolBoxMove();
			
			$.flow.sub($.flow.subjectId_22, function(callback){
				callback();
			});
			
			$.flow.sub($.flow.subjectId_23, function(callback){
				callback();
			});
			
			$.flow.sub($.flow.subjectId_24, function(callback){
				callback();
			});
		}
	});
	
	$.flow.sub($.flow.subjectId_21, function(info){
		if($.flow.readOnly){
			$.flow.pub($.flow.subjectId_6, $.flow.getMaxPosition());
			$.flow.disableAllSubject();
		}
	});
});