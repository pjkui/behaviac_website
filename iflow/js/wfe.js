$.pageDesign = {
        singleSelectWidth: '134px',
        multiSelectWidth: '110px',
        init: function(){
            $('.combo').live('click', function(){
                var maxHeight;
                $.each($('.combo-panel.panel-body.panel-body-noheader'), function(n, p){
                    p = $(p);
                    if(p.find('.datebox-calendar-inner').length == 0){
                        maxLehgth = 10;
                        
                        maxLehgth = Math.min(maxLehgth,p.children().length);
                        maxLehgth = Math.max(maxLehgth,1);
                        p.height(maxLehgth*21+'px');
                    }
                });
            });
        }
}

$.pageDesign.init();

function openNewFlowImage(id){
	window.open(WFE.getBaseUrl() + 'w/flow_editor/flow_image_new?id=' + id)
}

/***
 * 参数说明：cascade1、cascade2是两个对象，结构如：{eleSelect:第一级的select对象的id, eleInterface:'第一级接口', eleMultiType:'第一级的类型'}, {eleSelect:第二级的select对象id, eleInterface:'第二级接口', eleMultiType:'第二级的类型'}
 * 			另一种传参方式：直接把上面的对象放进一个数组传进来
 * @param cascade1
 * @param cascade2
 */
function bindCascadeEvent(){
	var args, cascadeFirst, cascadeCurr, cascadeCur, data, firstData = '', eleInterface, cascadeTemp, index;
	if(arguments[0].join){
		args = arguments[0];
	}else{
		args = arguments;
	}
	setTimeout(function(){
		(function(args){
		    cascadeFirst = args[0];
		    eleInterface = cascadeFirst.eleInterface?$.trim(cascadeFirst.eleInterface):'';
            $.ProxyAjax({
                url: eleInterface.replace(/=/g, '____'),
                data: {},
                dataType: "json",
                type: "POST",
                async: false,
                success: function(msg) {
                    if(parseInt(msg.ret_code) == 200){
                        data = msg.data;
                        if(data){
                            firstData = data;
                        }
                    }
                },
                error: function(a, b, c) {}
            });
		    
		    
			for(var i=0,len=args.length; i<len; i++){
				cascadeCurr = args[i];
				cascadeNext = args[i+1];
				
				(function(cascadeCurr, cascadeNext){
				    
				    cascadeCurr.index = i;
				    cascadeCurr.combobox = build(firstData, cascadeCurr.eleMultiType?cascadeCurr.eleMultiType:1, cascadeCurr.eleSelect, function(value){
                        if(!cascadeNext) return;
                        index = 0;
                        cascadeCurr.value = value;
                        eleInterface = cascadeNext.eleInterface?$.trim(cascadeNext.eleInterface):'';
                        while(index < cascadeNext.index){
                            cascadeTemp = args[index++];
                            eleInterface = eleInterface.replace('${'+index+'}', cascadeTemp.value);
                        }
                        $.ProxyAjax({
                            url: eleInterface.replace(/=/g, '____'),
                            data: {},
                            dataType: "json",
                            type: "POST",
                            async: false,
                            success: function(msg) {
                                if(parseInt(msg.ret_code) == 200){
                                    data = msg.data;
                                    if(data){
                                        cascadeNext.combobox = build(data, cascadeNext.eleMultiType?cascadeNext.eleMultiType:1, cascadeNext.eleSelect, cascadeNext.combobox.onSelect);
                                    }
                                }
                            },
                            error: function(a, b, c) {}
                        });
                    });
				    firstData = '';
				})(cascadeCurr, cascadeNext);
			}
		})(args);
	}, 1);
	
	function build(data, eleMultiType, select, onSelect){	
		var options, tempData, tempObj;
		data = data.split(';');
		if(eleMultiType == 1){
		    tempData = [];
            for(var i=0,len=data.length; i<len; i++){
                if(data[i] && $.trim(data[i])){
                    options = data[i].split(',');
                    tempObj = {};
                    tempObj.id = options[0];
                    tempObj.text = options[1];
                    tempData.push(tempObj);
                }
            }
            return doBuildSingleSelectCombox(select, tempData, onSelect);
		}else{
			tempData = [];
			for(var i=0,len=data.length; i<len; i++){
				if(data[i] && $.trim(data[i])){
					options = data[i].split(',');
					tempObj = {};
					tempObj.key = options[0];
					tempObj.value = options[1];
					tempData.push(tempObj);
				}
			}
			return doBuildMultiSelectCombox(select, tempData, onSelect);
		}
	}
}

