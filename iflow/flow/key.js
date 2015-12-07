/***
 * generzhang@tencent.com
 * 2013-11-13
 */
$(function(){
	var offset;
	function nodeMove(node, e){
		var shape = node.shape;
		var tempX = shape.offset().left, tempY = shape.offset().top;
		if(e.keyCode == 40){//下
			tempY += offset;
		}else if(e.keyCode == 39){//右
			tempX += offset;
		}else if(e.keyCode == 38){//上
			tempY -= offset;
			while(tempY<0){
				tempY ++;
			}
		}else if(e.keyCode == 37){//左
			tempX -= offset;
			while(tempX<0){
				tempX ++;
			}
		}
		node.shape.css({ left: parsePX(tempX), top: parsePX(tempY) });
		$.flow.drawNodeLinks(node);
	}
	
	function linkMove(link, e){
//		var point = link.currentPoint;
		var point;
		point = link.point;
		if(point){
			pointMove(point, e);
			while(point.nextPoint){
				point = point.nextPoint;
				pointMove(point, e);
			}
		}
		$.flow.linkPainter.drawLink(link);
	}
	
	function pointMove(point, e){
		if(e.keyCode == 40){//下
			point.y += offset;
			while(point.y<0){
				point.y ++;
			}
		}else if(e.keyCode == 39){//右
			point.x += offset;
		}else if(e.keyCode == 38){//上
			point.y -= offset;
			while(point.y<0){
				point.y ++;
			}
		}else if(e.keyCode == 37){//左
			point.x -= offset;
			while(point.x<0){
				point.x ++;
			}
		}
	}
	
	$.flow.sub($.flow.subjectId_5, function(e){
		$.flow.keyDownMoved = false;
		if($.flow.keyboard.links.length || $.flow.keyboard.nodes.length){
			if(e.ctrlKey){
				offset = 5;
			}else{
				offset = 2;
			}
			if($.flow.keyboard.nodes.length){
				$.flow.keyDownMoved = true;
				clearTimeout($.flow.keyDownMovedTimeout);
				for(var i=0,len=$.flow.keyboard.nodes.length; i<len; i++){
					nodeMove($.flow.keyboard.nodes[i], e);
				}
			}
			if($.flow.keyboard.links.length){
				for(var i=0,len=$.flow.keyboard.links.length; i<len; i++){
					if($.flow.keyboard.links[i].point){
						$.flow.keyDownMoved = true;
						clearTimeout($.flow.keyDownMovedTimeout);
						linkMove($.flow.keyboard.links[i], e);
					}
				}
			}
			$.flow.pub($.flow.subjectId_6, $.flow.getMaxPosition());
		}
	});
	
	$.flow.sub($.flow.subjectId_8, function(e){
		$.flow.keyDownMovedTimeout = setTimeout(function(){
			if($.flow.keyDownMoved){
				$.flow.keyDownMoved = false;
				$.flow.pub($.flow.subjectId_9, '键盘上下左右');
			}
		}, 200);
	});
	
	$.flow.sub($.flow.subjectId_10, function(e){
		$.flow.deleteDtnStr = '键盘删除按钮';
		$('#btn_delete').click();
		$.flow.deleteDtnStr = '';
	});
});