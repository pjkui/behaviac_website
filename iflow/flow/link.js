/***
 * generzhang@tencent.com
 * 2013-11-13
 */
$(function () {
	$.extend(true, $.flow, {
		linkPainter: {
			userNode: null,
			nodeLineSpace: 6,
			lineWidthSpace: 3,
			vSpace: 4,
			
			tryLink: function(link){
				var linkPath;
				link.from.shape.get(0).nodeObj = link.from;
				linkPath = this.tryPath(link, $.flow.path.arrow.size, $.flow.path.arrow.radian);
				if (link.path) {
					link.path.attr({ path: linkPath });
					link.path.addRoundedCorner(10, "dl");
				} else {
					this.createPath(link, linkPath, $.flow.path.strokeWidth.small, ["- "]);
					$.flow.setLinkStroke(link, false, false);
				}
				
				return link;
			},
			
			drawLink: function(link, isLayoutLink){
				var linkPath;
				if($.flow.onLayout && !$.flow.layoutNode){
					if(link.layouted && isLayoutLink){
						return ;
					}
				}

				if(isLayoutLink){
					link.layouted = true;
				}

				if(!link.from.shape){
					return ;
				}
				if(!link.to.shape){
					return ;
				}
				
				$.flow.initLinkNode(link);
				linkPath = this.drawPath(link, $.flow.readOnly?($.flow.path.arrow.size-3):$.flow.path.arrow.size, $.flow.path.arrow.radian, isLayoutLink);
				
				if (link.path) {
					if($.flow.onLayout){
						if(link.linkPathStr !== linkPath.join('')){
							$.flow.layoutChange = true;
						}
					}
					link.linkPathStr = linkPath.join('');
					link.path.attr({ path: linkPath });
					link.path.addRoundedCorner(10, "dl");
					$.flow.resetLinkNote(false, link);
				} else {
					this.createPath(link, linkPath, $.flow.readOnly?$.flow.path.strokeWidth.small:$.flow.path.strokeWidth.large, [""]);
					$.flow.setLinkStroke(link, false, false, $.flow.readOnly?$.flow.path.stroke.show:null);
				}
				
				return link;
			},
			
			createPath: function(link, linkPath, strokeWidth, strokeDasharray){
				link.id = link.id || generateUniqId();
				link.path = $.flow.r.path(linkPath);
				link.path.linkObj = link;
				link.path.attr({"stroke-width": strokeWidth, "arrow-end":$.flow.path.arrowEnd.none, "stroke-dasharray":strokeDasharray});
				link.path.addRoundedCorner(10, "dl");
				$.flow.addLink(link);
				link.path.toBack();
			},
			
			drawPath: function(link, size, radian, isLayoutLink){
				var node, position, val, dx, dy, layoutNode, from = link.from, to = link.to, point = link.point, result = [], x1, y1, x2, y2, line = null;
				
				this.userNode = $(".userNode");
				
				//排版
				if($.flow.onLayout && isLayoutLink){
					dx = Math.abs(link.from.shape.offset().left-link.to.shape.offset().left);
					dy = Math.abs(link.from.shape.offset().top-link.to.shape.offset().top);
					
					$.flow.linkLayout = $.flow.linkLayout||{};
					
					layoutNode = $.flow.layoutNode||link.layoutNode
					
					this.layout(layoutNode, link, dx-dy);
					
				}

				if(point){
					
					line = this.getN2PLine(from.shape, point);
					result[result.length] = "M";
					result[result.length] = line.fromX;
					result[result.length] = line.fromY;
					link.startPoint.x = line.fromX;
					link.startPoint.y = line.fromY;
				
					result[result.length] = "L";
					result[result.length] = point.x;
					result[result.length] = point.y;
					x1 = point.x;
					y1 = point.y;
					while(point.nextPoint){
						point = point.nextPoint;
						result[result.length] = "L";
						result[result.length] = point.x;
						result[result.length] = point.y;
						x1 = point.x;
						y1 = point.y;
					}
					
					line = this.getP2NLine(point, to.shape);
					result[result.length] = "L";
					result[result.length] = line.toX;
					result[result.length] = line.toY;
					
				}else{
					line = this.getN2NLine(from.shape, to.shape);
					result[result.length] = "M";
					result[result.length] = line.fromX;
					result[result.length] = line.fromY;
					result[result.length] = "L";
					result[result.length] = line.toX;
					result[result.length] = line.toY;
					x1 = line.fromX;
					y1 = line.fromY;
					link.startPoint.x = line.fromX;
					link.startPoint.y = line.fromY;
				}
				x2 = line.toX;
				y2 = line.toY;
				
				if(size > 0){
					this.paintAngle(result, size, radian, x1, y1, x2, y2);
				}
				link.endPoint.x = line.toX;
				link.endPoint.y = line.toY;
				
				return result;
			},
			
			tryPath: function(link, size, radian){
				var from  = link.from, to = link.to, point = to, result = [], x1, y1, x2, y2, line = null;
				
				this.userNode = $(".userNode");
				
				line = this.getN2PLine(from.shape, point);
				result[result.length] = "M";
				result[result.length] = line.fromX;
				result[result.length] = line.fromY;
				result[result.length] = "L";
				result[result.length] = point.x;
				result[result.length] = point.y;
				x1 = line.fromX;
				y1 = line.fromY;

				x2 = to.x;
				y2 = to.y;
				
				if(size > 0){
					this.paintAngle(result, size, radian, x1, y1, x2, y2);
				}

				return result;
			},
			
			paintAngle: function(result, size, radian, x1, y1, x2, y2){
				var a45, a45m, x2a, y2a, x2b, y2b, angle = Raphael.angle(x1, y1, x2, y2);//得到两点之间的角度
				
				a45 = Raphael.rad(angle - radian);//角度转换成弧度
				a45m = Raphael.rad(angle + radian);
				x2a = x2 + Math.cos(a45) * size;
				y2a = y2 + Math.sin(a45) * size;
				x2b = x2 + Math.cos(a45m) * size;
				y2b = y2 + Math.sin(a45m) * size;
				
				result[result.length] = "L";
				result[result.length] = x2a;
				result[result.length] = y2a;
				result[result.length] = "M";
				result[result.length] = x2;
				result[result.length] = y2;
				result[result.length] = "L";
				result[result.length] = x2b;
				result[result.length] = y2b;
			},
			
			layout: function(node, link, xy){
				var nodeA = null, nodeB = null, userNode = this.userNode, lineWidthSpace = this.lineWidthSpace;
				
				if(link.point){
					if(!link.point.nextPoint){
						this.resetLinkPoint({x:link.from.shape.offset().left + link.from.shape.width() / 2 - lineWidthSpace, y:link.from.shape.offset().top + userNode.height()/2}, {x:link.to.shape.offset().left + link.to.shape.width() / 2 - lineWidthSpace, y:link.to.shape.offset().top + userNode.height()/2}, link.point);
					}else{
						this.resetLinkPoint({x:link.from.shape.offset().left + link.from.shape.width() / 2 - lineWidthSpace, y:link.from.shape.offset().top + userNode.height()/2}, {x:link.point.nextPoint.x, y:link.point.nextPoint.y}, link.point);
						
						var point = link.point.nextPoint;
						while(point.nextPoint){
							this.resetLinkPoint({x:point.prevPoint.x, y:point.prevPoint.y}, {x:point.nextPoint.x, y:point.nextPoint.y}, point);
							point = point.nextPoint;
						}
						this.resetLinkPoint({x:point.prevPoint.x, y:point.prevPoint.y}, {x:link.to.shape.offset().left + link.to.shape.width() / 2 - lineWidthSpace, y:link.to.shape.offset().top + userNode.height()/2}, point);
					}
				}else if(node == link.from){
					nodeA = link.from;
					nodeB = link.to;
				}else if(node == link.to){
					nodeA = link.to;
					nodeB = link.from;
				}
				
				if(nodeA && nodeB){
					
					if(xy>0){
						if(nodeA.shape.offset().left<nodeB.shape.offset().left){//右方
							position = 'right';
						}else{//左方
							position = 'left';
						}
						if(!$.flow.linkLayout[node.id+position]){
							nodeB.shape.css({top:parsePX(nodeA.shape.offset().top)});
						}
						val = nodeB.shape.offset().left;
					}else{
						if(nodeA.shape.offset().top<nodeB.shape.offset().top){//下方
							position = 'bottom';
						}else{//上方
							position = 'top';
						}
						if(!$.flow.linkLayout[node.id+position]){
							nodeB.shape.css({left:parsePX(nodeA.shape.offset().left)});
						}
						val = nodeB.shape.offset().top;
					}	
					$.flow.linkLayout[node.id+position] = val;
					$.flow.drawNodeLinksByLink(nodeB, link);
				}
			},
			
			resetLinkPoint: function(fromCore, toCore, point){
				var p1 = {x:fromCore.x, y:toCore.y}, p2 = {x:toCore.x, y:fromCore.y}, dx1, dy1, dx2, dy2;
				
				dx1 = p1.x-point.x;
				dy1 = p1.y-point.y;
				dx2 = p2.x-point.x;
				dy2 = p2.y-point.y;
				
				if((dx1*dx1 + dy1*dy1) > (dx2*dx2 + dy2*dy2)){
					point.x = p2.x;
					point.y = p2.y;
				}else{
					point.x = p1.x;
					point.y = p1.y;
				}
				return point;
			},
			
			getUserNodeShape: function(shape){
				var userNode = this.userNode, nodeLineSpace = this.nodeLineSpace, x, y, width, height;

				x = shape.offset().left + (shape.width()-userNode.width())/2 - nodeLineSpace*2;
				y = shape.offset().top - nodeLineSpace*2;
				width = userNode.width() + nodeLineSpace*4; 
				height = userNode.height() + nodeLineSpace*4;
				
				return {x:x, y:y, width:width, height:height};
			},
			
			getShapeCore: function(userNodeShape){
			    return {x:userNodeShape.x + userNodeShape.width / 2, y:userNodeShape.y + userNodeShape.height / 2};
			},
			
			getN2PLine: function(shape, point){
				var userNodeShape = this.getUserNodeShape(shape), 
					nodeLineSpace = this.nodeLineSpace,
					lineWidthSpace = this.lineWidthSpace,
					vSpace = this.vSpace,
				
					p = [
						{x: userNodeShape.x + nodeLineSpace, y: userNodeShape.y + nodeLineSpace},//0
						{x: userNodeShape.x + userNodeShape.width/4, y: userNodeShape.y + nodeLineSpace/2},//1
						{x: userNodeShape.x + userNodeShape.width/2 - lineWidthSpace, y: userNodeShape.y},//2
						{x: userNodeShape.x + 3*userNodeShape.width/4, y: userNodeShape.y + nodeLineSpace/2},//3
						{x: userNodeShape.x + userNodeShape.width - nodeLineSpace, y: userNodeShape.y + nodeLineSpace},//4
						{x: userNodeShape.x + userNodeShape.width - nodeLineSpace/2, y: userNodeShape.y + userNodeShape.height/4},//5
						{x: userNodeShape.x + userNodeShape.width, y: userNodeShape.y + userNodeShape.height/2},//6
						{x: userNodeShape.x + userNodeShape.width - nodeLineSpace/2, y: userNodeShape.y + 3*userNodeShape.height/4},//7
						{x: userNodeShape.x + userNodeShape.width - nodeLineSpace, y: userNodeShape.y + userNodeShape.height - nodeLineSpace},//8
						{x: userNodeShape.x + 3*userNodeShape.width/4, y: userNodeShape.y + userNodeShape.height - nodeLineSpace/2 + vSpace},//9
						{x: userNodeShape.x + userNodeShape.width/2 - lineWidthSpace, y: userNodeShape.y + userNodeShape.height + vSpace},//10
						{x: userNodeShape.x + userNodeShape.width/4, y: userNodeShape.y + userNodeShape.height - nodeLineSpace/2 + vSpace},//11
						{x: userNodeShape.x + nodeLineSpace, y: userNodeShape.y + userNodeShape.height - nodeLineSpace},//12
						{x: userNodeShape.x + nodeLineSpace/2, y: userNodeShape.y + 3*userNodeShape.height/4},//13
						{x: userNodeShape.x, y: userNodeShape.y + userNodeShape.height/2},//14
						{x: userNodeShape.x + nodeLineSpace/2, y: userNodeShape.y + userNodeShape.height/4},//15
						
						{x: point.x, y: point.y},//16
						{x: point.x, y: point.y},//17
						{x: point.x - lineWidthSpace, y: point.y},//18
						{x: point.x, y: point.y},//19
						{x: point.x, y: point.y},//20
						{x: point.x, y: point.y},//21
						{x: point.x, y: point.y},//22
						{x: point.x, y: point.y},//23
						{x: point.x, y: point.y},//24
						{x: point.x, y: point.y},//25
						{x: point.x - lineWidthSpace, y: point.y},//26
						{x: point.x, y: point.y},//27
						{x: point.x, y: point.y},//28
						{x: point.x, y: point.y},//29
						{x: point.x, y: point.y},//30
						{x: point.x, y: point.y} //31
					];
					
					shape.core = {x:userNodeShape.x + userNodeShape.width / 2, y:userNodeShape.y + userNodeShape.height / 2};
					
					return this.getLine(p, shape.core.x-point.x, shape.core.y-point.y);
			},
			
			getN2NLine: function(shape1, shape2){
				var userNodeShape1 = this.getUserNodeShape(shape1), userNodeShape2 = this.getUserNodeShape(shape2)
					nodeLineSpace = this.nodeLineSpace,
					lineWidthSpace = this.lineWidthSpace,
					vSpace = this.vSpace,
			
					p = [
						{x: userNodeShape1.x + nodeLineSpace, y: userNodeShape1.y + nodeLineSpace},//0
						{x: userNodeShape1.x + userNodeShape1.width/4, y: userNodeShape1.y + nodeLineSpace/2},//1
						{x: userNodeShape1.x + userNodeShape1.width/2 - lineWidthSpace, y: userNodeShape1.y},//2
						{x: userNodeShape1.x + 3*userNodeShape1.width/4, y: userNodeShape1.y + nodeLineSpace/2},//3
						{x: userNodeShape1.x + userNodeShape1.width - nodeLineSpace, y: userNodeShape1.y + nodeLineSpace},//4
						{x: userNodeShape1.x + userNodeShape1.width - nodeLineSpace/2, y: userNodeShape1.y + userNodeShape1.height/4},//5
						{x: userNodeShape1.x + userNodeShape1.width, y: userNodeShape1.y + userNodeShape1.height/2},//6
						{x: userNodeShape1.x + userNodeShape1.width - nodeLineSpace/2, y: userNodeShape1.y + 3*userNodeShape1.height/4},//7
						{x: userNodeShape1.x + userNodeShape1.width - nodeLineSpace, y: userNodeShape1.y + userNodeShape1.height - nodeLineSpace},//8
						{x: userNodeShape1.x + 3*userNodeShape1.width/4, y: userNodeShape1.y + userNodeShape1.height - nodeLineSpace/2 + vSpace},//9
						{x: userNodeShape1.x + userNodeShape1.width/2 - lineWidthSpace, y: userNodeShape1.y + userNodeShape1.height + vSpace},//10
						{x: userNodeShape1.x + userNodeShape1.width/4, y: userNodeShape1.y + userNodeShape1.height - nodeLineSpace/2 + vSpace},//11
						{x: userNodeShape1.x + nodeLineSpace, y: userNodeShape1.y + userNodeShape1.height - nodeLineSpace},//12
						{x: userNodeShape1.x + nodeLineSpace/2, y: userNodeShape1.y + 3*userNodeShape1.height/4},//13
						{x: userNodeShape1.x, y: userNodeShape1.y + userNodeShape1.height/2},//14
						{x: userNodeShape1.x + nodeLineSpace/2, y: userNodeShape1.y + userNodeShape1.height/4},//15
						
						{x: userNodeShape2.x + nodeLineSpace, y: userNodeShape2.y + nodeLineSpace},//16
						{x: userNodeShape2.x + userNodeShape2.width/4, y: userNodeShape2.y + nodeLineSpace/2},//17
						{x: userNodeShape2.x + userNodeShape2.width/2 - lineWidthSpace, y: userNodeShape2.y},//18
						{x: userNodeShape2.x + 3*userNodeShape2.width/4, y: userNodeShape2.y + nodeLineSpace/2},//19
						{x: userNodeShape2.x + userNodeShape2.width - nodeLineSpace, y: userNodeShape2.y + nodeLineSpace},//20
						{x: userNodeShape2.x + userNodeShape2.width - nodeLineSpace/2, y: userNodeShape2.y + userNodeShape2.height/4},//21
						{x: userNodeShape2.x + userNodeShape2.width, y: userNodeShape2.y + userNodeShape2.height/2},//22
						{x: userNodeShape2.x + userNodeShape2.width - nodeLineSpace/2, y: userNodeShape2.y + 3*userNodeShape2.height/4},//23
						{x: userNodeShape2.x + userNodeShape2.width - nodeLineSpace, y: userNodeShape2.y + userNodeShape2.height - nodeLineSpace},//24
						{x: userNodeShape2.x + 3*userNodeShape2.width/4, y: userNodeShape2.y + userNodeShape2.height - nodeLineSpace/2 + vSpace},//25
						{x: userNodeShape2.x + userNodeShape2.width/2 - lineWidthSpace, y: userNodeShape2.y + userNodeShape2.height + vSpace},//26
						{x: userNodeShape2.x + userNodeShape2.width/4, y: userNodeShape2.y + userNodeShape2.height - nodeLineSpace/2 + vSpace},//27
						{x: userNodeShape2.x + nodeLineSpace, y: userNodeShape2.y + userNodeShape2.height - nodeLineSpace},//28
						{x: userNodeShape2.x + nodeLineSpace/2, y: userNodeShape2.y + 3*userNodeShape2.height/4},//29
						{x: userNodeShape2.x, y: userNodeShape2.y + userNodeShape2.height/2},//30
						{x: userNodeShape2.x + nodeLineSpace/2, y: userNodeShape2.y + userNodeShape2.height/4},//31
					];
					
				shape1.core = {x:userNodeShape1.x + userNodeShape1.width / 2, y:userNodeShape1.y + userNodeShape1.height / 2};
				shape2.core = {x:userNodeShape2.x + userNodeShape2.width / 2, y:userNodeShape2.y + userNodeShape2.height / 2};

				return this.getLine(p, shape1.core.x-shape2.core.x, shape1.core.y-shape2.core.y);
			},
			
			getP2NLine: function(point, shape){
				var userNodeShape = this.getUserNodeShape(shape), nodeLineSpace = this.nodeLineSpace, lineWidthSpace = this.lineWidthSpace, vSpace = this.vSpace,
				
					p = [
						{x: point.x, y: point.y},//0
						{x: point.x, y: point.y},//1
						{x: point.x - lineWidthSpace, y: point.y},//2
						{x: point.x, y: point.y},//3
						{x: point.x, y: point.y},//4
						{x: point.x, y: point.y},//5
						{x: point.x, y: point.y},//6
						{x: point.x, y: point.y},//7
						{x: point.x, y: point.y},//8
						{x: point.x, y: point.y},//9
						{x: point.x - lineWidthSpace, y: point.y},//10
						{x: point.x, y: point.y},//11
						{x: point.x, y: point.y},//12
						{x: point.x, y: point.y},//13
						{x: point.x, y: point.y},//14
						{x: point.x, y: point.y},//15
						
						{x: userNodeShape.x + nodeLineSpace, y: userNodeShape.y + nodeLineSpace},//16
						{x: userNodeShape.x + userNodeShape.width/4, y: userNodeShape.y + nodeLineSpace/2},//17
						{x: userNodeShape.x + userNodeShape.width/2 - lineWidthSpace, y: userNodeShape.y},//18
						{x: userNodeShape.x + 3*userNodeShape.width/4, y: userNodeShape.y + nodeLineSpace/2},//19
						{x: userNodeShape.x + userNodeShape.width - nodeLineSpace, y: userNodeShape.y + nodeLineSpace},//20
						{x: userNodeShape.x + userNodeShape.width - nodeLineSpace/2, y: userNodeShape.y + userNodeShape.height/4},//21
						{x: userNodeShape.x + userNodeShape.width, y: userNodeShape.y + userNodeShape.height/2},//22
						{x: userNodeShape.x + userNodeShape.width - nodeLineSpace/2, y: userNodeShape.y + 3*userNodeShape.height/4},//23
						{x: userNodeShape.x + userNodeShape.width - nodeLineSpace, y: userNodeShape.y + userNodeShape.height - nodeLineSpace},//24
						{x: userNodeShape.x + 3*userNodeShape.width/4, y: userNodeShape.y + userNodeShape.height - nodeLineSpace/2 + vSpace},//25
						{x: userNodeShape.x + userNodeShape.width/2 - lineWidthSpace, y: userNodeShape.y + userNodeShape.height + vSpace},//26
						{x: userNodeShape.x + userNodeShape.width/4, y: userNodeShape.y + userNodeShape.height - nodeLineSpace/2 + vSpace},//27
						{x: userNodeShape.x + nodeLineSpace, y: userNodeShape.y + userNodeShape.height - nodeLineSpace},//28
						{x: userNodeShape.x + nodeLineSpace/2, y: userNodeShape.y + 3*userNodeShape.height/4},//29
						{x: userNodeShape.x, y: userNodeShape.y + userNodeShape.height/2},//30
						{x: userNodeShape.x + nodeLineSpace/2, y: userNodeShape.y + userNodeShape.height/4},//31
					];
					
				shape.core = {x:userNodeShape.x + userNodeShape.width / 2, y:userNodeShape.y + userNodeShape.height / 2};

				return this.getLine(p, point.x - shape.core.x, point.y - shape.core.y);
			},
			
			getLine: function(p, shapeX, shapeY){//获取连线两端点的位置
				
				var i = 0, j = 0, ddis, dd = Math.abs(shapeX)-Math.abs(shapeY), dis = Math.sqrt(shapeX*shapeX + shapeY*shapeY), result;

				ddis = Math.abs(dd/dis);
				
				if(Math.abs(shapeX) > Math.abs(shapeY)){//左右类型
					if(shapeX <= 0){
						if(ddis < 0.3){
							if(shapeY <= 0){
								i = 8;j = 16;
							}else{
								i = 4;j = 28;
							}
						}else if(ddis < 0.5){
							if(shapeY <= 0){
								i = 7;j = 31;
							}else{
								i = 5;j = 29;
							}
						}else{
							i = 6;j = 30;
						}
					}else{
						if(ddis < 0.3){
							if(shapeY <= 0){
								i = 12;j = 20;
							}else{
								i = 0;j = 24;
							}
						}else if(ddis < 0.5){
							if(shapeY <= 0){
								i = 13;j = 21;
							}else{
								i = 15;j = 23;
							}
						}else{
							i = 14;j = 22;
						}
					}
				}else{
					if(shapeY <= 0){
						if(ddis < 0.3){
							if(shapeX <= 0){
								i = 8;j = 16;
							}else{
								i = 12;j = 20;
							}
						}else if(ddis < 0.5){
							if(shapeX <= 0){
								i = 9;j = 17;
							}else{
								i = 11;j = 19;
							}
						}else{
							i = 10;j = 18;
						}
					}else{
						if(ddis < 0.3){
							if(shapeX <= 0){
								i = 4;j = 28;
							}else{
								i = 0;j = 24;
							}
						}else if(ddis < 0.5){
							if(shapeX <= 0){
								i = 3;j = 27;
							}else{
								i = 1;j = 25;
							}
						}else{
							i = 2;j = 26;
						}
					}
				}
				
				result = {};
				result.fromX = p[i].x;
				result.fromY = p[i].y;
				result.toX = p[j].x;
				result.toY = p[j].y;
				
				return result;
			}
		}
	});
});