function buildMultiSelectCombox(select, data, onSelect, defaultKey){
    
    setTimeout(function(){
        doBuildMultiSelectCombox(select, data, onSelect, defaultKey);
    }, 1);
}

function buildSingleSelectCombox(select, data, onSelect, defaultKey){
    
    setTimeout(function(){
        doBuildSingleSelectCombox(select, data, onSelect, defaultKey);
    }, 1);
}

function doBuildMultiSelectCombox(select, data, onSelect, defaultKey){
    var combobox, width, style;
    
    onSelect = onSelect||$.noop;
    defaultKey = (defaultKey===undefined?'':defaultKey);
    select = $('#'+select);
    
    width = parseInt(select.css('width'));
    style = select.attr('style');
    style = style.replace(/\s/g,   '');
    if(width<50 || (style.indexOf('width:') !==0 && style.indexOf(';width:')<0)){
        select.css('width', $.pageDesign.multiSelectWidth);
    }
    
    combobox = select.multiCombobox({
        width: select.width(),
        zIndex: 9999,
        allValue: 0,
        name: select,
        data: data,
        defaultKey: defaultKey,
        top:24,
        onSelect: function(value){
            if(value!==undefined){
                select.data('combobox-value', value);
                select.data('combobox-text', combobox.getText(data, value));
                onSelect.call(this, value);
            }
        },
        autoWidth:true
    });
    
    if(defaultKey !== ''){
        select.data('combobox-value', defaultKey);
        select.data('combobox-text', combobox.getText(data, defaultKey));
    }
    
    combobox.onSelect = onSelect;
    
    return combobox;
}

function doBuildSingleSelectCombox(select, data, onSelect, defaultKey){
    var combobox, width, style;
    
    select = $('#'+select);
    
    onSelect = onSelect||$.noop;
    
    width = parseInt(select.css('width'));
    style = select.attr('style')||'';
    style = style.replace(/\s/g,   '');
    if(width < 50 || (style.indexOf('width:') !==0 && style.indexOf(';width:')<0)){
        select.css('width', $.pageDesign.singleSelectWidth);
    }
    
    combobox = {onSelect: onSelect, getText: function (data, defaultKey){
        if(defaultKey !== undefined && defaultKey !== ''){
            for(var i=0; i<data.length; i++){
                if(data[i].id === defaultKey){
                    return data[i].text;
                }
            }
        }
        return '';
    }};
    
    defaultKey = (defaultKey===undefined?'':defaultKey);
    
    select.combobox({valueField:"id",textField:"text",data:data, onSelect:function(value){
        if(value && value.id!==undefined){
            select.data('combobox-value', value.id);
            select.data('combobox-text', combobox.getText(data, value.id));
            onSelect.call(this, value.id);
        }
    }});
    
    if(defaultKey !== ''){
        select.combobox('setValue',defaultKey);
        select.data('combobox-value', defaultKey);
        select.data('combobox-text', combobox.getText(data, defaultKey));
    }
    
    return combobox;
}


/**
 * 对table的说明：外部只需准备一个空table如:<table id="mytable"></table> 
 * @param table  table对象id
 * @param theader  表头信息   city,城市;nmonth,月份
 * @param data  [{"province":"广东","city":"深圳"}, {"province":"广西","city":"桂林"}, ……]
 * @param pageSize  每页记录数
 */
