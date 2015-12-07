/***
 * generzhang@tencent.com
 * 2013-11-13
 */
$(function () {
	$.extend(true, $.flow, 
		{
			initLinkNode: function(link){
				link.from.shape.get(0).nodeObj = link.from;
				link.to.shape.get(0).nodeObj = link.to;
			},
			
			initNodeLinks: function(node, nodeLinks, links){
				
				for(var j=0; j<links.length; j++){
					flowLink = links[j];
					
					if($.flow.mouseState.tempLinkObj === flowLink){//避免把try的线也给加进去了，会导致报错
						continue;
					}
					
					link = new Object();
					link.id = flowLink.id;
					
					if(flowLink.point){
						link.path = $.flow.resolPath(flowLink.path.attr("path"));
					}else{
						link.path = "";
					}
					
					if(flowLink.noteObj){
						flowLinkNode =  flowLink.noteObj.shape;
						link.noteFlag = 1;
						link.noteText = flowLinkNode.find('.linkNoteSpan').text();
						link.noteX = flowLinkNode.offset().left;
						link.noteY = flowLinkNode.offset().top;
					}else{
						link.noteFlag = 0;
						link.noteText = "";
						link.noteX = "";
						link.noteY = "";
					}
					link.fromNode = flowLink.from.id;
					link.toNode = flowLink.to.id;
					link.type = flowLink.type||$.flow.linkType.normal;
					
					nodeLinks.push(link);
					
				}
			},
			
			getNodeById: function(nodeId){
				var node = null;
				for(var index in $.flow.nodes){
					node = $.flow.nodes[index];
					if(nodeId == node.id){
						return node;
					}
				}
				return null;
			},
			
			initFlow: function(nodes, isRevocate){
				var tempLinks = new Array();
				for(var i=0; i<nodes.length; i++){
					var node = nodes[i];
					if(!isRevocate && !node.toLinks.length && node.nodeType == 'task'){
						node.nodeType = 'start';
					}
					$.flow.createNode(node.nodeType, node.nodeText, node.nodeX, node.nodeY, node.id, false, false);
					for(var j=0; j<node.fromLinks.length; j++){
						tempLinks.push(node.fromLinks[j]);
					}
				}
				
				//存储节点间的顺序
				$.flow.isLoadLinksIniting = true;
				for(var k=0; k<tempLinks.length; k++){
					var tempLink = tempLinks[k], fromNode, toNode, link;
					
					tempLink.type = tempLink.type||$.flow.linkType.normal;
					$.flow.initLinkPoints(tempLink, tempLink.path);
					fromNode = this.getNodeById(tempLink.fromNode);
					toNode = this.getNodeById(tempLink.toNode);
					link = $.flow.linkPainter.drawLink({ id: tempLink.id, from: fromNode, to: toNode , point: tempLink.point, startPoint:{}, endPoint:{}, type: tempLink.type});
					$.flow.links.push(link);
					if(tempLink.noteFlag == 1){
						$.flow.note.createNote(false, tempLink.noteText, tempLink.noteX, tempLink.noteY, link, false);
					}
				}
				$.flow.isLoadLinksIniting = false;

				for(var i=0; i<$.flow.links.length; i++){
					(function(link){
						$.flow.pub($.flow.subjectId_24, function(){
							$.flow.initLinkPathMove(link);
						});
					})($.flow.links[i]);
				}
			},
			
			reInitFlow: function(nodes){
				for(var i=0,len=$.flow.links.length; i<len; i++){
					$.flow.deleteLinks($.flow.links);
					$.flow.keyboard.setLinksNull();
				}
				
				for(var j=0,length=$.flow.nodes.length; j<length; j++){
					node = $.flow.nodes[j];
					$.flow.deleteNodeLinks(node);
					node.shape.remove();
					$.flow.removeTempLink();
				}
				
				$.flow.nodes = [];
				$.flow.links = [];
				
				this.initFlow(nodes, true);
			},
			
			getFlowInfo: function(isRevocate){
				var nodes = new Array();
				var flowNode = null;
				var flowLink = null;
				var flowLinkNode = null;
				
				var node = null;
				var link = null;

				for(var i=0; i<$.flow.nodes.length; i++){
					
					flowNode = $.flow.nodes[i];
					
					node = new Object();
					node.id = flowNode.id;
					node.nodeX = flowNode.shape.offset().left;
					node.nodeY = flowNode.shape.offset().top;
					node.nodeText = flowNode.shape.find(".textSpan").text();
					node.nodeType = flowNode.nodeType;
					node.fromLinks = new Array();
					node.toLinks = new Array();
					
					if(!isRevocate){
						node.nodeType = node.nodeType.replace('start', 'task');
					}
					this.initNodeLinks(node, node.fromLinks, flowNode.fromLinks);
					this.initNodeLinks(node, node.toLinks, flowNode.toLinks);
					
					nodes.push(node);
				}
				return nodes;
			},
			
			setLinkStroke: function(link, isFocus, isAnimate, stroke){
			    var type;
			    if(isFocus){
			        type = $.flow.path.stroke.focus;
			    }else if(link.type === $.flow.linkType.reject){
			        type = $.flow.path.stroke.reject;
			    }else{
			        type = stroke||$.flow.path.stroke.normal;
			    }
			    
			    if(isAnimate){
			        link.path.animate({"stroke": type}, 10);
			    }else{
			        link.path.attr({"stroke": type});
			    }
			},
			
			toolBox:{
				toolX:$("#flow_tools").offset().left,
				toolY:$("#flow_tools").offset().top, 
				toolWidth:$("#flow_tools").width(),
				toolHeight:$("#flow_tools").height(),
				init:function(){
					this.toolX = $("#flow_tools").offset().left;
					this.toolY = $("#flow_tools").offset().top;
					this.toolWidth = $("#flow_tools").width();
					this.toolHeight = $("#flow_tools").height();
				},
				isInToolBox:function(px ,py){
					if(px>this.toolX && px<(this.toolX+this.toolWidth) && py>this.toolY && py<(this.toolY+this.toolHeight)){
						return true;
					}else{
						return false;
					}
				}
			},
			
			initNodeLink:function(node){
				if(!node.fromLinks){
					node.fromLinks = [];
				}
				if(!node.toLinks){
					node.toLinks = [];
				}
			},
			
			getObjectType: function(htmlNode){
				if(htmlNode.tagName.toLowerCase() == "svg" || (htmlNode.outerHTML && htmlNode.outerHTML.toLowerCase().indexOf('rect(')>=0)){
					return 'body';
				}else if(htmlNode.tagName.toLowerCase() == "path" || (htmlNode.outerHTML && htmlNode.outerHTML.toLowerCase().indexOf('rvml:')>=0)){
					return 'link';
				}else{
					return 'other';
				}
			},
			
			createNode:function(nodeType, text, x, y, id, isNew, isCopy){
				var shapeObj = null, num, userObj, node, connector, 
					iconsStr = '<div title="节点连线" class="easyui-tooltip icon-actor connect-actor" '+(nodeType=='end'?'style="display:none;"':'')+'></div>'+
							   '<div  title="节点排版"class="easyui-tooltip icon-actor layout-actor"></div>'+
							   '<div title="删除节点" class="easyui-tooltip icon-actor delete-actor"></div>'+
							   '<div title="克隆节点" class="easyui-tooltip icon-actor clone-actor"></div>';
				if(nodeType == this.nodeType.start 
					|| nodeType == this.nodeType.end
					|| nodeType == this.nodeType.task
					|| nodeType == this.nodeType.script
					|| nodeType == this.nodeType.api
					|| nodeType == this.nodeType.subflow
					|| nodeType == this.nodeType.join
					|| nodeType == this.nodeType.fork){
					num = $.flow.num++;
					shapeObj = jQuery('<div id="user'+num +'" class="userUICom">'+iconsStr+'<div><div id="user_'+num+'" class="userNode '+nodeType+'Node"></div></div><div class="userNodeText"><span class="textSpan">'+text+'</span></div></div>').appendTo("body");
					shapeObj.css({left:parsePX(x)});
					shapeObj.css({top:parsePX(y)});
					shapeObj.css('zIndex', 1000);
					userObj = $("#user_"+num);
					
					(function(shapeObj, userObj){
						$.flow.pub($.flow.subjectId_22, function(){
							$.flow.initNodeMove(shapeObj, userObj);
						});
					})(shapeObj, userObj);
					
					node = {shape:shapeObj};
					node.nodeType = nodeType;
					node.id = id?id:generateUniqId();
					shapeObj.get(0).nodeObj = node;
					this.initNodeLink(node);
					$.flow.initConnect(node);
					$.flow.initLayout(node);
					$.flow.initDelete(node);
					$.flow.initClone(node);
				}
				this.nodes.push(node);
				if(isNew){
					$('.userUICom').removeClass('nodeSelected');
					shapeObj.addClass('nodeSelected');
					$.flow.keyboard.setNodesNull();
					$.flow.keyboard.addNode(node);
					if(!isCopy){
						$.flow.pub($.flow.subjectId_9, '添加节点');
					}
				}
				
				return shapeObj;
			},
			
			initConnect: function(nodeObj){
				function connect(nodeObj){
					$.flow.mouseState.lineSelect();
					$.flow.mouseState.link.from = nodeObj;
					$.flow.mouseState.link.move(nodeObj);
				}
				nodeObj.shape.find('.connect-actor').click(function(e){
					if(e.button == 2){return;}
					connect(nodeObj);
				}).mousedown(function(e){
					if(e.button == 2){return;}
					connect(nodeObj);
				});
			},
			initLayout: function(nodeObj){
				nodeObj.shape.find('.layout-actor').click(function(){
					var link;
					$.flow.layoutChange = false;
					$.flow.onLayout = true;
					$.flow.layoutNode = nodeObj;
					$.flow.linkLayout = {};
					for(var i=0,len=nodeObj.fromLinks.length; i<len; i++){
						link = nodeObj.fromLinks[i];
						link.layoutNode = nodeObj;
						$.flow.linkPainter.drawLink(link, true);
					}
					for(var j=0,length=nodeObj.toLinks.length; j<length; j++){
						link = nodeObj.toLinks[j];
						link.layoutNode = nodeObj;
						$.flow.linkPainter.drawLink(link, true);
					}
					$.flow.onLayout = false;
					$.flow.layoutNode = null;
					if($.flow.layoutChange){
						$.flow.pub($.flow.subjectId_9, '排版按钮');
					}
				});
			},
			initDelete: function(nodeObj){
				nodeObj.shape.find('.delete-actor').click(function(){
					$.flow.deleteNodeLinks(nodeObj);
					nodeObj.deleted = true;
					$.flow.resetFlowNodes();
					nodeObj.shape.remove();
					$.flow.removeTempLink();
					$.flow.pub($.flow.subjectId_9, '删除节点');
					$.flow.pub($.flow.subjectId_6, $.flow.getMaxPosition());
					$('.tooltip').hide();
				});
			},
			initClone: function(nodeObj){
				nodeObj.shape.find('.clone-actor').click(function(){
					var newNode = {};
					newNode.nodeX = nodeObj.shape.offset().left+nodeObj.shape.width()*2;
					newNode.nodeY = nodeObj.shape.offset().top+nodeObj.shape.height()/2;
					newNode.nodeText = nodeObj.shape.find(".textSpan").text();
					newNode.nodeType = nodeObj.nodeType;
					newNode.nodeWidth = nodeObj.shape.width();
					newNode.nodeHeight = nodeObj.shape.height();
					
					$.flow.createNode(newNode.nodeType, newNode.nodeText, newNode.nodeX, newNode.nodeY, null, true, true);
					$.flow.pub($.flow.subjectId_9, '克隆节点');
					$.flow.pub($.flow.subjectId_6, $.flow.getMaxPosition());
				});
			},
			
			deleteAllNodes:function(){
			
				for(var i=0; i<$.flow.nodes.length; i++){
					$.flow.nodes[i].shape.remove();
				}
				for(var j=0; j<$.flow.links.length; j++){
					$.flow.links[j].path.remove();
				}
				for(var k=0; k<$.flow.notes.length; k++){
					$.flow.notes[k].shape.remove();
				}
				$.flow.nodes = [];
				$.flow.links = [];
				$.flow.notes = [];
			},
			
			deleteAllLinks:function(){
			
				
				for(var i=0; i<$.flow.nodes.length; i++){
					$.flow.nodes[i].toLinks = [];
					$.flow.nodes[i].fromLinks = [];
				}
			
				for(var j=0; j<$.flow.links.length; j++){
					$.flow.links[j].path.remove();
				}
				
				for(var k=0; k<$.flow.notes.length; k++){
					$.flow.notes[k].shape.remove();
				}
				
				$.flow.links = [];
				$.flow.notes = [];
			},
			
			deleteAllNotes:function(){
			
				for(var j=0; j<$.flow.links.length; j++){
					$.flow.links[j].noteObj = null;
				}
				
				for(var k=0; k<$.flow.notes.length; k++){
					$.flow.notes[k].shape.remove();
				}
				
				$.flow.notes = [];
			},

			
			initPoint:function(px, py, link){
	
				var res = {inPoint:false};
				
				function isIn(_px, _py, p){
					var x = p.x-_px;
					var y = p.y-_py;
					if(Math.sqrt(x*x + y*y) <= $.flow.path.pointRadiu){
						return true;
					}else{
						return false;
					}
				}

				var point = link.point;
				
				while(point){
					if(isIn(px, py, point)){
						res.inPoint = true;
						res.point = point;
						break;
					}
					point = point.nextPoint;
				}
				
				if(!res.inPoint){
					res.point = {x:px, y:py, num:$.flow.num++};
				}
				
				link.currentPoint = res.point;
				link.inPoint = res.inPoint;
			},
			
			addPoint:function(link, point){

				function getMis(_p1, _p2, _point){
					var d1 = getDis(_p1, _p2);
					var d2 = getDis(_p1, _point);
					var d3 = getDis(_p2, _point);
					return d2+d3-d1;
					
				}
				
				function getDis(_p1, _p2){
					var h = _p1.y - _p2.y;
					var w = _p1.x - _p2.x;
					return Math.sqrt(h*h+w*w);
				}
				
				if(!point) return ;
				var p = link.point;
				if(!p){
					link.point = point;
					point.nextPoint = null;
					point.prevPoint = null;
				}else{
					var first = getMis(link.startPoint, p, point);
					if(!p.nextPoint){
						var second = getMis(p, link.endPoint, point);
						if(second < 0 || first < second){
							link.point = point;
							point.prevPoint = null;
							point.nextPoint = p;
							p.prevPoint = point;
						}else{
							p.nextPoint = point;
							point.prevPoint = p;
							point.nextPoint = null;
						}
						
					}else{
						var target = p;
						var n = null;
						var last = null;
						var pre = first;
						while(p.nextPoint){
							n = getMis(p, p.nextPoint, point);
							if(pre<0 || (n>=0 && n<pre)){
								pre = n;
								target = p.nextPoint;
							}
							p = p.nextPoint;
						}
						last = getMis(p, link.endPoint, point);
						if(pre<0 || (last>=0 && last<pre)){
							target = null;
						}
						if(target){
							if(target === link.point){
								link.point.prevPoint = point;
								link.point = point;
								point.prevPoint = null;
								point.nextPoint = target;
								target.prevPoint = point;
							}else{
								target.prevPoint.nextPoint = point;
								point.nextPoint = target;
								point.prevPoint = target.prevPoint;
								target.prevPoint = point;
							}
						}else{
							point.nextPoint = null;
							point.prevPoint = p;
							p.nextPoint = point;
						}
					}
				}
			},
			
			//删除点
			deletePoint:function (link, point){
				if(!point.prevPoint && !point.nextPoint){
					link.point = null;
				}else if(!point.prevPoint && point.nextPoint){
					link.point = point.nextPoint;
					point.nextPoint.prevPoint = null;
				}else if(point.prevPoint && !point.nextPoint){
					point.prevPoint.nextPoint = null;
				}else if(point.prevPoint && point.nextPoint){
					point.nextPoint.prevPoint = point.prevPoint;
					point.prevPoint.nextPoint = point.nextPoint;
				}else{
					link.point = null;
				}
				link.currentPoint = null;
				
			},
			
			deleteLinks:function(links){
				for(var i=0; i<links.length; i++){
					var link = links[i];
					link.path.remove();
					$.flow.deleteLinkNote(link);
					link.deleted = true;
					$.flow.resetNodeLinks(link.to);
					$.flow.resetNodeLinks(link.from);
					if(link.noteObj){
						link.noteObj.shape.remove();
						link.noteObj.deleted = true;
						link.noteObj = null;
					}
				}
				$.flow.resetFlowNotes();
				$.flow.resetFlowLinks();
			},
			
			addLink:function(link){
				if(!link.from.fromLinks){
					link.from.fromLinks = [];
				}
				if(!link.from.toLinks){
					link.from.toLinks = [];
				}
				if(!link.to.toLinks){
					link.to.toLinks = [];
				}
				if(!link.to.fromLinks){
					link.to.fromLinks = [];
				}
				link.from.fromLinks.push(link);
				link.to.toLinks.push(link);
			},
			
			resolPath:function(path){
				var pathStr = String(path);
				pathStr = pathStr.replaceAll("L,", "L").replaceAll(",L", "L").replaceAll("M,", "M").replaceAll(",M", "M");
				pathStr = pathStr.split("M")[1];
				pathStr = pathStr.slice(pathStr.indexOf("L")+1);
				pathStr = pathStr.slice(0, pathStr.lastIndexOf("L"));
				pathStr = pathStr.slice(0, pathStr.lastIndexOf("L"));
				return pathStr;
			},
			
			initLinkPoints:function(link, pathStr){
				function newPoint(xy){
					var position = xy.split(",");
//					return {x:parseInt(position[0])+20, y:parseInt(position[1])+20, num:$.flow.num++};
					return {x:parseInt(position[0]), y:parseInt(position[1]), num:$.flow.num++}
				}
				
				
				if(!pathStr){//直线
					return ;
				}
				
				if(pathStr.indexOf("L")<0){
					var point = newPoint(pathStr);
					link.point = point;
					point.prevPoint = null;
					point.nextPoint = null;
				}
				
				var ps = pathStr.split("L");
				var currentPoint = null;
				var addPoint = null;
				
				//到这里最少有两个点了
				for(var i=0; i<ps.length; i++){
					addPoint = newPoint(ps[i]);
					if(i == 0){
						link.point = addPoint;
						addPoint.prevPoint = null;
						addPoint.nextPoint = null;
						currentPoint = addPoint;
					}else{
						currentPoint.nextPoint = addPoint;
						addPoint.prevPoint = currentPoint;
						addPoint.nextPoint = null;
						currentPoint = addPoint;
					}
				}
			},
			
			keyboard:{
				links:[],
				nodes:[],
				
				setLinks:function(links){
					this.links = links, link;
					for(var i=0,len=$.flow.links.length; i<len; i++){
						link = $.flow.links[i];
						$.flow.setLinkStroke(link, false, false);
					}
					for(var j=0,length=this.links.length; j<length; j++){
						link = this.links[j];
						$.flow.setLinkStroke(link, true, false);
					}
				},
				setNodes:function(nodes){
					this.nodes = nodes;
				},
				addNode:function(node){
					this.nodes.push(node);
				},
				addLink:function(link){
					this.links.push(link);
				},
				
				setNodesNull:function(){
					this.nodes = [];
				},
				setLinksNull:function(){
					this.links = [];
				},
				setNull:function(){
//					var point, link;
					this.nodes = [];
					this.links = [];
//					for(var i=0, len=$.flow.links.length; i<len; i++){
//						link = $.flow.links[i];
//						if(point=link.point){
//							point.pointSelected = false
//							while(point.nextPoint){
//								point = point.nextPoint;
//								point.pointSelected = false;
//							}
//						} 
//					}
				}
			},
			
			drawNodeLinks:function(node){
				if(node.fromLinks){
					for(var i=0, ii=node.fromLinks.length; i<ii; i++){
						this.linkPainter.drawLink(node.fromLinks[i]);
					}
				}
				if(node.toLinks){
					for(var j=0, jj=node.toLinks.length; j<jj; j++){
						this.linkPainter.drawLink(node.toLinks[j]);
					}
				}
			},
			
			drawNodeLinksByLink:function(node, link){
				if(node.fromLinks){
					for(var i=0, ii=node.fromLinks.length; i<ii; i++){
						if(link !== node.fromLinks[i]){
							this.linkPainter.drawLink(node.fromLinks[i]);
						}
					}
				}
				if(node.toLinks){
					for(var j=0, jj=node.toLinks.length; j<jj; j++){
						if(link !== node.toLinks[j]){
							this.linkPainter.drawLink(node.toLinks[j]);
						}
					}
				}
			},
			
			resetNodeLinks:function(node){
				var newFromLinks = [];
				var newToLinks = [];
				for(var i=0; i<node.fromLinks.length; i++){
					if(!node.fromLinks[i].deleted){
						newFromLinks.push(node.fromLinks[i]);
					}
				}
				for(var j=0; j<node.toLinks.length; j++){
					if(!node.toLinks[j].deleted){
						newToLinks.push(node.toLinks[j]);
					}
				}
				node.fromLinks = newFromLinks;
				node.toLinks = newToLinks;
			},
			
			deleteNodeLinks:function(node){
				for(var i=0; i<node.fromLinks.length; i++){
					node.fromLinks[i].deleted = true;
					node.fromLinks[i].path.remove();
					this.deleteLinkNote(node.fromLinks[i]);
					this.resetNodeLinks(node.fromLinks[i].to);
				}
				for(var j=0; j<node.toLinks.length; j++){
					node.toLinks[j].deleted = true;
					node.toLinks[j].path.remove();
					this.deleteLinkNote(node.toLinks[j]);
					this.resetNodeLinks(node.toLinks[j].from);
				}
				this.resetFlowLinks();
			},
			
			deleteLinkNote:function(link){
				if(link.noteObj){
					link.noteObj.shape.remove();
					link.noteObj.deleted = true;
				}
			},
			
			resetFlowLinks:function(){
				var newFolwLinks = [];
				for(var i=0; i<$.flow.links.length; i++){
					if(!$.flow.links[i].deleted){
						newFolwLinks.push($.flow.links[i]);
					}
				}
				$.flow.links = newFolwLinks;
			},
			
			resetFlowNodes:function(){
				var newFolwNodes = [];
				for(var i=0; i<$.flow.nodes.length; i++){
					if(!$.flow.nodes[i].deleted){
						newFolwNodes.push($.flow.nodes[i]);
					}
				}
				$.flow.nodes = newFolwNodes;
			},
			
			resetFlowNotes:function(){
				var newFolwNotes = [];
				for(var i=0; i<$.flow.notes.length; i++){
					if(!$.flow.notes[i].deleted){
						newFolwNotes.push($.flow.notes[i]);
					}
				}
				$.flow.notes = newFolwNotes;
			},
			
			getPathLength:function(path){
				return path.getTotalLength()-$.flow.path.arrow.size*2;
			},
			
			resetLinkNote:function(isNew, link){
				if(isNew){
					if(link.noteObj){
						var point = link.path.getPointAtLength($.flow.getPathLength(link.path)/2);
						if(point){
							link.noteObj.shape.hide().css({left:parsePX(point.x -link.noteObj.shape.width()/2), top:parsePX(point.y - link.noteObj.shape.height())}).fadeIn(1000);
						}
					}
				}else{
					if(link.noteObj){
						var point = link.path.getPointAtLength($.flow.getPathLength(link.path)/2);
						if(point){
							link.noteObj.shape.css({left:parsePX(point.x -link.noteObj.shape.width()/2), top:parsePX(point.y - link.noteObj.shape.height())});
						}
					}
				}
			},
			
			note:{
				createNote:function(isNew, noteText, noteX, noteY, link, isNew){
					var t = this, val, linkNoteSpanDblclick,
						linkNote = jQuery('<span class="linkNote"><input type="text" class="linkNoteInput" value="" style="display:none;"/><span class="linkNoteSpan" style="display:none";>'+noteText+'</span></span>').appendTo("body"),
						noteObj, linkNoteInput, linkNoteSpan;
					linkNote.get(0).linkObj = link;
					noteObj = {shape:linkNote, uuid:generateUniqId()};
					link.noteObj = noteObj;
					link.isNew = isNew;
					linkNote.get(0).noteObj = noteObj;
					$.flow.notes.push(noteObj);
					linkNoteInput = linkNote.find(".linkNoteInput");
					linkNoteInput.data('firstBlur', 'yes');
					linkNoteSpan = linkNote.find(".linkNoteSpan");
					
					(function(linkNote){
						$.flow.pub($.flow.subjectId_23, function(){
							$.flow.initLinkNoteMove(linkNote);
						})
					})(linkNote);
					
					if(isNew){
						linkNoteInput.show();
						linkNoteInput.select();
						$.flow.resetLinkNote(true, link);
					}else{
						linkNote.css({left:parsePX(noteX), top:parsePX(noteY)});
						linkNoteInput.hide();
						linkNoteSpan.show();
					}
				},
				
				finishNote: function(note, input, span, isNew){
					$.flow.jQueryDrag(note, true);
					var linkNoteInputVal = input.val().trim(), valChange = false;
					if(!linkNoteInputVal){
						linkNoteInputVal = span.text()||"未命名";
					}
					if(linkNoteInputVal != span.text() && span.text().trim() != ''){
						valChange = true;
					}
					span.removeClass('noteSelected');
					span.show().text("").text(linkNoteInputVal);
					span.show();
					input.hide();
					
					if(valChange){
						$.flow.pub($.flow.subjectId_9, '连线内容变化');
					}
					
					if(input.data('firstBlur')=='yes' && isNew){
						$.flow.resetLinkNote(false, note.get(0).linkObj);
					}
					input.data('firstBlur', 'no');
				}
			}
			
		}
	);
});