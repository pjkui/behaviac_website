/***
 * generzhang@tencent.com
 * 2013-11-13
 */

$(function(){
	var startPoint = {}, endPoint = {}, regionDIV = $('#regionDIV'), offsetX, offsetY, rectA = {}, rectB = {}, tempObj, linkSegment;

	$.flow.sub($.flow.subjectId_7, function(success){
		var jsonData = $.flow.getFlowInfo(false), node, link, noteTextObj, nodeTextObj = {};
		
		for(var i=0,len=jsonData.length; i<len; i++){
			node = jsonData[i];
			if(nodeTextObj[node.nodeText]){
				$.messager.alert('提示','流程节点有重名! <br>名称为“'+node.nodeText+'”','error');
				return ;
			}else{
				nodeTextObj[node.nodeText] = node;
			}
			noteTextObj = {};
			for(var j=0,length=node.fromLinks.length; j<length; j++){
				link = node.fromLinks[j];
				if(noteTextObj[link.noteText]){
					$.messager.alert('提示','同一个节点的输出线有重名! <br>名称为“'+link.noteText+'”','error');
					return ;
				}else{
					noteTextObj[link.noteText] = link;
				}
			}
		}
		
		$('.errorCroccPoint').remove();
		linkSegment = {};
		if(hasCrossPoint()){
			$.flow.onMessager = true;
			$.messager.confirm('提示', '连线有交叉点，是否继续保存?', function(r){
				if (r){
					success(jsonData);
					$.flow.onMessager = false;
				}else{
					$.flow.onMessager = false;
				}
			});
			$('.panel-tool-close').click(function(){
				$.flow.onMessager = false;
			});
		}else{
			success(jsonData);
		}
	});
	
	
	$.flow.sub($.flow.subjectId_3, function(e){
		var targetNode = getEventTargetElement(e);
		linkSegment = {};
		if($.flow.getObjectType(targetNode) == 'body'){
			startPoint.x = parseInt(e.pageX);
			startPoint.y = parseInt(e.pageY);
			$('body').bind('mousemove', bodyMouseMove);
			$('body')[0].onselectstart=function(){return false;}
		}
	});
	
	$.flow.sub($.flow.subjectId_4, function(e){
		$('body').unbind('mousemove', bodyMouseMove);//解除触发事件
		regionDIV.hide();
		$('body')[0].onselectstart=function(){return true;}
	});
	
	function bodyMouseMove(e){
		endPoint.x = parseInt(e.pageX);
		endPoint.y = parseInt(e.pageY);
		offsetX = endPoint.x-startPoint.x;
		offsetY = endPoint.y-startPoint.y;
		if(offsetX>=0 && offsetY>0){//右下角
			regionDIV.show().css({left:startPoint.x, top:startPoint.y}).width(Math.abs(offsetX)).height(Math.abs(offsetY));
		}else if(offsetX<=0 && offsetY>0){//左下角
			regionDIV.show().css({left:startPoint.x-Math.abs(offsetX), top:startPoint.y}).width(Math.abs(offsetX)).height(Math.abs(offsetY));
		}else if(offsetX<0 && offsetY<=0){//左上角
			regionDIV.show().css({left:startPoint.x-Math.abs(offsetX), top:startPoint.y-Math.abs(offsetY)}).width(Math.abs(offsetX)).height(Math.abs(offsetY));
		}else{//右上角
			regionDIV.show().css({left:startPoint.x, top:startPoint.y-Math.abs(offsetY)}).width(Math.abs(offsetX)).height(Math.abs(offsetY));
		}
		regionDIV.width(Math.abs(endPoint.x-startPoint.x)).height(Math.abs(endPoint.y-startPoint.y));
		
		$.flow.keyboard.setNull();
		
		rectB.x1 = startPoint.x;
		rectB.y1 = startPoint.y;
		rectB.x2 = endPoint.x;
		rectB.y2 = endPoint.y;
		
		for(var i=0,len=$.flow.nodes.length; i<len; i++){
			setNodeSelectState($.flow.nodes[i]);
		}
		
		for(var k=0,len=$.flow.links.length; k<len; k++){
			setLinkSelectState($.flow.links[k]);
		}
	}
	
	function setNodeSelectState(node, isCtrl_A){
		tempObj = node.shape.find('.userNode');
		rectA.x1 = tempObj.offset().left;
		rectA.y1 = tempObj.offset().top;
		rectA.x2 = rectA.x1 + parseInt(tempObj.width());
		rectA.y2 = rectA.y1 + parseInt(tempObj.height());
		
		if(isCtrl_A || isInRegion()){
			node.shape.addClass('nodeSelected');
			$.flow.keyboard.addNode(node);
		}else{
			node.shape.removeClass('nodeSelected');
		}
	}
	
	
	function setLinkSelectState(link, isCtrl_A){
		var point, hasIn=false;
		if(!isCtrl_A){
			point = link.startPoint;
			hasIn = isPointInRect(point, rectB);
			if(!hasIn && (point=link.point)){
				while(!hasIn && point){
					hasIn = isPointInRect(point, rectB);
					point = point.nextPoint;
				}
			}
			if(!hasIn){
				hasIn = isPointInRect(link.endPoint, rectB);
			}
		}
		if(isCtrl_A || hasIn || isSegmentsInter(getLinkSegments(link),getRectSegments(rectB), false)){
			$.flow.keyboard.addLink(link);
			$.flow.setLinkStroke(link, true, false);
		}else{
		    $.flow.setLinkStroke(link, false, false);
		}
	}
	
	function isPointInRect(point, rect){
		if(point.x>Math.min(rect.x1,rect.x2) && point.x<Math.max(rect.x1,rect.x2) && point.y>Math.min(rect.y1,rect.y2) && point.y<Math.max(rect.y1,rect.y2)){
			return true;
		}else{
			return false;
		}
	}
	
	function isInRegion(){
		if((rectA.x1>rectB.x1 && rectA.x1>rectB.x2 && rectA.x2>rectB.x1 && rectA.x2>rectB.x2)||
		   (rectB.x1>rectA.x1 && rectB.x1>rectA.x2 && rectB.x2>rectA.x1 && rectB.x2>rectA.x2)){
			return false;
		}
		if((rectA.y1>rectB.y1 && rectA.y1>rectB.y2 && rectA.y2>rectB.y1 && rectA.y2>rectB.y2)||
		   (rectB.y1>rectA.y1 && rectB.y1>rectA.y2 && rectB.y2>rectA.y1 && rectB.y2>rectA.y2)){
			return false;
		}
		return true;
	}

	function getRectSegments(rect){
		var segments = [];
		var p1 = {x:rect.x1, y:rect.y1},
			p2 = {x:rect.x2, y:rect.y1},
			p3 = {x:rect.x2, y:rect.y2},
			p4 = {x:rect.x1, y:rect.y2};
		segments.push({p1:p1, p2:p2});
		segments.push({p1:p2, p2:p3});
		segments.push({p1:p3, p2:p4});
		segments.push({p1:p4, p2:p1});
		
		return segments;
	}
	
	function getLinkSegments(link){
		if(linkSegment[link.id]){
			return linkSegment[link.id];
		}
		var p1, p2, end = false, segments = [];
		
		p1 = link.startPoint;
		if(!(p2=link.point)){
			end = true;
			p2 = link.endPoint;
		}
		segments.push({p1:p1, p2:p2});
		
		while(!end && p2.nextPoint){
			p1 = p2;
			p2 = p1.nextPoint;
			segments.push({p1:p1, p2:p2});
		}
		
		if(!end){
			p1 = p2;
			p2 = link.endPoint;
			segments.push({p1:p1, p2:p2});
		}
		segments.link = link;
		linkSegment[link.id] = segments;
		return segments;
	}
	
	function isSegmentsInter(segs1, segs2, isDrowPoint){
		var seg1, seg2, has = false;
		for(var i=0,len=segs1.length; i<len; i++){
			seg1 = segs1[i];
			for(var j=0,length=segs2.length; j<length; j++){
				seg2 = segs2[j];
				if(hasPointInter(seg1.p1, seg1.p2, seg2.p1, seg2.p2, isDrowPoint)){
					has = true;
				}
			}
		}
		return has;
	}
	
	
	
	function hasCrossPoint(){
		var has = false;
		for(var i=0,len=$.flow.links.length; i<len; i++){
			for(var j=i; j<len; j++){
				if(isSegmentsInter(getLinkSegments($.flow.links[i]), getLinkSegments($.flow.links[j]), true)){
					has = true;
				}
			}
		}
		return has;
	}
	
	function hasPointInter(point1, point2, point3, point4, isDrowPoint){
		var x1 = point1.x, y1 = point1.y,
			x2 = point2.x, y2 = point2.y,
			x3 = point3.x, y3 = point3.y,
			x4 = point4.x, y4 = point4.y,
			x, y, temp1, temp2;
		
		if(x1==x2 && x3 == x4 && x1 == x3){//垂直平行  同一直线
			if(Math.min(y1,y2) > Math.max(y3,y4) || Math.min(y3,y4) > Math.max(y1,y2)){
				return false;
			}else{
				return false;
			}
		}else if(y1==y2 && y3==y4 && y1==y3){//水平平行 同一直线
			if(Math.min(x1,x2) > Math.max(x3,x4) || Math.min(x3,x4) > Math.max(x1,x2)){
				return false;
			}else{
				return false;
			}
		}
		
		if((x1==x2 && x3 == x4) || (y1==y2 && y3==y4)){//水平或垂直 平行， 不在同一直线上
			return false;
		}
		
		if(x1!=x2 && x3!=x4){
			if((y1-y2)/(x1-x2) == (y3-y4)/(x3-x4)){//斜线平行
				return false;
			}
		}
		temp1 = (x1*x3*y4 - x1*x4*y3 - x2*x3*y4 + x2*x4*y3 -x1*x3*y2 + x2*x3*y1 + x1*x4*y2 - x2*x4*y1);
		temp2 = (x3*(y1-y2) - x4*(y1-y2) - x1*(y3-y4) + x2*(y3-y4));
		
		if(temp2 == 0){
			return false;
		}
		
		x = temp1/temp2;
		
		if(x1 != x2){
			y = (x*(y1-y2) + x1*y2 - x2*y1)/(x1 - x2); 
		}else{
			y = (x*(y3-y4) + x3*y4 - x4*y3)/(x3 - x4); 
		}
		if( 
			(
					((x>=x1&&x>=x2)||(x<=x1&&x<=x2))&&((y>=y1&&y>=y2)||(y<=y1&&y<=y2))
			)  
			||  
			(
					((x>=x3&&x>=x4)||(x<=x3&&x<=x4))&&((y>=y3&&y>=y4)||(y<=y3&&y<=y4))
			)
		){
			return false;
		}
		if(isDrowPoint){
			drawPoint(x, y);
		}
		return true;
	}
	
	function drawPoint(x, y){
		x -= 8;
		y -= 4;
		$('<div class="errorCroccPoint" style="left:'+x+'px;top:'+y+'px;"></div>').appendTo('body');
	}
	
	$.flow.sub($.flow.subjectId_13, function(type){
		for(var i=0,len=$.flow.nodes.length; i<len; i++){
			setNodeSelectState($.flow.nodes[i], true);
		}
		
		for(var j=0,length=$.flow.links.length; j<length; j++){
			setLinkSelectState($.flow.links[j], true);
		}
	});
	
});