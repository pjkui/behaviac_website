/***
 * generzhang@tencent.com
 * 2013-11-13
 */
$(function () {

	//创建绘图对象
	$.flow.r = Raphael("flow");
	$.flow.r.id = "flow";
	$.flow.initRaphael();
	
	$.flow.readOnly = $('body').attr('data-readonly')=='true'?true:false;
	
	$.flow.r.setSize($.flow.flow.width(), $.flow.flow.height());
	
	var url, params, data, json;
	
	$.flow.flowDefId = $.Params.get("id");
	
	$.flow.flow_tmp_id = '';
	$.flow.temp_ids = {};
	$.flow.ids = [];
	
	if($.flow.readOnly){
		$.flow.pub($.flow.subjectId_20, '准备初始化');
		init($.previewData||[]);
	}else{
		$.flow.readOnly = false;
		$.flow.pub($.flow.subjectId_20, '准备初始化');
		$.flow.flowDefId = generateUniqId();
		init([]);
	}
	
	function resizeArea(width, height){
		width = Math.max(width, $(window).width()-20);
		height = Math.max(height, $(window).height()-20);
		$('body').width(width);
		$('body').height(height);
		$.flow.flow.width(width);
		$.flow.flow.height(height);
		$.flow.r.setSize($.flow.flow.width(), $.flow.flow.height());
	}
	
	
	function init(nodes){
		
		$.flow.initFlow(nodes);
		
		$.each($(".imgDIV"), function(i, obj){
			$.flow.toolNodeMove($(obj));
		});
		
		$.flow.sub($.flow.subjectId_6, function(maxPosition){
			if($('body')[0].scrollHeight - $(window).height() - $(window).scrollTop() < 10){
				$(window).scrollTop(maxPosition.y);
			}
			
			if($('body')[0].scrollWidth - $(window).width() - $(window).scrollLeft() < 10){
				$(window).scrollLeft(maxPosition.x);
			}
			resizeArea(maxPosition.x+20, maxPosition.y);
		});
		
		$('body').keydown(function(e){
			if(e.keyCode == 46){//delete
				$.flow.pub($.flow.subjectId_10, e);
			}else if(e.keyCode == 72 && e.ctrlKey){
				$.flow.pub($.flow.subjectId_19, 'ctrlKey_H');
			}else if(e.keyCode == 70 && e.ctrlKey){
				$.flow.pub($.flow.subjectId_18, 'ctrlKey_F');
			}else if(e.keyCode == 67 && e.ctrlKey){
				$.flow.pub($.flow.subjectId_14, 'ctrlKey_C');
				$.flow.pub($.flow.subjectId_15, 'ctrlKey_V');
			}else if(e.keyCode == 86 && e.ctrlKey){
//				$.flow.pub($.flow.subjectId_15, 'ctrlKey_V');
			}else if(e.keyCode == 65 && e.ctrlKey){//全选
				$.flow.pub($.flow.subjectId_13, 'ctrlKey_A');
			}else if(e.keyCode == 90 && e.ctrlKey){//ctrl + z  撤销
				$.flow.pub($.flow.subjectId_11, 'ctrlKey_Z');
			}else if(e.keyCode == 89 && e.ctrlKey){//ctrl + y 重做
				$.flow.pub($.flow.subjectId_12, 'ctrlKey_Y');
			}else if((!$.flow.keyboard.links.length && !$.flow.keyboard.nodes.length) || (e.keyCode != 40 && e.keyCode != 39 && e.keyCode != 38 && e.keyCode != 37)){
				return true;
			}else{
				$.flow.pub($.flow.subjectId_5, e);
			}
			if(e && e.preventDefault) {  
	        　　		// 阻止默认浏览器动作(W3C)
	        　　		e.preventDefault();  
	        } else {  
	        　　		// IE中阻止函数器默认动作的方式
	        　　		window.event.returnValue = false;   
	        }  
			return false;
		}).mousemove(function(e){
			$.flow.mouseState.link.move(e);
		}).dblclick(function(e){
			$.flow.mouseState.link.bodyDblclick(e);
		}).click(function(e){
			$.flow.mouseState.link.bodyClick(e);
		}).mousedown(function(e){
			$.flow.mouseState.link.bodyMouseDown(e);
		}).mouseup(function(e){
			$.flow.mouseState.link.bodyMouseUp(e);
		}).keyup(function(e){
			$.flow.pub($.flow.subjectId_8, e);
		});
		
		document.oncontextmenu=function(e){return false;};
		
		$.flow.pub($.flow.subjectId_6, $.flow.getMaxPosition());
		$.flow.pub($.flow.subjectId_9, '初始化完毕');
		$.flow.pub($.flow.subjectId_21, '初始化完毕');

	}
	
	
	window.changeCellLabel = function(targetId, text, type, desc){
		var node, link, found=false;
		type = type||$.flow.linkType.normal;
		for(var i=0,len=$.flow.nodes.length; i<len&&!found; i++){
			node = $.flow.nodes[i];
			if(targetId == node.id){
				node.shape.find(".textSpan").text(text);
				found = true;
			}
		}
		
		for(var j=0,length=$.flow.links.length; j<length&&!found; j++){
			link = $.flow.links[j];
			if(targetId == link.id){
				link.noteObj.shape.find('.linkNoteSpan').text(text);
				if(type === $.flow.linkType.reject){
	                link.type = $.flow.linkType.reject;
				}else{
                    link.type = $.flow.linkType.normal;
				}
				$.flow.setLinkStroke(link, false, false);
				found = true;
			}
		}
	};
	
	window.add_ids = function(id){
		$.flow.temp_ids[id] = true;
		$.flow.ids = [];
		for(var p in $.flow.temp_ids){
			if($.flow.temp_ids[p]){
				$.flow.ids.push(p);
			}
		}
	};
	
	window.add_flow_tmp_id = function(id){
		$.flow.flow_tmp_id = id;
	};
	
	window.set_flow_name = function(name){
		$.flow.name = name;
	}
	
	function getParentUrlTitleTab(){
		if(parent && parent != window){
			var tabTitle='', index, url = parent.location.href;
			index = url.indexOf('tabTitle=');
			if(index >= 0){
				tabTitle = url.substring(index+9);
			}
		}
		if(tabTitle.indexOf('#')>=0){
			tabTitle = tabTitle.split('#')[0];
		}
		return tabTitle;
	}
	
	(function(){
		$('#flowHelpClose').click(function(e){
			$('#flowHelp').fadeOut(500, function(){
				
			});
		});
		
	})();

});