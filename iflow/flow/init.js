/***
 * generzhang@tencent.com
 * 2013-11-13
 */
$(function () {

	$.flow = {
				r:null,
				num:1,
				zIndex:1300,
				links:[],
				nodes:[],
				notes:[],
				e:null,
				flow:(function(){
					
					return $('#flow');
				})(),
				
				nodeType:{
					start:"start",
					end:"end",
					task:"task",
					script:"script",
					api:"api",
					subflow:"subflow",
					join:"join",
					fork:"fork",
					hand:"hand",
					line:"line",
					
					getUserNode:function(obj){
						var o = obj;
						while(o){
							if(o.className && String(o.className).indexOf("userUICom") >=0 ){
								return o;
							}
							o = o.parentNode;
						}
						return null;
					}
				},
				
				linkType:{
				    normal:"normal",
				    reject:"reject"
				},
						
				path:{
					
					arrowEnd:{
						normal:"block-midium-long",
						none:"none"
					},
					strokeWidth:{
						normal:"3px",
						small:"3px",
						large:"4px"
					},
					stroke:{
						normal:"#278BE8",
						focus:"#f00",
						show:"#4E7CDA",
						retry:"#f00",
						reject:"#fa9c09"
					},
					arrow:{
						size:14,
						radian:28
					},
					pointRadiu:20
				},

				initRaphael:function(){
					this.r.path();
					this.r.renderfix();
					this.r.safari();
					this.r.clear();
				}
			}
});