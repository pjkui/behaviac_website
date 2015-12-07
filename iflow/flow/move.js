/***
 * generzhang@tencent.com
 * 2013-11-13
 */
$(function () {
	$.extend(true, $.flow, 
		{
			mouseState:{
				handSelected:true,
				lineSelected:false,
				trying:false,
				link:{
					from:null,
					to:null,
					init:function(){
						this.from = null;
						this.to = null;
						$.flow.mouseState.trying = false;
					},
					onLink:function(node){
						if($.flow.mouseState.lineSelected){
							if(!this.from){
								this.from = node;
							}else if(!this.to){
								this.to = node;
								if(node.shape && node.shape.get(0)){
									var linkObj;
									if($.flow.mouseState.tempLinkObj && (linkObj = $.flow.mouseState.tempLinkObj.originLink)){
										linkObj.deleted = true;
										$.flow.resetNodeLinks(linkObj.to);
										linkObj.deleted = false;
										linkObj.to = this.to;
										
										$.flow.linkPainter.drawLink(linkObj);
										linkObj.to.toLinks.push(linkObj);
										
										$.flow.removeTempLink();
										
										$.flow.pub($.flow.subjectId_9, '重新连线');
										
										$.flow.mouseState.handSelect();
										node.shape.draggable({ containment:"window", scroll: false });
									}else{
									    var point = null, link, fromCore, toCore, h, v, k, foundExist = false;
									    for(var i=0,len=$.flow.links.length; i<len; i++){
									        link = $.flow.links[i];
									        if(link.from===this.from && link.to===this.to){
									            foundExist = true;
									            break;
									        }
									        if(link.from===this.to && link.to===this.from && !link.point){
									            fromCore = $.flow.linkPainter.getShapeCore($.flow.linkPainter.getUserNodeShape(this.from.shape));
									            toCore = $.flow.linkPainter.getShapeCore($.flow.linkPainter.getUserNodeShape(this.to.shape));
									            k = Math.abs(fromCore.y-toCore.y)-Math.abs(fromCore.x-toCore.x);
									            if(k > 0){
									                h = Math.sqrt((fromCore.x-toCore.x)*(fromCore.x-toCore.x) + (fromCore.y-toCore.y)*(fromCore.y-toCore.y))*(2/5);
									                v = h*(3/10);
									            }else{
									                v = Math.sqrt((fromCore.x-toCore.x)*(fromCore.x-toCore.x) + (fromCore.y-toCore.y)*(fromCore.y-toCore.y))*(2/5);
                                                    h = v*(3/10);
									            }
									            
									            point = {x:parseInt((fromCore.x+toCore.x)/2-h) ,y:parseInt((fromCore.y+toCore.y)/2-v)};
									            if(point.x<5||point.y<5){
									                point = {x:parseInt((fromCore.x+toCore.x)/2+h) ,y:parseInt((fromCore.y+toCore.y)/2+v)};
									            }
									        }
									    }
									    if(foundExist){
									        $.flow.removeTempLink();
                                            $.flow.mouseState.handSelect();
									        $.messager.alert('提示','节点之间已经有同向的连线，请先删除原同向的连线！','error');
									    }else{
									        linkObj = $.flow.linkPainter.drawLink({ from: this.from, to: this.to , point: point, startPoint:{}, endPoint:{}, type:$.flow.linkType.normal});
	                                        $.flow.links.push(linkObj);
	                                        $.flow.removeTempLink();
	                                        $.flow.initLinkPathMove(linkObj);
	                                        $.flow.note.createNote(true, '未命名', null, null, linkObj, true);
	                                        $.flow.mouseState.handSelect();
	                                        if(!$.flow.isLoadLinksIniting){
	                                            $.flow.pub($.flow.subjectId_9, '添加连线');
	                                        }
	                                        node.shape.draggable({containment:"window", scroll: false});
									    }
									}
								}
							}
						}
					},
					
					move:function(e){
						if($.flow.mouseState.lineSelected){
							if(this.from && !this.to){
								if(!$.flow.mouseState.tempLinkObj || !$.flow.mouseState.tempLinkObj.path){
									$.flow.mouseState.tempLinkObj = $.flow.linkPainter.tryLink({ from: this.from, to: {x:e.pageX, y:e.pageY} , point: null, startPoint:{}, endPoint:{}, deleted:true});
								}else{
									$.flow.mouseState.tempLinkObj.to.x = e.pageX;
									$.flow.mouseState.tempLinkObj.to.y = e.pageY;
									$.flow.linkPainter.tryLink($.flow.mouseState.tempLinkObj);
								}
								$.flow.mouseState.trying = true;
							}
						}
					},

					bodyClick:function(e){
						$.flow.pub($.flow.subjectId_1, e);
					},
					
					bodyDblclick:function(e){
						if($.flow.getObjectType(getEventTargetElement(e)) == 'body'){
							$.flow.pub($.flow.subjectId_2, e);
						}
					},
					
					bodyMouseDown:function(e){
						$.flow.pub($.flow.subjectId_3, e);
					},
					
					bodyMouseUp:function(e){
						$.flow.pub($.flow.subjectId_4, e);
					},
					
					tempLinkObj:null
					
				},
				px:0,
				py:0,
				lineSelect:function(){
					this.handSelected = false;
					this.lineSelected = true;
				},
				handSelect:function(){
					this.lineSelected = false;
					this.handSelected = true;
				},
				init: (function(){
					$.flow.sub($.flow.subjectId_3, function(e){//bodyMouseDown
						var targetNode = getEventTargetElement(e);
						if(targetNode.tagName.toLowerCase() != "image"){
							
						}
						if($.flow.getObjectType(targetNode) == 'body' && !$.flow.mouseState.trying){
							$('.userUICom').removeClass('nodeSelected');
							$('.linkNoteSpan').removeClass('noteSelected');
							$.flow.keyboard.setNull();
							for(var i=0,len=$.flow.links.length; i<len; i++){
							    $.flow.setLinkStroke($.flow.links[i], false, true);
								$.flow.links[i].path.pathSelected = false;
							}
							$('.linkNoteInput').blur();
						}
						if(!$.flow.onMessager){
							$('.errorCroccPoint').fadeOut(500, function(){
								if(!$.flow.onMessager){
									$('.errorCroccPoint').remove();
								}
							});
						}
					});
					
					$.flow.sub($.flow.subjectId_2, function(e){//bodyDblclick
						if($.flow.getObjectType(getEventTargetElement(e)) == 'body'){
//							alert('bodyDblClick');
						}
					});
					$.flow.sub($.flow.subjectId_4, function(e){
						var obj = $.flow.getObjectType(getEventTargetElement(e));
						if(obj == 'body' || obj == 'link'){
							$.flow.removeTempLink();
						}
					});
					$.flow.sub($.flow.subjectId_18, function(type){
						$('#btn_layout').click();
					});
					return true;
				})()
			},
			
			removeTempLink: function(){
				if($.flow.mouseState.tempLinkObj && $.flow.mouseState.tempLinkObj.path){
					$.flow.mouseState.tempLinkObj.path.remove();
					$.flow.mouseState.tempLinkObj.path = null;
				}
				$.flow.mouseState.link.init();
				if($.flow.mouseState.tempLinkObj){
					$.flow.resetNodeLinks($.flow.mouseState.tempLinkObj.from);
					$.flow.mouseState.tempLinkObj = null;
				}
				$.flow.mouseState.handSelect();
			},

			jQueryDrag:function(obj, canDrag){
				if(canDrag){
					obj.draggable("enable");
				}else{
					obj.draggable("destroy");
				}
			},
			
			initLinkNoteMove:function(obj){
				
				var val, linkNoteSpanDblclick, linkNoteInput, linkNoteSpan, link = obj.get(0).linkObj;
			
				linkNoteInput = obj.find(".linkNoteInput");
				linkNoteSpan = obj.find(".linkNoteSpan");
				
				linkNoteInput.blur(function(e){
					$.flow.note.finishNote(obj, linkNoteInput, linkNoteSpan, link.isNew);
				}).keydown(function(e){

				}).keyup(function(e){
					if(e.keyCode == "13"){
						$.flow.note.finishNote(obj, linkNoteInput, linkNoteSpan, link.isNew);
					}
				});
				linkNoteSpan.dblclick(function(e){
					linkNoteSpanDblclick = true;
					$.flow.pub($.flow.subjectId_17, link);
				}).mousedown(function(e){
					$('.linkNoteInput').each(function(n, input){
						if(e.target != input){
							input.blur();
						}
					});
					$('.textInput').blur();
					$('.linkNoteSpan').removeClass('noteSelected');
					$(this).addClass('noteSelected');
				}).mouseup(function(e){
					if(e.button == 2) return ;
					if(!this.parentNode.moved){
						linkNoteSpanDblclick = false;
						setTimeout(function(){
							if(linkNoteSpanDblclick) return;
							val = linkNoteSpan.text(); 
							linkNoteInput.val("").show().focus().val(val).select();
							linkNoteSpan.hide();
							$.flow.jQueryDrag(obj, false);
						}, 300);
					}else{
						this.parentNode.moved = false;
					}
				});
				
				obj.bind( "dragstart", function(e, ui) {
					
				});
				obj.bind( "drag", function(e, ui) {
					this.moved = true;
					$.flow.pub($.flow.subjectId_6, $.flow.getMaxPosition());
				});
				obj.bind( "dragstop", function(e, ui) {
					$("body").css({"cursor":"default"});
					$.flow.pub($.flow.subjectId_9, '移动标注');
				});

				
				//绑定窗体鼠标放开事件
				obj.mouseover(function(e){
					obj.draggable({ containment:"window", scroll: false });
					obj[0].style.cursor = "default";
				}).mousedown(function(e){
					
				}).click(function(e){
					
				}).dblclick(function (e) {
					
				}).mouseup(function(e) {
					
				}).mouseleave(function(e){
					
				});
				
			},
			
			moveSelectedNode: function(offsetX, offsetY, orainNode){
				var node, tempX, tempY;
				
				for(var i=0,len=$.flow.keyboard.nodes.length; i<len; i++){
					node = $.flow.keyboard.nodes[i];
					if(node === orainNode){
						 continue;
					}
					tempX = node.shape.offset().left + offsetX;
					tempY = node.shape.offset().top + offsetY;
					while(tempX<0) tempX++;
					while(tempY<0) tempY++;
					
					node.shape.css({ left: parsePX(tempX), top: parsePX(tempY) });
					$.flow.drawNodeLinks(node);
				}
			},
			
			moveSelectedLink: function(offsetX, offsetY){
				var link, point;
				for(var i=0,len=$.flow.keyboard.links.length; i<len; i++){
					link = $.flow.keyboard.links[i];
					point = link.point;
					if(point){
						resetPointPosition(point);
						while(point.nextPoint){
							point = point.nextPoint;
							resetPointPosition(point);
						}
					}
				}
				
				function resetPointPosition(point){
					point.x += offsetX;
					point.y += offsetY;
					while(point.x<1) point.x++;
					while(point.y<1) point.y++;
				}
			},
			
			getMaxPosition: function(){
				var maxX = 0, maxY = 0, shape;
				for(var i=0,len=$.flow.nodes.length; i<len; i++){
					shape = $.flow.nodes[i].shape;
					maxX = Math.max(maxX, shape.offset().left + shape.width());
					maxY = Math.max(maxY, shape.offset().top + shape.height());
				}
				for(var i=0,len=$.flow.notes.length; i<len; i++){
					shape = $.flow.notes[i].shape;
					maxX = Math.max(maxX, shape.offset().left + shape.width());
					maxY = Math.max(maxY, shape.offset().top + shape.height());
				}
				for(var i=0,len=$.flow.links.length; i<len; i++){
					link = $.flow.links[i];
					point = link.point;
					if(point){
						maxX = Math.max(maxX, point.x);
						maxY = Math.max(maxY, point.y);
						while(point.nextPoint){
							point = point.nextPoint;
							maxX = Math.max(maxX, point.x + $.flow.path.pointRadiu);
							maxY = Math.max(maxY, point.y + $.flow.path.pointRadiu);
						}
					}
				}
				
				return {x:maxX, y:maxY};
			},
			
			initNodeMove:function(obj, objTitle){
				var startX, startY, offsetX, offsetY, nodeDblclick;
				obj.bind( "dragstart", function(e, ui) {
					if(!ui) return;
					startX = ui.offset.left;
					startY = ui.offset.top;
				});
				obj.bind( "drag", function(e, ui) {
					if(!ui) return;
					offsetX = ui.offset.left - startX;
					offsetY = ui.offset.top - startY;
					
					startX = ui.offset.left;
					startY = ui.offset.top;

					$.flow.moveSelectedLink(offsetX, offsetY);
					$.flow.drawNodeLinks(obj.get(0).nodeObj);
					$.flow.moveSelectedNode(offsetX, offsetY, obj[0].nodeObj);
					
					$.flow.mouseState.handSelect();
					if($.flow.mouseState.tempLinkObj && $.flow.mouseState.tempLinkObj.path){
						$.flow.mouseState.tempLinkObj.path.remove();
						$.flow.mouseState.tempLinkObj.path = null;
						$.flow.mouseState.tempLinkObj = null;
					}
					
					clearTimeout($.flow.nodeMoveTimeout);
					$.flow.nodeMoveTimeout = setTimeout(function(){
						$.flow.drawNodeLinks(obj.get(0).nodeObj);
					}, 100);
					
					$.flow.pub($.flow.subjectId_6, $.flow.getMaxPosition());
				});
				obj.bind( "dragstop", function(e, ui) {
					$("body").css({"cursor":"default"});
					$.flow.pub($.flow.subjectId_9, '移动节点');
				});

				
				//绑定窗体鼠标放开事件
				obj.mouseover(function(e){

				}).mousedown(function(e){
					obj.get(0).style.zIndex = $.flow.zIndex++;
					obj.get(0).onselectstart=function(){return false;};
					$('body').get(0).onselectstart=function(){return false;};
					$.flow.flow[0].onselectstart=function(){return false;};
				}).click(function(e){
					var targetNode = getEventTargetElement(e);
					if(e.target.tagName == "input" || e.target.tagName == "INPUT"){
						//$(targetNode).select();
					}else{
						if(targetNode.parentNode && targetNode.parentNode.className == "userNodeText"){
							nodeDblclick = false;
							setTimeout(function(){
								if(nodeDblclick) return;
								var textValue = $(targetNode).text();
								targetNode.style.display="none";
								
								var nodeTextInput = jQuery('<input type="text" class="textInput">').appendTo(jQuery(targetNode.parentNode))
								
								nodeTextInput.blur(function(e){
									fineshNodeTextInput(targetNode, nodeTextInput, obj);
								}).keydown(function(e){

								}).keyup(function(e){
									if(e.keyCode == "13"){
										fineshNodeTextInput(targetNode, nodeTextInput, obj);
									}
								}).mousedown(function(e){

								}).mouseup(function(e){

								});
								nodeTextInput.val(textValue).select();
								
								obj.addClass('nodeEditing');
								
							}, 300);
							
							function fineshNodeTextInput(targetNode, nodeTextInput, nodeObj){
								var targetNodeOldVal = $(targetNode).text();
								$(targetNode).show().text("").text(nodeTextInput.val());
								nodeTextInput.remove();
								if($(targetNode).text() != targetNodeOldVal && nodeTextInput.val().trim()){
									$.flow.pub($.flow.subjectId_9, '节点内容变化');
								}else{//不能为空内容
									$(targetNode).text(targetNodeOldVal);
								}
								nodeObj.removeClass('nodeEditing');
							}
						}
					}
				}).dblclick(function (e) {
					var targetNode = getEventTargetElement(e);
					if(targetNode.tagName.toLowerCase() != 'input' && !$(targetNode).hasClass('icon-actor')){
						$.flow.pub($.flow.subjectId_16, obj[0].nodeObj);
					}
					nodeDblclick = true;
				}).mouseup(function(e) {
					var targetNode = getEventTargetElement(e), link;
					if(targetNode.tagName.toLowerCase != "input"){
//						$.flow.drawNodeLinks(obj.get(0).nodeObj);
					}
					objTitle.get(0).onselectstart=function(){return false;}
					
					for(var i=0,len=$.flow.links.length; i<len; i++){
                        link = $.flow.links[i];
                        if($.flow.mouseState.tempLinkObj && link.from===$.flow.mouseState.tempLinkObj.from && link.to===obj.get(0).nodeObj){
                            $.flow.removeTempLink();
                            $.flow.mouseState.handSelect();
                            $.messager.alert('提示','节点之间已经有同向的连线，请先删除已存在的同向的连线！','error');
                            return;
                        }
                    }
					
					if($.flow.mouseState.lineSelected  && $.flow.mouseState.tempLinkObj.from != obj.get(0).nodeObj){
						$.flow.mouseState.link.onLink(obj.get(0).nodeObj);
					}

					if($.flow.mouseState.tempLinkObj){
						$.flow.resetNodeLinks($.flow.mouseState.tempLinkObj.from);
					}
				}).mouseenter(function(e){
					obj.addClass('nodeMouseenter');
				}).mouseleave(function(e){
					obj.removeClass('nodeMouseenter');
				});

				
				
				objTitle.mouseover(function(e){
					if(!$.flow.mouseState.trying){
						obj.draggable({ containment:"window", scroll: false });
					}
					obj[0].style.cursor = "default";
				}).mouseout(function(e){
					obj[0].style.cursor = "default";
					$.flow.jQueryDrag(obj, false);
				});

				objTitle.mousedown(function(e) {
					if(!$(this).closest('.userUICom').hasClass('nodeSelected')){
						$('.userUICom').removeClass('nodeSelected');
						$(this).closest('.userUICom').addClass('nodeSelected');
						$.flow.keyboard.setNodes([objTitle.closest('.userUICom').get(0).nodeObj]);
					}
				});
				
				objTitle.mouseup(function(){
					objTitle.get(0).onselectstart=function(){return true;}
				});
				
			},
			
			initLinkPathMove:function(link){
				link.path.drag(
					function (dx, dy, mx, my, e) {//move
					    if(e.button == 2){
					        return;
					    }
						if(link.mouseCtrlKey){
							return;
						}
						link.moving = true;
						link.moved = true;
						var tempX = link.currentPoint.ox + dx;
						var tempY = link.currentPoint.oy + dy;
				
						link.currentPoint.x = tempX;
						link.currentPoint.y = tempY;
						$.flow.linkPainter.drawLink(link);
						$('body').css('cursor', 'pointer');
						$.flow.pub($.flow.subjectId_6, $.flow.getMaxPosition());
					}, 
					function (px, py, e) {//drag//开始拖动
					    if(e.button == 2){
                            return;
                        }
					    link.mouseCtrlKey = e.ctrlKey;
						if(link.mouseCtrlKey){
							link.from.shape.find('.connect-actor').mousedown();
							if($.flow.mouseState.tempLinkObj){
								$.flow.mouseState.tempLinkObj.originLink = link;
							}
							return;
						}
						if(!link) return;
						link.moved = false;
						link.oldPathStr = link.linkPathStr;
						$.flow.initPoint(px, py, link);
						link.currentPoint.ox = link.currentPoint.x;
						link.currentPoint.oy = link.currentPoint.y;
						if(!link.inPoint){
							$.flow.addPoint(link, link.currentPoint);
						}
						$.flow.keyboard.setLinks([link]);
					}, 
					function (e) {//up
					    if(e.button == 2){
                            return;
                        }
						if(link.mouseCtrlKey){
							return;
						}
						link.moving = false;
						if(!link.moved){
							$.flow.deletePoint(link, link.currentPoint);
							$.flow.linkPainter.drawLink(link);
						}
						if(link.linkPathStr != link.oldPathStr){
							$.flow.pub($.flow.subjectId_9, '移动连线');
						}
						$('body').css('cursor', 'default');
					}
				);
				
				link.path.mouseover(function(e){
					this.node.style.cursor = "pointer";
//					this.animate({"stroke-width": $.flow.path.strokeWidth.large}, 0);
				}).mouseout(function(e){

				}).mousedown(function(e){
					$.flow.keyboard.setLinks([link]);
					this.pathSelected = true;
				}).dblclick(function(e){
					$.flow.pub($.flow.subjectId_17, link);
				});
			},
			
			toolBoxMove:function(){
				var obj = $("#flow_tools"), objTitle = $("#flow_tools_handle");
				//绑定窗体鼠标按下事件
				obj.mousedown(function(e){
					obj.get(0).style.zIndex = $.flow.zIndex++;
				});
				
				obj.bind( "dragstart", function(e, ui) {
					$('.imgIcon').hide();
				});
				obj.bind( "drag", function(e, ui) {
					$('.imgIcon').hide();
					$('.tooltip').hide();
				});
				obj.bind( "dragstop", function(e, ui) {
					$.flow.toolBox.init();
				});
				objTitle.mouseover(function(e){
					obj.draggable({ containment:"window", scroll: false });
					obj[0].style.cursor = "default";
				}).mouseout(function(e){
					$.flow.jQueryDrag(obj, false);
				}).dblclick(function(e){
					$('#tool-body').toggle();
					$('.imgIcon').hide();
				});
				
				//绑定窗体鼠标放开事件
				obj.mouseup(function() {
					objTitle.get(0).onselectstart=function(){return true;}
				});
				
				//绑定窗体标题栏鼠标按下事件
				objTitle.mousedown(function(e) {
				})
				
				//绑定窗体标题栏鼠标放开事件
				objTitle.mouseup(function(){
					objTitle.get(0).onselectstart=function(){return true;}
				});
			},
			
			toolNodeMove:function(obj){
				obj.mouseover(function(e){
					var type, text, imgSrc, left = obj.offset().left, top = obj.offset().top, $target;
					type = obj.attr('data-type');
					text = obj.attr('data-text');
					
					$target = $('.toolNode'+type);
					if(!$target[0]){
						imgSrc = "css/new/images/"+type+".png";
						$target = jQuery('<img data-type="'+type+'" data-text="'+text+'" src="'+imgSrc+'" class="'+type+' imgIcon toolNode'+type+'" style="display:none;position:absolute;;"/>').appendTo('body');
						$.flow.setToolNodeMove($target);
					}
					$target.css('left', left+'px').css('top', top+'px').css('zIndex', $.flow.zIndex++);
					$target.show();
				})
			},
			
			setToolNodeMove: function(obj){
				//绑定窗体鼠标按下事件
				obj.mousedown(function(e){
					obj.data('mousedown', true);
				}).mouseup(function(e){
					obj.data('mousedown', false);
				});
				
				obj.mouseover(function(e){
					obj.draggable({ containment:"window", scroll: false });
					obj[0].style.cursor = "pointer";
				}).mouseout(function(e){
					if(!obj.data('mousedown')){
						$(this).remove();
					}
				});
				
				obj.bind( "dragstart", function(e, ui) {
					this.style.background = "transparent";
				});
				obj.bind( "drag", function(e, ui) {
					var maxPosition = $.flow.getMaxPosition();
					maxPosition.x = Math.max(maxPosition.x, ui.offset.left);
					maxPosition.y = Math.max(maxPosition.y, ui.offset.top);
					$.flow.pub($.flow.subjectId_6, maxPosition);
					$('#vtip').hide();
				});
				obj.bind( "dragstop", function(e, ui) {
					var $this = $(this), imgSrc, type, text;
					
					type = $this.attr('data-type');
					text = $this.attr('data-text');
					$('.imgIcon').hide();
					
					if(!$.flow.toolBox.isInToolBox(ui.offset.left, ui.offset.top)){
						$.flow.createNode(type, text, ui.offset.left-25, ui.offset.top, null, true, false);
						$("body").css({"cursor":"default"});
					}
				});
			}
		}
	);
});