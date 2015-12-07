/***
 * generzhang@tencent.com
 * 2013-11-13
 */
$(function(){
	function submitFlow(success){
		var startNodeCount = 0, node, params;
		
		for(var i=0,len=$.flow.nodes.length; i<len; i++){
			node = $.flow.nodes[i];
			
			if(node.toLinks.length == 0){
				startNodeCount++;
			}
			
			if(node.fromLinks.length == 0 && node.toLinks.length == 0){
				$.messager.alert('提示','流程存在孤立点! <br>名称为“'+node.shape.find(".textSpan").text()+'”','error');
				return ;
			}
			
			if(node.nodeType != 'end' && node.fromLinks.length == 0){
				$.messager.alert('提示','“'+node.shape.find(".textSpan").text()+'”不能作为结束任务','error');
				return ;
			}
			
			if(startNodeCount > 1){
				$.messager.alert('提示','流程不能同时存在多个开始任务!','error');
				return ;
			}

		}
		
		$.flow.pub($.flow.subjectId_7, function(jsonObj){
			
			if(!$.flow.name){
				$.messager.prompt('流程名称', '请输入流程名称', function(msg){
					if(msg && msg.trim()){
						$.flow.name = msg;
						success($.flow.name, jsonObj);
					}else{
						$.messager.alert('错误提示','流程名称不能为空!','error');
					}
				});
			}else{
				success($.flow.name, jsonObj);
			}
			
			
		});
	}
	
	$("#btn_save").click(function(e){
		submitFlow(function(flowName, jsonObj){
			params = {id:$.flow.flowDefId, name:flowName, json: JSON.stringify(jsonObj), ids:$.flow.ids.join(','), flow_tmp_id:$.flow.flow_tmp_id, timeStamp:generateUniqId()}
			$.ajaxSetup({async: false});
			$.post(
				WFE.getBaseUrl() + "w/flow_editor/save_flow",
				params,
	    		function(ret){
					if(ret.code == 500){
						$.messager.alert('提示','流程保存失败!'+ret.data,'error');
					}else{
						$.messager.show({
							title:'提示',
							msg:'流程保存成功!',
							showType:'fade',
							style:{
								right:'',
								bottom:''
							}
						});
					}
	    		},
	    		'json'
			);
			$.ajaxSetup({async: true});
		});
	});
	
	$('#btn_layout').click(function(){
		
		var node, link, i, k, len, length, ax, ay, bx, by, layoutNodes;
		
		for(var k=0,len=$.flow.links.length; k<len; k++){
			$.flow.links[k].layouted = false;
			$.flow.links[k].layoutNode = null;
		}
		$.flow.layoutChange = false;
		$.flow.onLayout = true;
		$.flow.linkLayout = {};
		
		layoutNodes = $.flow.keyboard.nodes.length?$.flow.keyboard.nodes:$.flow.nodes;
		
		layoutNodes.sort(function(a, b){
			ax = a.shape.offset().left;
			ay = a.shape.offset().top;
			bx = b.shape.offset().left;
			by = b.shape.offset().top;
			
			if(ax > bx || (ax == bx && ay > by)){
				return 1;
			}else{
				return -1;
			}
			
		});
		
		for(i=0,len=layoutNodes.length; i<len; i++){
			node = layoutNodes[i];
			
			for(k=0,length=node.fromLinks.length; k<length; k++){
				link = node.fromLinks[k];
				link.layoutNode = node;
				$.flow.linkPainter.drawLink(link, true);
			}
		}
		
		for(i=0,len=layoutNodes.length; i<len; i++){
			node = layoutNodes[i];
			
			for(k=0,length=node.toLinks.length; k<length; k++){
				link = node.toLinks[k];
				if(!link.layoutNode){
					link.layoutNode = node;
					$.flow.linkPainter.drawLink(link, true);
				}
			}
		}
		
		$.flow.onLayout = false;
		if($.flow.layoutChange){
			$.flow.pub($.flow.subjectId_9, '排版按钮');
		}
	});
	
	$('#btn_delete').click(function(){
		var node, isDelete = false;
		for(var i=0,len=$.flow.keyboard.links.length; i<len; i++){
			$.flow.deleteLinks($.flow.keyboard.links);
			$.flow.keyboard.setLinksNull();
			isDelete = true;
		}
		
		for(var j=0,length=$.flow.keyboard.nodes.length; j<length; j++){
			node = $.flow.keyboard.nodes[j];
			$.flow.deleteNodeLinks(node);
			node.deleted = true;
			$.flow.resetFlowNodes();
			node.shape.remove();
			$.flow.removeTempLink();
			isDelete = true;
		}
		if(isDelete){
			$.flow.pub($.flow.subjectId_9, $.flow.deleteDtnStr||'删除按钮');
		}
		$.flow.pub($.flow.subjectId_6, $.flow.getMaxPosition());
	});
	
	$('#btn_clone').click(function(e){
		$.flow.pub($.flow.subjectId_14, '克隆按钮');
		$.flow.pub($.flow.subjectId_15, '克隆按钮');
		$.flow.clipboardNodes = [];
	});
	
	$('#btn_undo').click(function(e){
		$.flow.pub($.flow.subjectId_11, '撤销按钮');
	});
	
	$('#btn_redo').click(function(e){
		$.flow.pub($.flow.subjectId_12, '重做按钮');
	});
	
	$('#btn_preview').click(function(e){
		$.ajax({
		    url: "w/page_editor/add_short_data",
		    data: {
		        content: JSON.stringify($.flow.getFlowInfo(true))
		    },
		    dataType: "json",
		    type: "POST",
		    async: true,
		    success: function(json) {
		    	var url = WFE.getBaseUrl() + "w/flow_editor/preview_flow?shortDataId=" + json.data+"&type=SHORT_DATA";
			    WFE.openUrl(url, "流程预览");
		    },
		    error: function(a, b, c) {
		        alert("error");
		    }
		});
	});
	$('#btn_debug').click(function(e){
		submitFlow(function(flowName, jsonObj){
			params = {id:$.flow.flowDefId, name:flowName, json: JSON.stringify(jsonObj), ids:$.flow.ids.join(','), flow_tmp_id:$.flow.flow_tmp_id, timeStamp:generateUniqId()};
			$.ajaxSetup({async: false});
			$.post(
				WFE.getBaseUrl() + "w/flow_editor/save_flow_tmp",
				params,
	    		function(ret){
					if(ret.code == 500){
						$.messager.alert('提示','流程调试失败!'+ret.data,'error');
						$('.window-shadow').remove();
					}else{
						WFE.openUrl(WFE.getBaseUrl() + "w/flow/start_instance_page?id=" + ret.data, "调试流程");
					}
	    		},
	    		'json'
			);
			$.ajaxSetup({async: true});
		});
	});
	
});