function buildTableBody(table, theader, data, pageSize){
	var i, len, keyVal, className, tr, key, head, tKeyVals, tKeyVal, tbody, eleBody = [], sort = 'sort', args = arguments, callback = $.noop;;
	
	setTimeout(function(){
		table = $('#'+table);
		table.addClass('jq_table');
		
		if(typeof args[4] === 'function'){
			callback = args[4];
			sort = '';
		}

		if(typeof theader == 'string'){
			theader = theader.replace(/\n/g, '').replace(/\r/g, '');
			head = theader;
			theader = [];
			
			tKeyVals = head.split(';');
			for(var i=0,len=tKeyVals.length; i<len; i++){
				if(tKeyVal = tKeyVals[i]){
					tKeyVal = tKeyVal.split(',');
					if(tKeyVal[0] && tKeyVal[1] && !tKeyVal[2]){
						theader.push({key:tKeyVal[0], value:tKeyVal[1]});
					}
				}
			}
		}
		
		eleBody.push('<thead><tr>');
		for(i=0,len=theader.length; i<len; i++){
			keyVal = theader[i];
			eleBody.push('<th class="'+sort+'">'+keyVal.value+'</th>');
		}
		eleBody.push('</tr></thead><tbody></tbody><tfoot><tr><td class="pagebox" colspan="'+len+'"></td></tr></tfoot>');
		eleBody = eleBody.join('');
		
		table.html(eleBody);
		
		tbody = table.find('tbody');
		
		for(var i=0,len=data.length; i<len; i++){
			tr = [];
			if(i%2==1){
				className = 'odd';
			}else{
				className = '';
			}
			tr.push('<tr class="'+className+'">');
			for(var k=0,length=theader.length; k<length; k++){
				key = theader[k].key;
				key = key.replace(/\n/g, '').replace(/\r/g, '');
				tr.push('<td>');
				tr.push(data[i][key]||'');
				tr.push('</td>');
			}
			tr.push('</tr>');
			$(tr.join('')).appendTo(tbody);
		}
		
		if(data.length>pageSize){
		    table.paging({
	             total:data.length,
	             pageSize:pageSize
	        });
		}else{
		    table.find('tfoot').hide();
		}
		
		callback();
	}, 1);
}


function getIframeComp(url, height){
	height = height||'100%';
	return '<iframe width="100%" height="'+height+'" frameborder="0" src="'+url+'"/>'
}

function validateByInterface(url){
	var data = {result:'no', msg:'接口请求失败'};
	$.ProxyAjax({
		url: url.replace(/=/g, '____'),
	    data: {},
	    dataType: "json",
	    type: "POST",
	    async: false,
	    success: function(obj) {
	    	if(obj.ret_code == 200){
	    		data = obj.data;
	    	}
	    },
	    error: function(a, b, c) {}
	});
	
	if(data.result === 'no'){
		alert(data.msg);
		return false;
	}else if(data.result !== 'yes'){
		alert('接口返回格式错误');
		return false;
	}
	
	return true;
}

function interator(obj, func) {
    for (var p in obj) {
        var v = obj[p];
        var typev = typeof(v);
        if (typev == "object") {
            interator(v, func);
        } else if (typev == "function") {
        } else {
            obj[p] = func(p, v);
        }
    }
}

function params2obj(params) {
    var obj = {};

    function parse(str) {
        var attributeName = str.split("=")[0];
        var attributeValue = str.split("=")[1];
        if (null == attributeValue) {
            return;
        }

        var tokens = attributeName.split(".");
        for (var i = 1; i < tokens.length; i++) {
            var array = [];
            array.push("obj");
            for (var j = 0; j < i; j++) {
                array.push(tokens[j]);
            }
            var join = array.join(".");
            if (!eval(join)) {
                eval(join + "={};");
            }
        }
        eval("obj." + attributeName + "='';");
        var ref = obj;
        for (var i = 0; i < tokens.length; i++) {
            if (i != tokens.length - 1) {
                ref = obj[tokens[i]];
            } else {
                ref[tokens[i]] = attributeValue;
            }
        }
    }

    var properties = params.split("&");
    for (var i = 0; i < properties.length; i++) {
        parse(properties[i]);
    }

    interator(obj, function(k, v) {
        return decodeURIComponent(v);
    });
    return obj;
}

$.fn.form2json = function () {
    return params2obj(this.serialize().replace(/\+/g, "%20"));
};

function openUrl(title, url) {
    try{
        if (typeof(addNewTab) == "function") {
            addNewTab(title, url);
        } else {
            if (typeof(top.parent.addTab) == "function") {
                top.parent.addTab(title, url);
            } else {
                window.open(url);
            }
        }
    }catch(e){
        window.open(url);
    }
}

