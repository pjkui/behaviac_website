/***
 * generzhang@tencent.com
 * 2013-11-13
 */

$(function () {
	$.extend(true, $.flow, {
		_subject: {},
		_addSubject: function(id){
			this._subject[id] = [];
		},
		_getSubject: function(id){
			if(!this._subject[id]){
				this._addSubject(id);
			}
			return this._subject[id];
		},
		sub: function(id, action){
			this._getSubject(id).push(action);
		},
		pub: function(id, data){
			var subject = this._getSubject(id);
			for(var i=0,len=subject.length; i<len; i++){
				subject[i](data);
			}
		},
		
		disableAllSubject: function(){
			this.pub = $.noop;
			this.sub = $.noop;
			this._subject = {};
		},
		
		subjectId_1: 'bodyClick',
		subjectId_2: 'bodyDblclick',
		subjectId_3: 'bodyMouseDown',
		subjectId_4: 'bodyMouseUp',
		subjectId_5: 'bodyKeyDown',
		subjectId_6: 'flowElementMove',
		subjectId_7: 'flowSave',
		subjectId_8: 'bodyKeyUp',
		subjectId_9: 'flowChange',
		subjectId_10: 'deleteKeyDown',
		subjectId_11: 'undoCommand',
		subjectId_12: 'redoCommand',
		subjectId_13: 'selectAll',
		subjectId_14: 'copy',
		subjectId_15: 'paste',
		subjectId_16: 'nodeDblclick',
		subjectId_17: 'linkDblclick',
		subjectId_18: 'format',
		subjectId_19: 'flowHelp',
		subjectId_20: 'beforeInit',
		subjectId_21: 'afterInit',
		subjectId_22: 'initNodeMove',
		subjectId_23: 'initLinkNoteMove',
		subjectId_24: 'initLinkPathMove'
	});
});