function openTopPageDesign(title, url){
    try{
        if(typeof(top.openPageDesign) == 'function'){
            top.openPageDesign(url);
        }else{
            window.open(url);
        }
    }catch(e){
        window.open(url);
    }
}

function closeTopPageDesign(isCloseWindow){
    try{
        if(typeof top.closePageDesign == 'function'){
            top.closePageDesign();
        }else if(isCloseWindow){
            closeWindow();
        }
    }catch(e){
        closeWindow();
    }
    return true;
}

function closeWindow(){
    if($.odfl.browser.chrome){
        window.open('','_self','');
    }
    window.close();
}

function validateNotBlank(name, value) {
    if (!value) {
        alert(name + "不能为空");
        return false;
    }
    return true;
}

function validateIp(name, value) {
    var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/g;
    var matchs = value.match(re);
    if (matchs == null || matchs.length == 0) {
        alert(name + "格式不对，必须为合法IP");
        return false;
    }
    return true;
}

function validateIps(name, value) {
    var ips = value.split(";");
    for (var i = 0; i < ips.length; i++) {
        var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/g;
        var matchs = ips[i].match(re);
        if (matchs == null || matchs.length == 0) {
            alert(name + "格式不对，必须为合法IP");
            return false;
        }
    }
    return true;
}

function validateDate(name, value) {
    return true;
}

function verifyInteger(name, value) {
    var re = /^[0-9]+/g;
    var matchs = value.match(re);
    if (matchs == null || matchs.length == 0) {
        alert(name + "格式不对，必须为整数");
        return false;
    }
    return true;
}

Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

function generateUniqId() {
    var random = Math.random();
    random = ("00000" + random).replace(/\./g, '');
    random = random.substr(random.length - 5);

    var date = new Date();
    var time = date.Format("yyyyMMddHHmmss");
    var ms = "00" + date.getMilliseconds();
    ms = ms.substr(ms.length - 3);
    return time + ms + random;
}

function changeIframeHeight() {
    $("iframe").each(function() {
        try{
            if(!this.contentWindow && !this.contentWindow.document){
                return;
            }
            var frameBody = this.contentWindow.document.body;
            if (frameBody) {
                if ($(this).height != frameBody.scrollHeight) {
                    $(this).height(frameBody.scrollHeight);
                }
            } 
        }catch(e){}
    });
}

$(window).resize(function(){
	clearTimeout($.windowResizeTime);
	$.windowResizeTime = setTimeout(function(){
		changeIframeHeight();
	}, 200);
});

function autoChangeIframeHeight() {
    changeIframeHeight();
    setTimeout("autoChangeIframeHeight()", 1000);
}

function changeCodeMirrorWidth(code, id, padding) {
    code.setSize(0);
    code.setSize($("#" + id).parents("td").width() - padding);
}

function autoChangeCodeMirrorWidth(code, id, padding) {
    changeCodeMirrorWidth(code, id, padding);
    setTimeout(function() {
        autoChangeCodeMirrorWidth(code, id, padding);
    }, 1000);
}

///////////////////////////////////////////////////////////////////////////////
var WFE = {};
WFE.getBaseUrl = function() {
    var tags = $("base");
    if (tags.length == 0) {
        var href = window.location.href;
        var index = href.search(/[#?]/gi);
        if (index != -1) {
            href = href.substr(0, index);
        }
        return href.substr(0, href.lastIndexOf("/") + 1);
    } else {
        return tags[0].href;
    }
};

WFE.getPageUrl = function() {
    return window.location.href;
};

WFE.getDate = function(date) {
    var d = date ? date : new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
};

WFE.getTime = function(date) {
    var d = date ? date :  new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
        + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
};

WFE.escapeAttr = function(value) {
    value = value.replace(/&/g, "&amp;");
    value = value.replace(/"/g, "&quot;");
    value = value.replace(/</g, "&lt;");
    value = value.replace(/>/g, "&gt;");
    return value;
};

WFE.openUrl = function(url, title) {
    if (typeof(addNewTab) == "function") {
        addNewTab(title, url);
    } else {
        if (typeof(top.parent.addTab) == "function") {
            top.parent.addTab(title, url);
        } else {
            window.open(url);
        }
    }
};

WFE.showHideTR = function(triger, target) {
    var obj = $("#" + triger)[0];
    if (obj.innerHTML == "查看") {
        $("#" + target).css("display", "table-row");
        obj.innerHTML = "隐藏";
    } else if (obj.innerHTML == "隐藏") {
        $("#" + target).css("display", "none");
        obj.innerHTML = "查看";
    }
};

///////////////////////////////////////////////////////////////////////////////
var Form = {};

Form.setRadioValue = function(name, value) {
    $(":radio[name=" + name + "]").each(function() {
        if (this.value == value) {
            this.checked = true;
        }
    });
};

Form.getRadioValue = function(name) {
    var value = "";
    $(":radio[name=" + name + "]").each(function() {
        if (this.checked) {
            value = this.value;
        }
    });
    return value;
};

Form.getRadioText = function(name) {
    var value = "";
    $(":radio[name=" + name + "]").each(function() {
        if (this.checked) {
            var labels = $("label[for=" + this.id + "]");
            if (labels.length > 0) {
                value = labels[0].innerHTML;
            } else {
                value = this.value;
            }
        }
    });
    return value;
};

Form.getCheckBoxValue = function(name) {
    var value = "";
    $(":checkbox[name=" + name + "]").each(function() {
        if (this.checked) {
            if (value) {
                value += ";"
            }
            value += this.value;
        }
    });
    return value;
};

WFE.showUploadWindow = function(id) {
    var url = WFE.getBaseUrl() + "/w/flow/upload";

    var ifrObj = $('<iframe id="upload_iframe" name="upload_iframe" style="display: none"></iframe>');
    ifrObj.appendTo($('body'));

    var dd = '<div id="dd">';
    dd += '<form id="upload_form" target="upload_iframe" method="post" enctype="multipart/form-data" action="' + url + '">';
    dd += '<input type="file" name="upload_file" id="upload_file"/><span style="color: red">最大50M</span>';
    dd += '</form>';
    dd += '</div>';

    var ddObj = $(dd);
    ddObj.appendTo($("body"));

    function close() {
        ddObj.dialog('destroy');
        ifrObj.remove();
    }

    ifrObj.load(function() {
        var response = this.contentWindow.document.body.innerHTML;
        if (!response) {
            return;
        }

        $('body').find('#ajax-mask').remove();

        // 超过文件大小限制
        if (response.indexOf('SizeLimitExceededException') >= 0) {
            alert("文件不允许超过50M");
            return;
        }

        var result = JSON.parse(response);
        var code = result.code;
        var data = result.data;

        if (code != 0) {
            alert("上传文件失败" + (data ? ", " + data : ""));
        } else {
            var fileName = $("#upload_file").val();
            fileName = fileName.substr(fileName.lastIndexOf("\\") + 1);

            $("#" + id + "_text")[0].value = fileName;
            $("#" + id + "_value")[0].value = data[0];
        }

        close();
    });

    ddObj.show().dialog({
        title: "文件上传",
        width: 400,
        heihgt: 300,
        modal: true,
        buttons:[{
            text:'确定',
            handler:function(){
                if (!$("#upload_file").val()) {
                    return;
                }

                $('body').append('<div id="ajax-mask"><div class="ajax-mask"></div><img class="ajax-loading" src="http://www.wsd.com/css/images/ajax-loading.gif" /></div>');
                $("#upload_form").submit();
            }
        },{
            text:'取消',
            handler:function(){
                close();
            }
        }]
    });
};

Form.getUploadValue = function(id) {
    return $("#" + id + "_value")[0].value;
};

Form.getUploadText = function(id) {
    return $("#" + id + "_text")[0].value;
};

Form.getCheckBoxText = function(name) {
    var value = "";
    $(":checkbox[name=" + name + "]").each(function() {
        if (this.checked) {
            if (value) {
                value += ";"
            }

            var labels = $("label[for=" + this.id + "]");
            if (labels.length > 0) {
                value += labels[0].innerHTML;
            } else {
                value += this.value;
            }
        }
    });
    return value;
};

Form.getTextValue = function(id) {
    return $("#" + id)[0].value;
};

Form.getSelectValue = function(id) {
    var value = "";
    $("select[id=" + id + "] > option").each(function() {
        if (this.selected) {
            value = this.value;
        }
    });
    return value;
};

Form.getComboboxValue = function(id) {
//    var value = $('#'+id).data('combobox-value');
//    if(value === null || value === undefined){
//        value = $('#'+id).next().find('input[type=hidden]').val();
//    }
    var value = $('#'+id).next().find('input[type=hidden]').val();
    return value;
}

Form.getComboboxText = function(id) {
    var text = $('#'+id).data('combobox-text');
    if(text === null || text === undefined || text === ''){
        text = $('#'+id).next().find('input[type=hidden]').val();
    }
    return text;
}

Form.getSelectText = function(id) {
    var text = "";
    $("select[id=" + id + "] > option").each(function() {
        if (this.selected) {
            text = this.text;
        }
    });
    return text;
};

Form.getMultiSelectValue = function(id) {
    return $("input[name='" + id + "_v']").val();
};

Form.getMultiSelectText = function(id) {
    return $("#" + id).val();
};

Form.getRTXValue = function(id) {
    return $("#" + id)[0].value;
};

Form.getDateValue = function(id) {
    return $("#" + id).datebox("getText");
};

$(function(){
    setTimeout(function(){
        
        var rightBox = $('#right_box');
        rightBox.find('.box_header').addClass('vtip').css('cursor', 'pointer').click(function(){
            var $this = $(this);
            if($this.attr('title') === '展开流程信息'){
                $this.css('borderBottom', '0px solid #A6BDE5');
                rightBox.find('.box_content').slideDown(500, function(){
                    $this.attr('title', '隐藏流程信息');
                });
            }else{
                rightBox.find('.box_content').slideUp(500, function(){
                    $this.attr('title', '展开流程信息').css('borderBottom', '1px solid #A6BDE5');
                });
            }
        });
        rightBox.find('.box_content').slideUp(500, function(){
            rightBox.find('.box_header').attr('title', '展开流程信息').css('borderBottom', '1px solid #A6BDE5');
        });
        
    }, 300);
});

///////////////////////////////////////////////////////////////////////////////
Instance = {};
Instance.getTask = function(instanceId) {
    var taskId;
    var exception;
    $.ajax({
        url: WFE.getBaseUrl() + "w/flow/has_task",
        data: {
            id: instanceId
        },
        type: "GET",
        cache: false,
        async: false,
        dataType: "json",
        success: function(json) {
            var code = json.code;
            var data = json.data;
            if (code != 0) {
                exception = "ajax request error, code=" + code + ", msg=" + data;
            } else {
                taskId = data;
            }
        },
        error: function (xhr, status, thrown) {
            exception = "ajax request error, status=" + status + ", thrown=" + thrown;
        }
    });
    if (exception != null) {
        throw exception;
    }
    return taskId;
};

/////////////////////////////////////////////////////////////////////////////////////
$.extend({
    ProxyAjax: function(options) {
        var proxy = WFE.getBaseUrl() + "others/s/http_proxy/service?PROXY_TARGET_URL=";
        options.url = proxy + encodeURIComponent(options.url);
        $.ajax(options);
    }
});

$.extend({
    cloneObj: function (obj) {
        var objClone;
        if (obj instanceof Array) {
            objClone = [];
            for (var i = 0; i < obj.length; i++)
                objClone[i] = $.cloneObj(obj[i]);
            return objClone;
        } else if (obj instanceof Object) {
            if (obj.constructor == Object) {
                objClone = new obj.constructor();
            } else {
                objClone = new obj.constructor(obj.valueOf());
            }
            for (var key in obj) {
                if (objClone[key] != obj[key]) {
                    if (typeof (obj[key]) == 'object') {
                        objClone[key] = $.cloneObj(obj[key]);
                    } else {
                        objClone[key] = obj[key];
                    }
                }
            }
            objClone.toString = obj.toString;
            objClone.valueOf = obj.valueOf;
            return objClone;
        }
        return obj;
    }
});